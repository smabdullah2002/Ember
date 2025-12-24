import React, { useState } from 'react';
import { Heart, Wind, Brain, BookOpen, Headphones, Play } from 'lucide-react';
import BoxBreathingAnimation from '../../components/Selfhelp/Breating/Boxbreathing';
import Breathing478Animation from '../../components/Selfhelp/Breating/FourSevenEight';
import AlternateNostrilBreathing from '../../components/Selfhelp/Breating/AlternateBreathing';
import SoothingAudioCard from './../../components/Selfhelp/SoothingAudio/SoothingAudio';
import SoothingVideoCards from '../../components/Selfhelp/Meditation/Meditation';
import Journal from '../../components/Selfhelp/Journaling/Journal';


const Moodkit = () => {
  const [activeTab, setActiveTab] = useState('breathing');
  const [activeBreath, setActiveBreath] = useState(null);
  const [showBreathModal, setShowBreathModal] = useState(false);

  const tabs = [
    { id: 'breathing', label: 'Breathing', icon: Wind },
    { id: 'meditation', label: 'Meditation', icon: Brain },
    { id: 'journaling', label: 'Journaling', icon: BookOpen },
    { id: 'audio', label: 'Soothing Audio', icon: Headphones }
  ];

  const breathingtechniques = [
    {
      id: 'box-breathing',
      label: 'Box Breathing',
      icon: Play,
      component: <BoxBreathingAnimation />
    },
    {
      id: '4-7-8-breathing',
      label: '4-7-8 Breathing',
      icon: Play,
      component: <Breathing478Animation />
    },
    {
      id: 'mindful-breathing',
      label: 'Mindful Breathing',
      icon: Play,
      component: <AlternateNostrilBreathing />
    }
  ];

  return (
    <div className="min-h-screen p-8">
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
                Your personal wellness companion
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition
                    ${activeTab === tab.id
                      ? 'bg-purple-600 text-white'
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

        {/* Breathing Tab */}
        {activeTab === 'breathing' && (
          <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl p-8 border border-purple-200/50">
            {/* Header with gradient */}
            <div className="mb-8">
              <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Breathing Techniques
              </h2>
              <p className="text-gray-500 text-sm">
                Choose a technique to begin your mindful breathing practice
              </p>
            </div>

            {/* Techniques Grid */}
            <div className="space-y-4">
              {breathingtechniques.map((technique, index) => (
                <div
                  key={technique.id}
                  onClick={() => {
                    setActiveBreath(technique.id);
                    setShowBreathModal(true);
                  }}
                  className="group relative cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                  {/* Card */}
                  <div className="relative flex items-center gap-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1">
                    {/* Icon container */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <technique.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                        {technique.label}
                      </h3>
                    </div>

                    {/* Arrow indicator */}
                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>

                    {/* Bottom gradient accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom decoration */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}



        {/* audio Tab */}
        {activeTab === 'audio' && (

          <SoothingAudioCard />
        )}

        {/* meditation Tab */}
        {activeTab === 'meditation' && (
          <SoothingVideoCards />
        )}

        {/* journaling Tab */}
        {activeTab === 'journaling' && (
          <Journal />
        )}
      </div>

      {/* ================= MODAL OVERLAY ================= */}
      {showBreathModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBreathModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-purple-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-full mx-4 p-6">

            {breathingtechniques.find(t => t.id === activeBreath)?.component}

          </div>
        </div>
      )}
      {/* ================================================= */}
    </div>
  );
};

export default Moodkit;
