
import React, { useState } from 'react';
import { UserProfile, SkillLevel, LearningStyle } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
  roadmapProgress: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate, roadmapProgress }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    onUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset Edvance? All your progress, streaks, and roadmap will be permanently deleted.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase() || '?';
  };

  const isDefaultAvatar = (avatar: string) => {
    return !avatar || avatar.includes('picsum.photos/seed/user') || avatar === 'initial';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">
      <div className="max-w-6xl mx-auto p-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Header Section */}
          <section className="bg-white rounded-[3rem] p-8 border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="relative group">
                {isDefaultAvatar(profile.avatar) ? (
                  <div className="w-40 h-40 rounded-[3rem] border-8 border-slate-50 shadow-xl bg-blue-600 flex items-center justify-center text-white text-6xl font-black group-hover:scale-105 transition-transform duration-300">
                    {getInitial(profile.name)}
                  </div>
                ) : (
                  <img 
                    src={profile.avatar} 
                    className="w-40 h-40 rounded-[3rem] border-8 border-slate-50 shadow-xl group-hover:scale-105 transition-transform duration-300 object-cover" 
                    alt="Profile" 
                  />
                )}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              </div>

              <div className="flex-1 text-center md:text-left pt-4">
                {isEditing ? (
                  <div className="space-y-4 max-w-md mx-auto md:mx-0">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="text-xl font-bold text-slate-800 bg-slate-50 border-none rounded-2xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avatar URL (leave empty for initial)</label>
                      <input 
                        type="text" 
                        value={editedProfile.avatar === 'initial' ? '' : editedProfile.avatar}
                        placeholder="https://example.com/photo.jpg"
                        onChange={(e) => setEditedProfile({...editedProfile, avatar: e.target.value || 'initial'})}
                        className="text-sm font-medium text-slate-600 bg-slate-50 border-none rounded-2xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learning Style</label>
                      <select 
                        value={editedProfile.learningStyle}
                        onChange={(e) => setEditedProfile({...editedProfile, learningStyle: e.target.value as LearningStyle})}
                        className="bg-slate-50 border-none rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                      >
                        {Object.values(LearningStyle).map(style => <option key={style} value={style}>{style}</option>)}
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-black text-slate-800 mb-2">{profile.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                      <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                        Mastering {profile.careerGoal}
                      </span>
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                        {profile.learningStyle} Learner
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  {isEditing ? (
                    <>
                      <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Save Changes</button>
                      <button onClick={() => { setIsEditing(false); setEditedProfile(profile); }} className="text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-pen-to-square mr-2"></i> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Learning Preferences & Active Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-[3rem] p-8 border shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                <i className="fa-solid fa-sliders text-blue-500 mr-3"></i>
                Learning Preferences
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Daily Commitment</p>
                  <div className="flex gap-2">
                    {['30 min', '1 hour', '2+ hours'].map(time => (
                      <div key={time} className={`flex-1 py-3 rounded-2xl border-2 text-center text-sm font-bold transition-all ${profile.timeAvailability === time ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 text-slate-400'}`}>
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Skill Set</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.knownSkills.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[3rem] p-8 border shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                <i className="fa-solid fa-bullseye text-orange-500 mr-3"></i>
                Active Goals
              </h3>
              <div className="space-y-6">
                <div className="p-5 bg-orange-50 rounded-[2rem] border border-orange-100">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-black text-orange-600 uppercase">Roadmap Progress</p>
                    <p className="text-sm font-black text-orange-800">{Math.round(roadmapProgress)}%</p>
                  </div>
                  <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${roadmapProgress}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[2rem] border border-blue-100">
                   <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                      <i className="fa-solid fa-fire"></i>
                   </div>
                   <div>
                     <p className="text-xs font-black text-blue-600 uppercase">Streak Goal</p>
                     <p className="text-sm font-bold text-blue-800">Reach a 30-day streak</p>
                   </div>
                </div>
              </div>
            </section>
          </div>

          {/* Security & Ecosystem Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-[3rem] p-8 border shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                <i className="fa-solid fa-shield-halved text-blue-500 mr-3"></i>
                Security
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Two-Factor Authentication', status: 'Disabled', icon: 'fa-lock' },
                  { label: 'Password Management', status: 'Secure', icon: 'fa-key' },
                  { label: 'Login History', status: 'View', icon: 'fa-clock-rotate-left' }
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-blue-600 uppercase">{item.status}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[3rem] p-8 border shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                <i className="fa-solid fa-network-wired text-indigo-500 mr-3"></i>
                Ecosystem
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Cloud Sync', status: 'Active', icon: 'fa-cloud' },
                  { label: 'API Integrations', status: '0 Active', icon: 'fa-plug' },
                  { label: 'Data Privacy', status: 'GDPR Compliant', icon: 'fa-user-shield' }
                ].map((item, i) => (
                  <div key={i} className="w-full flex items-center justify-between p-4 rounded-2xl border border-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase">{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:w-80">
          <div className="bg-white rounded-[3rem] p-8 border shadow-sm sticky top-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">System Control</h3>
            <div className="space-y-4">
              <button 
                onClick={handleReset}
                className="w-full bg-rose-500/10 text-rose-600 py-5 rounded-3xl font-black hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20 group flex items-center justify-center gap-3 shadow-sm"
              >
                <i className="fa-solid fa-power-off group-hover:animate-pulse"></i>
                Reset Edvance
              </button>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight text-center">
                  DANGER ZONE: Resetting will erase all user data and progress from this browser permanently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
