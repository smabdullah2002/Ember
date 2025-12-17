import React, { useState } from 'react';
import { BarChart3, MessageCircle, Users, HelpCircle, LineChart, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: 'todo' },
    { icon: MessageCircle, label: 'Chatbot', path: 'chat' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: HelpCircle, label: 'HelpHub', path: '/helphub' },
    { icon: LineChart, label: 'MoodBoard', path: '/moodboard' },
    { icon: Wrench, label: 'MoodKit', path: 'moodkit' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white w-64 p-6 flex flex-col">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-purple-700">Ember</h1>
        <p className="text-sm text-purple-600 mt-1">Mental Health Companion</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;
          
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setActiveItem(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-purple-700 shadow-md' 
                  : 'text-purple-600 hover:bg-white/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer or Additional Info */}
      <div className="mt-auto pt-6 border-t border-purple-200">
        <div className="text-xs text-purple-500 text-center">
          v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;