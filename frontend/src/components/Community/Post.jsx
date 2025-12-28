import React, { useState } from 'react';
import { Heart, MessageCircle, Send, User, Clock, TrendingUp, Plus, X, MoreVertical, Flag, Edit, Trash2 } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CommunitySupportForum = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Anonymous User',
            avatar: '👤',
            time: '2 hours ago',
            title: 'Struggling with anxiety lately',
            content: 'I\'ve been feeling really anxious about everything. Even small tasks feel overwhelming. Has anyone else experienced this? How do you cope?',
            likes: 12,
            comments: [
                {
                    id: 1,
                    author: 'Supportive Friend',
                    avatar: '🌟',
                    time: '1 hour ago',
                    content: 'You\'re not alone! I\'ve been there. Try deep breathing exercises and remember to take things one step at a time. You\'ve got this! 💙'
                },
                {
                    id: 2,
                    author: 'Caring Soul',
                    avatar: '💚',
                    time: '45 minutes ago',
                    content: 'Breaking tasks into smaller chunks really helped me. Also, don\'t hesitate to reach out to a professional if you need to. Sending you strength!'
                }
            ],
            category: 'anxiety',
            isLiked: false
        }
    ]);

    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', author: '' });
    const [newComment, setNewComment] = useState({});
    const [filter, setFilter] = useState('all');

    const categories = [
        { id: 'all', label: 'All Posts', color: 'purple' },
        { id: 'anxiety', label: 'Anxiety', color: 'blue' },
        { id: 'depression', label: 'Depression', color: 'indigo' },
        { id: 'stress', label: 'Stress', color: 'pink' },
        { id: 'general', label: 'General', color: 'teal' }
    ];

    const{data: userData}= supabase.auth.getUser();

    const handleCreatePost = () => {
        
        if (newPost.title.trim() && newPost.content.trim()) {
            const post = {
                id: Date.now(),
                author: newPost.author.trim() || 'Anonymous User',
                avatar: getRandomAvatar(),
                time: 'Just now',
                title: newPost.title,
                content: newPost.content,
                category: newPost.category,
                likes: 0,
                comments: [],
                isLiked: false
            };
            setPosts([post, ...posts]);
            setNewPost({ title: '', content: '', category: 'general', author: '' });
            setShowPostModal(false);
        }
    };

    const handleAddComment = (postId) => {
        if (newComment[postId]?.trim()) {
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [
                            ...post.comments,
                            {
                                id: Date.now(),
                                author: 'Helpful Friend',
                                avatar: getRandomAvatar(),
                                time: 'Just now',
                                content: newComment[postId]
                            }
                        ]
                    };
                }
                return post;
            }));
            setNewComment({ ...newComment, [postId]: '' });
        }
    };

    const handleLike = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    isLiked: !post.isLiked
                };
            }
            return post;
        }));
    };

    const getRandomAvatar = () => {
        const avatars = ['👤', '🌟', '💚', '💙', '🌸', '🌺', '🦋', '🌈', '✨', '💫'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    };

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.id === category);
        return cat ? cat.color : 'gray';
    };

    const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.category === filter);

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

                    {/* Category Filters */}
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
                    {filteredPosts.length === 0 ? (
                        <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-purple-200/50 p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-10 h-10 text-purple-400" />
                            </div>
                            <p className="text-gray-600 text-lg mb-2">No posts yet in this category</p>
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
                                            {post.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{post.author}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {post.time}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(post.category)}-100 text-${getCategoryColor(post.category)}-700`}>
                                        {categories.find(c => c.id === post.category)?.label}
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
                                        <span className="font-medium">{post.comments.length}</span>
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

                                        {/* Add Comment */}
                                        <div className="flex gap-3 ml-8">
                                            <input
                                                type="text"
                                                placeholder="Share your support..."
                                                value={newComment[post.id] || ''}
                                                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
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
                                        Your Name <span className="text-gray-400">(Optional - Leave blank to post anonymously)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Anonymous User"
                                        value={newPost.author}
                                        onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                {/* Category Selection */}
                                <div className="mb-4">
                                    <label className="text-sm text-gray-600 mb-2 block">Category</label>
                                    <select
                                        value={newPost.category}
                                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
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