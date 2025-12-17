import React, { useState } from 'react';
import { MessageCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router';

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-20">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left Panel - Hero Section */}
                    <div className="md:w-1/2 bg-[url(reg2.jpeg)] bg-cover bg-center p-12 flex flex-col justify-center relative overflow-hidden">

                        <div className="relative z-10">
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-stone-600 text-lg font-medium mb-4">
                                    Ember
                                </div>
                            </div>

                            <h1 className="text-5xl font-bold text-stone-600 mb-6 leading-tight">
                                Start Your<br />
                                Wellness<br />
                                Journey
                            </h1>

                            <p className="text-stone-600 font-semibold text-lg mb-8">
                                Join our community and take the first step towards better mental health
                            </p>

                        </div>
                    </div>

                    {/* Right Panel - Registration Form */}
                    <div className="md:w-1/2 p-12">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
                                CREATE ACCOUNT
                            </h2>
                            <p className="text-gray-500 text-center mb-8">
                                Join MindMate and start your mental wellness journey
                            </p>

                            <div className="space-y-5">
                                {/* First Name and Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            FIRST NAME
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="First name"
                                                className="w-full pl-10 pr-4 py-3 text-stone-600 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            LAST NAME
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Last name"
                                                className="w-full pl-10 pr-4 py-3 text-stone-600 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                            placeholder="Enter your email"
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
                                            placeholder="Create password"
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

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CONFIRM PASSWORD
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            className="w-full pl-10 pr-12 py-3 text-stone-600 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                                        I agree to the{' '}
                                        <span className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
                                            Privacy Policy
                                        </span>{' '}
                                        and{' '}
                                        <span className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
                                            Terms of Service
                                        </span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={!agreedToTerms}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create your account
                                </button>

                                {/* Sign In Link */}
                                <p className="text-center text-gray-600 mt-6">
                                    Already have an account?{' '}
                                    <Link to="/login">
                                        <span className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer">
                                            Sign in
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

export default Registration;