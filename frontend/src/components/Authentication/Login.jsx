import React, { useState } from 'react';
import { User, Mail, Calendar, Lock, CheckCircle } from 'lucide-react';

const Login = () => {
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
                        
                        <h2 className="text-3xl font-bold text-amber-100 mb-2">Login</h2>
                        <p className="text-amber-100">Enter your credentials to access your account</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">


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
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                        </div>


                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
                        >
                            Login
                        </button>


                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;