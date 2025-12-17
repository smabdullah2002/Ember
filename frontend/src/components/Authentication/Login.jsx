import React, { useState } from 'react';
import { MessageCircle, Mail, Lock, Eye, EyeOff, Bot, Heart, Users, Shield } from 'lucide-react';
import { Link } from 'react-router';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('Login submitted:', formData);
    };

    const features = [
        {
            icon: Bot,
            title: 'AI-Powered Support',
            description: 'Intelligent mental health guidance'
        },
        {
            icon: Heart,
            title: 'Personalized Care',
            description: 'Tailored wellness plans just for you'
        },
        {
            icon: Users,
            title: 'Community Support',
            description: 'Connect with others on similar journeys'
        },
        {
            icon: Shield,
            title: 'Privacy & Security',
            description: 'Your mental health data is always protected'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-20">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left Panel - Hero Section */}
                    <div className="md:w-1/2 relative p-12 flex flex-col justify-between overflow-hidden">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-[url(login2.jpg)] bg-cover bg-center filter opacity-85 z-0"
                        ></div>

                        {/* Decorative elements */}
                        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl z-0"></div>
                        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400 rounded-full opacity-30 blur-3xl z-0"></div>

                        {/* Foreground content */}
                        <div className="relative z-10 text-stone-600">
                            {/* Logo */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium mb-4">
                                    Ember
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="mb-12">
                                <h1 className="text-5xl font-bold mb-6 leading-tight">
                                    Your Mental<br />
                                    Health<br />
                                    Companion
                                </h1>
                                <p className="font-semibold text-lg">
                                    Join thousands of users who trust MindMate to support their mental wellness journey
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-6">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                                                <p className="text-md font-semibold">{feature.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Login Form */}
                    <div className="md:w-1/2 p-12 flex items-center">
                        <div className="max-w-md mx-auto w-full">
                            {/* Logo Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
                                WELCOME BACK
                            </h2>
                            <p className="text-gray-500 text-center mb-8">
                                Sign in to continue your mental wellness journey
                            </p>

                            <div className="space-y-5">
                                {/* Email Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        EMAIL ADDRESS
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="sma@gmail.com"
                                            className="w-full pl-10 pr-4 py-3 text-stone-600 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        PASSWORD
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••"
                                            className="w-full pl-10 pr-12 py-3 text-stone-600 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </label>
                                    </div>
                                    <span className="text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
                                        Forgot password?
                                    </span>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Sign in to your account
                                </button>

                                {/* Sign Up Link */}
                                <p className="text-center text-gray-600 mt-6">
                                    Don't have an account?{' '}
                                    <Link to="/registration">
                                        <span className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer">
                                            Sign up for free
                                        </span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;