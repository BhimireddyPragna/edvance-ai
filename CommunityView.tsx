
import React from 'react';

const PEERS = [
  { name: 'Alice Chen', level: 14, goal: 'AI Engineer', streak: 42, active: true },
  { name: 'Mark Wilson', level: 8, goal: 'Full Stack Web Developer', streak: 7, active: true },
  { name: 'Sarah J.', level: 25, goal: 'Data Scientist', streak: 110, active: false },
  { name: 'Leo V.', level: 5, goal: 'Mobile App Developer', streak: 3, active: true },
];

const CommunityView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <header>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Learning Community</h1>
            <p className="text-slate-500">Connect with others on the same path as you.</p>
          </header>

          <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-bold text-slate-800">Global Activity</h2>
              <button className="text-xs font-bold text-blue-600">View All</button>
            </div>
            <div className="p-6 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-4">
                  <img src={`https://picsum.photos/seed/p${i}/40/40`} className="rounded-xl" alt="avatar" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold text-slate-800">User_{i * 42}</span> completed <span className="text-blue-600 font-bold">Introduction to React</span> in <span className="font-bold">Module 2</span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{i * 5}m ago</span>
                  </div>
                  <div className="flex space-x-1">
                    <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors">
                      <i className="fa-solid fa-heart text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
              <h3 className="text-2xl font-black mb-2">Live Study Room</h3>
              <p className="text-sm opacity-80 mb-6">Join 154 other students currently in focused study sessions.</p>
              <button className="bg-white text-blue-600 font-black px-6 py-3 rounded-2xl hover:bg-blue-50 transition-all">Join Session</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Study Buddies</h3>
              <p className="text-sm text-slate-500 mb-6">Match with someone learning similar topics.</p>
              <button className="bg-slate-900 text-white font-black px-6 py-3 rounded-2xl hover:bg-black transition-all">Find a Buddy</button>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="font-bold text-slate-800">Active Learners</h2>
            </div>
            <div className="p-4 space-y-2">
              {PEERS.map((peer, i) => (
                <div key={i} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center space-x-4">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${peer.name}/40/40`} className="rounded-xl" alt="avatar" />
                    {peer.active && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{peer.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{peer.goal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-orange-500 flex items-center justify-end">
                      <i className="fa-solid fa-fire mr-1"></i> {peer.streak}
                    </p>
                    <p className="text-[10px] text-slate-400 font-black">LVL {peer.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
             <div className="flex items-center space-x-3 mb-4">
               <div className="w-10 h-10 bg-amber-400 text-white rounded-xl flex items-center justify-center">
                 <i className="fa-solid fa-ranking-star"></i>
               </div>
               <h3 className="font-black text-amber-800 text-sm">League System</h3>
             </div>
             <p className="text-xs text-amber-700 leading-relaxed">
               You are currently in the <span className="font-bold">Bronze League</span>. Earn 450 more XP this week to promote to Silver!
             </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CommunityView;
