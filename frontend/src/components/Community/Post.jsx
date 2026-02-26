import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, User, Clock, TrendingUp, Plus, X, MoreVertical, Flag, Edit, Trash2 } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";
import axios from 'axios';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CommunitySupportForum = () => {
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);

    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPost, setNewPost] = useState({ title: '', content: '', catagory: 'general', author: '' });
    const [newComment, setNewComment] = useState({});
    const [filter, setFilter] = useState('all');
    const [postType, setPostType] = useState("user");
    const [commentsLoading, setCommentsLoading] = useState({});
    const [commentsPagination, setCommentsPagination] = useState({});
    const [commentError, setCommentError] = useState({});

    const COMMENTS_PER_PAGE = 3;


    const categories = [
        { id: 'all', label: 'All Posts', color: 'purple' },
        { id: 'anxiety', label: 'Anxiety', color: 'blue' },
        { id: 'depression', label: 'Depression', color: 'indigo' },
        { id: 'stress', label: 'Stress', color: 'pink' },
        { id: 'general', label: 'General', color: 'teal' }
    ];

    const fetchUserData = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) return null;
        return data.user;
    };
    const handleCreatePost = async () => {
        if (!newPost.title.trim() || !newPost.content.trim()) return;

        let userId = null;
        let author = "Anonymous";

        if (postType === "user") {
            const user = await fetchUserData();
            if (!user) return; // not logged in
            const { data: profileData } = await supabase
                .from('profile')
                .select('first_name')
                .eq('id', user.id)
                .single();
            userId = user.id;
            author = profileData.first_name || "NULL"; // or name
        }

        const post = {
            // id: Date.now(),
            title: newPost.title,
            content: newPost.content,
            catagory: newPost.catagory,
            user_id: userId,        // null if anonymous
            author: author,
            avatar: postType === "user" ? "👤" : "🕶️",
            time: "just now",
            likes: 0,
            comments: [],
            total_comments: 0,
            isLiked: false,
        };

        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session.access_token;
            await axios.post(
                "http://127.0.0.1:8000/community/post",
                post,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        } catch {
            console.error("Error creating post");
            return;
        }

        setPosts([post, ...posts]);
        setNewPost({ title: "", content: "", catagory: "general" });
        setShowPostModal(false);
    };



    const fetchPosts = async () => {
        setPostsLoading(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const userId = sessionData?.session?.user?.id;

            const response = await axios.get("http://127.0.0.1:8000/community/posts");

            // Fetch this user's likes
            const { data: userLikes } = await supabase
                .from("post_likes")
                .select("post_id")
                .eq("user_id", userId);

            const likedPostIds = new Set(userLikes?.map(l => l.post_id) || []);

            const formattedPosts = response.data.posts.map(post => ({
                id: post.id,
                author: post.author || "Anonymous",
                avatar: post.author ? "👤" : "🕶️",
                time: formatTime(post.created_at),
                title: post.title,
                content: post.content,
                catagory: post.catagory,
                likes: post.likes || 0,
                comments: [],
                isLiked: likedPostIds.has(post.id),  // ✅ correct on load
                total_comments: post.total_comments ?? post.comment_count ?? post.comments_count ?? 0,
            }));

            setPosts(formattedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error.response?.data);
        } finally {
            setPostsLoading(false);
        }
    };
    const formatTime = (timestamp) => {
        if (!timestamp) return "Just now";

        const now = new Date();
        const postTime = new Date(timestamp);
        const diffMs = now - postTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleAddComment = async (postId) => {
        if (!newComment[postId]?.trim()) return;
        setCommentError(prev => ({ ...prev, [postId]: null })); // clear previous error

        let userId = null;
        const user = await fetchUserData();
        if (user) {
            userId = user.id;
        }

        const comment = {
            post_id: postId,
            user_id: userId,
            content: newComment[postId]
        }

        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session.access_token;
            const response = await axios.post(
                "http://127.0.0.1:8000/community/comment",
                comment,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            console.log(response.data);

            setNewComment(prev => ({ ...prev, [postId]: '' }));
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, total_comments: (post.total_comments || 0) + 1 }
                        : post
                )
            );

            if (selectedPost === postId) {
                fetchComments(postId, 1, false);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setCommentError(prev => ({
                    ...prev,
                    [postId]: error.response.data.detail
                }));
            } else {
                console.error("Error adding comment");
            }
        }
    }

    const fetchComments = async (postId, page = 1, append = false) => {
        if (commentsLoading[postId]) return;

        setCommentsLoading(prev => ({ ...prev, [postId]: true }));

        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/community/comments/${postId}?page=${page}&page_size=${COMMENTS_PER_PAGE}`
            );

            console.log(response.data);
            const pagination = response.data.pagination;

            // Fetch all authors in parallel
            const commentsWithAuthors = await Promise.all(
                response.data.comments.map(async (comment) => {

                    const { data } = await supabase
                        .from('profile')
                        .select('first_name')
                        .eq('id', comment.user_id)
                        .single();

                    const authorName = data?.first_name || "Anonymous";



                    return {
                        id: comment.id,
                        author: authorName,
                        time: formatTime(comment.created_at),
                        content: comment.comment,
                        avatar: getRandomAvatar(),
                    };
                })
            );

            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: append ? [...post.comments, ...commentsWithAuthors] : commentsWithAuthors,
                            total_comments: pagination?.total || 0

                        };
                    }
                    return post;
                })
            );

            setCommentsPagination(prev => ({
                ...prev,
                [postId]: pagination,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setCommentsLoading(prev => ({ ...prev, [postId]: false }));
        }
    };


    useEffect(() => {
        if (selectedPost) {
            fetchComments(selectedPost, 1, false);
        }

    }, [selectedPost]);



    const handleLike = async (postId) => {
        const { data } = await supabase.auth.getSession();
        const token = data.session.access_token;

        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/community/post/${postId}/like`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { likes, liked } = response.data;

            setPosts(prev => prev.map(post =>
                post.id === postId
                    ? { ...post, likes, isLiked: liked }  // use isLiked not liked
                    : post
            ));
        } catch (e) {
            console.error("Failed to update likes:", e.response?.data);
        }
    };

    const getRandomAvatar = () => {
        const avatars = ['👤', '🌟', '💚', '💙', '🌸', '🌺', '🦋', '🌈', '✨', '💫'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    };

    const getCategoryColor = (catagory) => {
        const cat = categories.find(c => c.id === catagory);
        return cat ? cat.color : 'gray';
    };

    const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.catagory === filter);

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                        Community Support
                    </h1>
                    <p className="text-gray-600 text-lg mb-2">
                        Share your thoughts, find support, and help others
                    </p>
                    <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                        A safe space to express your feelings and connect with a caring community
                    </p>
                </div>

                {/* Guidelines Banner */}
                <div className="backdrop-blur-md bg-blue-100/70 border border-blue-300 rounded-2xl p-6 mb-8 shadow-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Community Guidelines
                    </h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Be kind, respectful, and supportive to everyone</li>
                        <li>• Share your experiences, but respect others' privacy</li>
                        <li>• If you're in crisis, please contact emergency services or helplines immediately</li>
                        <li>• Report any concerning content to moderators</li>
                    </ul>
                </div>

                {/* Create Post Button & Filters */}
                <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-purple-200/50 p-6 mb-8">
                    <button
                        onClick={() => setShowPostModal(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 mb-6"
                    >
                        <Plus className="w-5 h-5" />
                        Share Your Thoughts
                    </button>

                    {/* catagory Filters */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${filter === cat.id
                                    ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white shadow-lg`
                                    : 'bg-white/50 text-gray-700 hover:bg-white/80'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                    {postsLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={`loading-post-${index}`}
                                className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-purple-200/50 p-6 animate-pulse"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-200"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-purple-200 rounded w-1/4"></div>
                                        <div className="h-3 bg-purple-100 rounded w-1/3"></div>
                                    </div>
                                </div>
                                <div className="h-6 bg-purple-200 rounded w-2/3 mb-3"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 bg-purple-100 rounded w-full"></div>
                                    <div className="h-4 bg-purple-100 rounded w-5/6"></div>
                                </div>
                                <div className="h-px bg-purple-100 mb-4"></div>
                                <div className="flex gap-6">
                                    <div className="h-4 bg-purple-100 rounded w-16"></div>
                                    <div className="h-4 bg-purple-100 rounded w-16"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredPosts.length === 0 ? (
                        <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-purple-200/50 p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-10 h-10 text-purple-400" />
                            </div>
                            <p className="text-gray-600 text-lg mb-2">No posts yet in this catagory</p>
                            <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-purple-200/50 p-6 transition-all duration-300 hover:shadow-2xl animate-fade-in"
                            >
                                {/* Post Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                                            {post.avatars}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{post.author}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {post.time}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(post.catagory)}-100 text-${getCategoryColor(post.catagory)}-700`}>
                                        {categories.find(c => c.id === post.catagory)?.label}
                                    </span>
                                </div>

                                {/* Post Content */}
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h3>
                                <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                                    {post.content}
                                </p>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-transparent mb-4"></div>

                                {/* Post Actions */}
                                <div className="flex items-center gap-6 mb-4">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center gap-2 transition-all duration-300 ${post.isLiked ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                        <span className="font-medium">{post.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="font-medium">{post.total_comments}</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {selectedPost === post.id && (
                                    <div className="mt-4 space-y-4 animate-fade-in">
                                        {/* Existing Comments */}
                                        {post.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl p-4 ml-8"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xl flex-shrink-0">
                                                        {comment.avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-gray-800 text-sm">
                                                                {comment.author}
                                                            </span>
                                                            <span className="text-xs text-gray-500">{comment.time}</span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm leading-relaxed">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Load More Comments Button */}
                                        {commentsPagination[post.id]?.has_next && (
                                            <div className="ml-8">
                                                <button
                                                    onClick={() =>
                                                        fetchComments(
                                                            post.id,
                                                            (commentsPagination[post.id]?.page || 1) + 1,
                                                            true
                                                        )
                                                    }
                                                    disabled={commentsLoading[post.id]}
                                                    className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {commentsLoading[post.id] ? 'Loading...' : 'Load More Comments'}
                                                </button>
                                            </div>
                                        )}

                                        {/* Add Comment */}
                                        <div className="flex flex-col gap-2 ml-8">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Share your support..."
                                                    value={newComment[post.id] || ''}
                                                    onChange={(e) => {
                                                        setNewComment({ ...newComment, [post.id]: e.target.value });
                                                        setCommentError(prev => ({ ...prev, [post.id]: null })); // clear error on type
                                                    }}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                    className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post.id)}
                                                    disabled={!newComment[post.id]?.trim()}
                                                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {commentError[post.id] && (
                                                <p className="text-red-500 text-md px-1">
                                                    ⚠️ {commentError[post.id]}
                                                   
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Create Post Modal */}
                {showPostModal && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                        onClick={() => setShowPostModal(false)}
                    >
                        <div
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-light text-white">Share Your Thoughts</h3>
                                </div>
                                <button
                                    onClick={() => setShowPostModal(false)}
                                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                                {/* Author Name (Optional) */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 mb-2 block">
                                        Post as
                                    </label>


                                    <select
                                        value={postType}
                                        onChange={(e) => setPostType(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="user">Post as me</option>
                                        <option value="anonymous">Post anonymously</option>
                                    </select>
                                </div>

                                {/* catagory Selection */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 mb-2 block">catagory</label>
                                    <select
                                        value={newPost.catagory}
                                        onChange={(e) => setNewPost({ ...newPost, catagory: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                    >
                                        {categories.filter(c => c.id !== 'all').map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Title */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 mb-2 block">Title</label>
                                    <input
                                        type="text"
                                        placeholder="What's on your mind?"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    <label className="text-sm text-gray-600 mb-2 block">Your Thoughts</label>
                                    <textarea
                                        placeholder="Share what you're feeling..."
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        rows="6"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPost.title.trim() || !newPost.content.trim()}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CommunitySupportForum;