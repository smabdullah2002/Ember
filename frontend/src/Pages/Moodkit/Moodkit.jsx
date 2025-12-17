import React, { useState } from 'react';
import { Heart, Wind, Brain, BookOpen, Headphones, Play, Eye } from 'lucide-react';
import BoxBreathingAnimation from '../../components/Selfhelp/Breating/Boxbreathing';


const Moodkit = () => {
    const [activeTab, setActiveTab] = useState('breathing');
    const [activeBreath, setActiveBreath] = useState('box-breathing');

    const tabs = [
        { id: 'breathing', label: 'Breathing', icon: Wind },
        { id: 'meditation', label: 'Meditation', icon: Brain },
        { id: 'journaling', label: 'Journaling', icon: BookOpen },
        { id: 'audio', label: 'Soothing Audio', icon: Headphones }
    ];

    const breathingtechniques = [
        { id: 'box-breathing', label: 'Box Breathing', icon: Play, component: <BoxBreathingAnimation /> },
        { id: '4-7-8-breathing', label: '4-7-8 Breathing', icon: Play },
        { id: 'mindful-breathing', label: 'Mindful Breathing', icon: Play }
        // Additional techniques can be added here
    ];


    return (
        <div className="min-h-screen  p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-purple-700">
                                Self-Help Toolkit
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Your personal wellness companion for mental health support
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                    <div className="flex gap-3">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === "breathing" && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-150">
                        <h2 className="text-2xl font-bold text-purple-700 mb-4">Breathing Techniques</h2>

                        <div>
                            {breathingtechniques.map((technique) => (
                                <div key={technique.id} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <h3 className="text-xl font-semibold text-purple-600 mb-2 flex items-center gap-2" onClick={() => setActiveBreath(technique.id)}>
                                        <technique.icon className="w-5 h-5" />
                                        {technique.label}
                                    </h3>

                                    {activeBreath === technique.id && (
                                        <div className="mt-4">
                                            {technique.component}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default Moodkit;