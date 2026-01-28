
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfile, Roadmap } from '../types';

interface DashboardProps {
  profile: UserProfile;
  roadmap: Roadmap | null;
  onContinue: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, roadmap, onContinue }) => {
  const chartData = [
    { name: 'Mon', xp: 0 },
    { name: 'Tue', xp: 0 },
    { name: 'Wed', xp: 0 },
    { name: 'Thu', xp: 0 },
    { name: 'Fri', xp: 0 },
    { name: 'Sat', xp: 0 },
    { name: 'Sun', xp: 0 },
  ];

  const totalUnits = roadmap?.modules.reduce((acc, m) => acc + m.units.length, 0) || 0;
  const masteredUnits = roadmap?.modules.reduce((acc, m) => acc + m.units.filter(u => u.isCompleted).length, 0) || 0;
  const studyHours = (profile.xp / 1000).toFixed(1);

  const activityDays = [
    { day: 'M', active: false },
    { day: 'T', active: false },
    { day: 'W', active: false },
    { day: 'T', active: false },
    { day: 'F', active: false },
    { day: 'S', active: false },
    { day: 'S', active: true },
  ];

  const getStreakGradient = () => {
    if (profile.streak >= 30) return 'streak-gradient-high';
    if (profile.streak >= 7) return 'streak-gradient-med';
    return 'streak-gradient-low';
  };

  const getNextMilestone = () => {
    if (profile.streak < 3) return 3;
    if (profile.streak < 7) return 7;
    if (profile.streak < 30) return 30;
    if (profile.streak < 100) return 100;
    return 365;
  };

  const milestone = getNextMilestone();
  const prevMilestone = profile.streak >= 30 ? 30 : profile.streak >= 7 ? 7 : profile.streak >= 3 ? 3 : 0;
  const progress = ((profile.streak - prevMilestone) / (milestone - prevMilestone)) * 100;

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="animate-in slide-in-from-left duration-500">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Welcome, {profile.name}! 👋</h1>
            <p className="text-slate-500 text-lg">Mastering <span className="text-blue-600 font-bold">{profile.careerGoal}</span> with <span className="italic">Edvance AI</span></p>
          </div>
          <div className="bg-white border rounded-[2rem] p-5 flex space-x-8 items-center shadow-sm">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">XP Goal</p>
              <p className="text-xl font-bold text-slate-800">{profile.xp % 1000} / 1000</p>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Level</p>
              <p className="text-xl font-bold text-blue-600">{profile.level}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-800">Knowledge Growth</h2>
                <div className="flex space-x-2">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                    Live Insights
                  </span>
                </div>
              </div>
              <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
                  </AreaChart>
                </ResponsiveContainer>
                {profile.xp === 0 && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <p className="text-slate-300 font-bold text-sm bg-white/80 px-4 py-2 rounded-full">Complete units to see your growth chart</p>
                   </div>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col space-y-6">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Units Mastered</p>
                    <p className="text-3xl font-black text-slate-800 leading-none">{masteredUnits} / {totalUnits}</p>
                  </div>
                </div>
                
                {/* STREAK FEATURE MOVED HERE */}
                <div className={`${getStreakGradient()} rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-blue-100 transition-all duration-500`}>
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Current Streak</p>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-4xl font-black">{profile.streak}</span>
                        <span className="text-xs font-black opacity-80 uppercase tracking-tighter">Days</span>
                      </div>
                    </div>
                    <div className="animate-flame">
                      <i className={`fa-solid fa-fire text-4xl ${profile.streak >= 7 ? 'text-yellow-300' : 'text-orange-300'}`}></i>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 relative z-10">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                      <span>Goal: {milestone} Days</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(5, progress)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                    <div className="flex -space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          title={i < profile.freezeTokens ? "Freeze Token Active" : "Token Used"}
                          className={`w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-xs transition-all ${
                            i < profile.freezeTokens 
                              ? 'bg-amber-400 text-white animate-token' 
                              : 'bg-white/10 text-white/30'
                          }`}
                        >
                          <i className="fa-solid fa-snowflake"></i>
                        </div>
                      ))}
                    </div>
                    {profile.hasInsurance ? (
                      <div className="animate-shield">
                        <div className="bg-emerald-400 text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center shadow-lg">
                          <i className="fa-solid fa-shield-halved mr-1.5 text-xs"></i>
                          SAFE
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] font-black bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
                        GET INSURANCE
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-between">
                <div className="flex items-center space-x-5 mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
                    <i className="fa-solid fa-stopwatch"></i>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Study Hours</p>
                    <p className="text-3xl font-black text-slate-800 leading-none">{studyHours}h</p>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                    <span className="text-xs font-bold text-emerald-600">+12%</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Your learning speed has increased by 12% this week!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Weekly Activity</h2>
                <p className="text-sm text-slate-500 mb-8">Track your consistency.</p>
                
                <div className="grid grid-cols-7 gap-3 mb-10">
                  {activityDays.map((d, i) => (
                    <div key={i} className="flex flex-col items-center space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.day}</span>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm transition-all duration-500 ${
                        d.active 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                          : 'bg-slate-50 text-slate-200'
                      }`}>
                        {d.active ? <i className="fa-solid fa-fire text-xs"></i> : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-3xl border border-orange-100 flex items-center gap-4">
                     <div className="w-10 h-10 bg-white text-orange-500 rounded-xl flex items-center justify-center text-xl shadow-sm">
                        <i className="fa-solid fa-bolt"></i>
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest leading-none mb-1">Total XP</p>
                       <p className="text-lg font-black text-orange-950 leading-none">{profile.xp}</p>
                     </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-3xl border border-purple-100 flex items-center gap-4">
                     <div className="w-10 h-10 bg-white text-purple-500 rounded-xl flex items-center justify-center text-xl shadow-sm">
                        <i className="fa-solid fa-ranking-star"></i>
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-purple-800 uppercase tracking-widest leading-none mb-1">Global Rank</p>
                       <p className="text-lg font-black text-purple-950 leading-none">#1,402</p>
                     </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={onContinue}
                className="mt-12 w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center justify-center group active:scale-95"
              >
                Continue Learning
                <i className="fa-solid fa-rocket ml-3 group-hover:translate-y-[-4px] transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
