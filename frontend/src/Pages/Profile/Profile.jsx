import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit, Save, X, Camera, MapPin, Phone, Heart, MessageCircle, BookOpen, Activity, Lock, Eye, EyeOff, FileText, Trash2 } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";
import axios from 'axios';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const UserProfile = () => {
    // Replace this with your Supabase data
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordError, setPasswordError] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedPost, setEditedPost] = useState({ title: '', content: '', catagory: '' });


    // Mock function - Replace with your Supabase query
    useEffect(() => {
        const fetchUserData = async () => {

            const { data } = await supabase.auth.getUser();
            const user_id = data.user.id;

            const { data: profileData } = await supabase
                .from('profile')
                .select('*')
                .eq('id', user_id)
                .single();

            const postCount = await fetchUserPosts();

            // Mock data for demonstration
            setTimeout(() => {
                const userData = {
                    id: '1',
                    name: profileData.first_name + " " + profileData.last_name,
                    email: profileData.email,
                    phone: profileData.phone || "",
                    location: profileData.location || "",
                    bio: profileData.bio || "",
                    joinedDate: data.user.created_at,
                    avatar: null,
                    stats: {
                        postsCreated: postCount,
                        journalEntries: 28,
                        supportReceived: 89
                    }
                };
                setUserData(userData);
                setEditedData(userData);
                setLoading(false);
            }, 100);
        };
        fetchUserPosts();
        fetchUserData();

    }, []);

    const fetchUserPosts = async () => {
        try {
            const { data } = await supabase.auth.getUser();
            const user_id = data.user.id;

            const response = await axios.get("http://127.0.0.1:8000/community/posts");

            // Filter posts by current user
            const userPosts = response.data.posts.filter(post => post.author_id === user_id);
            setUserPosts(userPosts);
            return userPosts.length;
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }

    };

    const handleEditPost = (post) => {
        setEditingPostId(post.id);
        setEditedPost({
            title: post.title,
            content: post.content,
            catagory: post.catagory
        });
    };

    const handleCancelEditPost = () => {
        setEditingPostId(null);
        setEditedPost({ title: '', content: '', catagory: '' });
    };

    const handleSavePost = async (postId) => {
        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session.access_token;

            await axios.put(
                `http://127.0.0.1:8000/community/post/${postId}`,
                editedPost,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            // Update local state
            setUserPosts(userPosts.map(post =>
                post.id === postId
                    ? { ...post, ...editedPost }
                    : post
            ));

            setEditingPostId(null);
            setEditedPost({ title: '', content: '', catagory: '' });
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session.access_token;

            await axios.delete(
                `http://127.0.0.1:8000/community/post/${postId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            // Remove from local state
            setUserPosts(userPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
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

    const getCategoryColor = (catagory) => {
        const colors = {
            'anxiety': 'blue',
            'depression': 'indigo',
            'stress': 'pink',
            'general': 'teal'
        };
        return colors[catagory] || 'gray';
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedData({ ...userData });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({ ...userData });
    };

    const handleSave = async () => {

        const { data } = await supabase.auth.getUser();
        const user_id = data.user.id;

        await supabase.from('profile').update({
            first_name: editedData.name.split(" ")[0],
            last_name: editedData.name.split(" ")[1] || "",
            phone: editedData.phone,
            location: editedData.location,
            bio: editedData.bio
        }).eq('id', user_id);

        setUserData({ ...editedData });
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditedData({ ...editedData, [field]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Upload to Supabase Storage
            // const { data, error } = await supabase.storage
            //   .from('avatars')
            //   .upload(`${userId}/${file.name}`, file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedData({ ...editedData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordError('');

        // Validation
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {

            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            // Mock success
            alert('Password changed successfully!');
            setShowPasswordModal(false);
            setPasswordData({

                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setPasswordError(error.message || 'Failed to change password');
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field]
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                        My Profile
                    </h1>
                    <p className="text-gray-600">Manage your account and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-purple-200/50 p-8 sticky top-6">
                            {/* Avatar */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl overflow-hidden">
                                    {editedData.avatar ? (
                                        <img
                                            src={editedData.avatar}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-white" />
                                    )}
                                </div>

                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors shadow-lg">
                                        <Camera className="w-5 h-5 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Name */}
                            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
                                {userData.name}
                            </h2>
                            <p className="text-gray-600 text-center text-sm mb-6">
                                Member since {new Date(userData.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>

                            {/* Edit/Save Buttons */}
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-5 h-5" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="mt-8 pt-6 border-t border-purple-200">
                                <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                                    Activity Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm text-gray-700">Posts</span>
                                        </div>
                                        <span className="font-semibold text-purple-600">
                                            {userData.stats.postsCreated}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-gray-700">Journal Entries</span>
                                        </div>
                                        <span className="font-semibold text-blue-600">
                                            {userData.stats.journalEntries}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-teal-600" />
                                            <span className="text-sm text-gray-700">Support Given</span>
                                        </div>
                                        <span className="font-semibold text-teal-600">
                                            {userData.stats.supportReceived}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-purple-200/50 p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <User className="w-6 h-6 text-purple-600" />
                                Personal Information
                            </h3>

                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                        />
                                    ) : (
                                        <p className="text-gray-800 text-lg">{userData.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <p className="text-gray-800 text-lg">{userData.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">*Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editedData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                        />
                                    ) : (
                                        <p className="text-gray-800 text-lg">{userData.phone}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.location}
                                            onChange={(e) => handleChange('location', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                        />
                                    ) : (
                                        <p className="text-gray-800 text-lg">{userData.location}</p>
                                    )}
                                </div>

                                {/* Join Date */}
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Member Since
                                    </label>
                                    <p className="text-gray-800 text-lg">
                                        {new Date(userData.joinedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-purple-200/50 p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Heart className="w-6 h-6 text-purple-600" />
                                About Me
                            </h3>

                            {isEditing ? (
                                <textarea
                                    value={editedData.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    rows="6"
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">
                                    {userData.bio || 'No bio added yet.'}
                                </p>
                            )}
                        </div>

                        {/* Security Section */}
                        <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-purple-200/50 p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Lock className="w-6 h-6 text-purple-600" />
                                Security
                            </h3>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-800 font-medium mb-1">Password</p>
                                    <p className="text-gray-600 text-sm">Last changed 3 months ago</p>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
                                >
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* My Posts Section */}
                        <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl border border-purple-200/50 p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-purple-600" />
                                My Posts
                            </h3>

                            {userPosts.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">You haven't created any posts yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                                        >
                                            {editingPostId === post.id ? (
                                                // Edit Mode
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                                            Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editedPost.title}
                                                            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                                            Content
                                                        </label>
                                                        <textarea
                                                            value={editedPost.content}
                                                            onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                                                            rows="4"
                                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                                            Category
                                                        </label>
                                                        <select
                                                            value={editedPost.catagory}
                                                            onChange={(e) => setEditedPost({ ...editedPost, catagory: e.target.value })}
                                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                                        >
                                                            <option value="general">General</option>
                                                            <option value="anxiety">Anxiety</option>
                                                            <option value="depression">Depression</option>
                                                            <option value="stress">Stress</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleSavePost(post.id)}
                                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                            Save Changes
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEditPost}
                                                            className="flex-1 bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View Mode
                                                <>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h4 className=" font-semibold text-gray-800 mb-3">{post.author}</h4>
                                                            <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-transparent mb-4"></div>
                                                            <div className='flex justify-between'>
                                                                <h4 className="text-xl font-semibold text-blue-800 mb-2">
                                                                    {post.title}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(post.catagory)}-100 text-${getCategoryColor(post.catagory)}-700`}>
                                                                        {post.catagory}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatTime(post.created_at)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEditPost(post)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                                title="Edit post"
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePost(post.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                title="Delete post"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed text-xl">
                                                        {post.content}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <div
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-light text-white">Change Password</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordError('');
                                        setPasswordData({

                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {passwordError && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-700 text-sm">{passwordError}</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Current Password */}

                                    {/* New Password */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.new ? 'text' : 'password'}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({
                                                    ...passwordData,
                                                    newPassword: e.target.value
                                                })}
                                                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('new')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPasswords.new ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Must be at least 6 characters
                                        </p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords.confirm ? 'text' : 'password'}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({
                                                    ...passwordData,
                                                    confirmPassword: e.target.value
                                                })}
                                                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('confirm')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPasswords.confirm ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handlePasswordChange}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                    >
                                        Update Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordError('');
                                            setPasswordData({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            });
                                        }}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;