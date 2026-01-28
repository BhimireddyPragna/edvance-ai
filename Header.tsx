
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, profile }) => {
  const tabs = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'roadmap', icon: 'fa-route', label: 'Roadmap' },
    { id: 'skilltree', icon: 'fa-diagram-project', label: 'Skill Tree' },
    { id: 'community', icon: 'fa-users', label: 'Community' },
    { id: 'career', icon: 'fa-briefcase', label: 'Career Hub' },
    { id: 'support', icon: 'fa-circle-question', label: 'Support' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' },
  ];

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase() || '?';
  };

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Heart-shaped E Logo */}
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM7.5 5C5.57 5 4 6.57 4 8.5c0 2.89 3.14 5.74 8 10.15 4.86-4.41 8-7.26 8-10.15 0-1.93-1.57-3.5-3.5-3.5-1.54 0-3.04.99-3.56 2.36h-1.88C10.54 5.99 9.04 5 7.5 5zM9 13h6v-1.5H9V13zm0-3h6V8.5H9V10z" />
          </svg>
        </div>
        <div className="hidden sm:block">
          <span className="text-xl font-black text-slate-800 tracking-tighter">Edvance</span>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest leading-none">AI Learning</p>
        </div>
      </div>

      <nav className="flex items-center space-x-1 sm:space-x-3">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-lg`}></i>
            </button>
            {/* Tooltip */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 shadow-xl z-[60]">
              {tab.label}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-bottom-slate-900"></div>
            </div>
          </div>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="text-xs font-black text-slate-800 leading-none">{profile.name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Level {profile.level}</p>
        </div>
        <div 
          onClick={() => setActiveTab('profile')}
          className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-black cursor-pointer hover:border-blue-200 transition-all overflow-hidden"
        >
          {profile.avatar && profile.avatar !== 'initial' ? (
            <img src={profile.avatar} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            getInitial(profile.name)
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
