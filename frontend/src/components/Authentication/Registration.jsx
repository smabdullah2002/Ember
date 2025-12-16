import React, { useState } from 'react';
import { User, Mail, Calendar, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className='min-h-screen flex justify-center items-center p-4'>
            <div className="w-full max-w-md space-y-6">
                {/* Card Container */}
                <div className="bg-stone-800 rounded-2xl shadow-xl p-8 border border-gray-400">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-amber-100 mb-2">Registration</h2>
                        <p className="text-amber-100">Create your account to get started</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-amber-100 mb-2">
                                Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-amber-100 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Date of Birth Field */}
                        <div>
                            <label className="block text-sm font-semibold text-amber-100 mb-2">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-amber-100 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-100 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                            
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
                        >
                            Register
                        </button>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <p className="ttext-amber-100 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    By registering, you agree to our{' '}
                    <a href="#terms" className="text-gray-700 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#privacy" className="text-gray-700 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default Registration;