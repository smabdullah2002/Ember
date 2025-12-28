import React, { useState } from 'react';
import { BarChart3, MessageCircle, Users, HelpCircle, LineChart, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Sparkles, UserPen, LogOut } from 'lucide-react';
import { createClient } from "@supabase/supabase-js";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: 'mood-dashboard' },
    { icon: MessageCircle, label: 'Chatbot', path: 'chat' },
    { icon: Users, label: 'Community', path: 'community' },
    { icon: HelpCircle, label: 'HelpHub', path: 'helphub' },
    { icon: LineChart, label: 'MoodBoard', path: 'moodboard' },
    { icon: Wrench, label: 'MoodKit', path: 'moodkit' }
  ];

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');

  }

  return (
    <div className="min-h-screen bg-linear-to-bl rounded-tr-3xl shadow-lg from-purple-300 via-purple-200 to-purple-100 w-64 p-6 flex flex-col">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto'>
          <Sparkles className='w-5 h-5 text-white' />
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
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
      <div className="flex flex-col gap-4 w-40 mx-auto">
        <Link to="profile" className='btn btn-active rounded-2xl text-xl p-3 text-purple-600 font-semibold'>
          <UserPen className='h-5 w-5' />
          Profile
        </Link>
        <div className='btn btn-error bg-red-500 rounded-2xl text-xl text-white p-3 text-black font-semibold' onClick={handleLogout}>
          <LogOut className='h-5 w-5' />
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;