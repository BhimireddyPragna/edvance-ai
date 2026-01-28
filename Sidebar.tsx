
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div 
      className={`bg-white border-r h-screen flex flex-col py-6 shadow-sm z-50 transition-all duration-300 ease-in-out relative ${
        isExpanded ? 'w-64 px-4' : 'w-20 items-center'
      }`}
    >
      {/* Expand Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-20 bg-white border border-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm z-[70] transition-transform duration-300"
        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
      </button>

      {/* Header / Logo */}
      <div 
        className={`flex items-center mb-10 cursor-pointer transform hover:scale-105 transition-all ${
          isExpanded ? 'px-2' : 'justify-center'
        }`}
        onClick={() => setActiveTab('dashboard')}
      >
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-blue-100 transform hover:rotate-6 transition-transform">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM7.5 5C5.57 5 4 6.57 4 8.5c0 2.89 3.14 5.74 8 10.15 4.86-4.41 8-7.26 8-10.15 0-1.93-1.57-3.5-3.5-3.5-1.54 0-3.04.99-3.56 2.36h-1.88C10.54 5.99 9.04 5 7.5 5zM9 13h6v-1.5H9V13zm0-3h6V8.5H9V10z" />
          </svg>
        </div>
        {isExpanded && (
          <div className="ml-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-xl font-black text-slate-800 tracking-tighter block leading-none">Edvance</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">AI Learning</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 space-y-2 w-full">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group w-full px-2">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center rounded-2xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              } ${isExpanded ? 'px-4 py-3' : 'w-12 h-12 justify-center mx-auto'}`}
            >
              <div className="flex-shrink-0 flex items-center justify-center">
                <i className={`fa-solid ${tab.icon} ${isExpanded ? 'text-lg' : 'text-xl'}`}></i>
              </div>
              {isExpanded && (
                <span className="ml-4 text-sm font-black tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {tab.label}
                </span>
              )}
            </button>
            
            {/* Tooltip - Only show when collapsed */}
            {!isExpanded && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 shadow-2xl z-[60] whitespace-nowrap">
                {tab.label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div className={`mt-auto w-full ${isExpanded ? 'px-2' : 'flex flex-col items-center'}`}>
        <div 
          onClick={() => setActiveTab('profile')}
          className={`group flex items-center cursor-pointer p-2 rounded-2xl transition-colors hover:bg-slate-50 ${
            isExpanded ? 'w-full space-x-4' : 'justify-center w-14 h-14'
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className={`rounded-2xl bg-slate-100 border-2 shadow-sm flex items-center justify-center text-blue-600 font-black overflow-hidden transition-all ${
              activeTab === 'profile' ? 'border-blue-600 scale-105' : 'border-white group-hover:border-blue-200'
            } ${isExpanded ? 'w-12 h-12' : 'w-12 h-12'}`}>
              {profile.avatar && profile.avatar !== 'initial' ? (
                <img src={profile.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <span className="text-xl">{getInitial(profile.name)}</span>
              )}
            </div>
            {!isExpanded && (
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-black w-5 h-5 rounded-lg flex items-center justify-center border-2 border-white shadow-sm">
                {profile.level}
              </div>
            )}
          </div>
          
          {isExpanded && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">{profile.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-black uppercase">Level {profile.level}</span>
                <span className="text-[10px] text-blue-600 font-black">{profile.xp % 1000} XP</span>
              </div>
              <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${(profile.xp % 1000) / 10}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
