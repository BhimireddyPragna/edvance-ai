
import React, { useState } from 'react';
import { UserProfile, SkillLevel, LearningStyle } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const CAREER_SKILLS: Record<string, string[]> = {
  'Full Stack Web Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'TypeScript'],
  'Data Scientist': ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Statistics', 'R'],
  'Mobile App Developer': ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Firebase'],
  'AI Engineer': ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'GenAI'],
  'Cloud Architect': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Linux']
};

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    careerGoal: 'Full Stack Web Developer',
    skillLevel: SkillLevel.BEGINNER,
    learningStyle: LearningStyle.VISUAL,
    knownSkills: [],
    timeAvailability: '1-2 hours',
    avatar: 'initial',
    xp: 0,
    level: 1,
    streak: 1,
    lastActiveDate: new Date().toISOString(),
    freezeTokens: 3,
    hasInsurance: false,
    badges: []
  });

  const next = () => setStep(s => s + 1);

  const handleSubmit = () => {
    onComplete(profile as UserProfile);
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = profile.knownSkills || [];
    if (currentSkills.includes(skill)) {
      setProfile({ ...profile, knownSkills: currentSkills.filter(s => s !== skill) });
    } else {
      setProfile({ ...profile, knownSkills: [...currentSkills, skill] });
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase() || '?';
  };

  const recommendations = CAREER_SKILLS[profile.careerGoal || ''] || [];

  return (
    <div className="min-h-screen bg-indigo-700 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-8 sm:p-12 relative overflow-hidden my-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-50 rounded-full -ml-12 -mb-12"></div>

        <div className="relative">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}></div>
              ))}
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Step {step} of 3</span>
          </div>

          {/* Profile Preview */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {profile.avatar === 'initial' || !profile.avatar ? (
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 border-4 border-white transition-transform duration-500 hover:scale-105">
                  {getInitial(profile.name || '')}
                </div>
              ) : (
                <img src={profile.avatar} className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl object-cover transition-transform duration-500 hover:scale-105" alt="Avatar" />
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
                <i className="fa-solid fa-check text-xs"></i>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Create Your Identity</h1>
                <p className="text-slate-600 text-lg">Let's set up your profile basics.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-tight">What should we call you?</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none text-lg transition-all text-slate-900 font-bold placeholder:text-slate-400"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-tight">Profile Photo URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    onChange={(e) => setProfile(p => ({ ...p, avatar: e.target.value || 'initial' }))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none text-lg transition-all text-slate-900 font-bold placeholder:text-slate-400"
                  />
                  <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase">Leave blank to use your initial</p>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-tight">What's your career dream?</label>
                  <select
                    value={profile.careerGoal}
                    onChange={(e) => setProfile(p => ({ ...p, careerGoal: e.target.value, knownSkills: [] }))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none text-lg transition-all text-slate-900 font-bold"
                  >
                    <option>Full Stack Web Developer</option>
                    <option>Data Scientist</option>
                    <option>Mobile App Developer</option>
                    <option>AI Engineer</option>
                    <option>Cloud Architect</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Your Expertise</h1>
                <p className="text-slate-600 text-lg">Tell us where you are starting from.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(SkillLevel).map(level => (
                  <button
                    key={level}
                    onClick={() => setProfile(p => ({ ...p, skillLevel: level }))}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${
                      profile.skillLevel === level 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md scale-105' 
                        : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200'
                    }`}
                  >
                    <i className={`fa-solid ${level === SkillLevel.BEGINNER ? 'fa-leaf' : level === SkillLevel.INTERMEDIATE ? 'fa-tree' : 'fa-mountain'} text-2xl`}></i>
                    <span className="font-black text-sm uppercase">{level}</span>
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-black text-slate-700 uppercase">Recommended skills for {profile.careerGoal}</label>
                <div className="flex flex-wrap gap-2">
                  {recommendations.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                        profile.knownSkills?.includes(skill)
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      {skill} {profile.knownSkills?.includes(skill) ? '✓' : '+'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase">Any other skills?</label>
                <input
                  type="text"
                  placeholder="e.g. Design, Spanish, SEO"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-400"
                  onBlur={(e) => {
                    const extra = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    if (extra.length) {
                      setProfile(p => ({ ...p, knownSkills: [...new Set([...(p.knownSkills || []), ...extra])] }));
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Personalized Learning</h1>
                <p className="text-slate-600 text-lg">Optimize Edvance for your unique style.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {Object.values(LearningStyle).map(style => (
                  <button
                    key={style}
                    onClick={() => setProfile(p => ({ ...p, learningStyle: style }))}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center space-x-6 ${
                      profile.learningStyle === style 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200' 
                        : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${profile.learningStyle === style ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                      <i className={`fa-solid ${style === LearningStyle.VISUAL ? 'fa-eye' : style === LearningStyle.AUDITORY ? 'fa-ear-listen' : 'fa-hand-pointer'}`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xl font-black ${profile.learningStyle === style ? 'text-indigo-800' : 'text-slate-800'}`}>{style}</h4>
                      <p className={`text-sm font-medium ${profile.learningStyle === style ? 'text-indigo-600/70' : 'text-slate-600'}`}>
                        Optimized for {style.toLowerCase()} content delivery.
                      </p>
                    </div>
                    {profile.learningStyle === style && (
                      <div className="text-indigo-600 text-xl">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-black text-slate-700 mb-4 uppercase text-center">Daily Study Commitment</label>
                <div className="flex space-x-3">
                  {['30 min', '1 hour', '2+ hours'].map(time => (
                    <button
                      key={time}
                      onClick={() => setProfile(p => ({ ...p, timeAvailability: time }))}
                      className={`flex-1 py-4 rounded-2xl border-2 font-black text-sm uppercase transition-all ${
                        profile.timeAvailability === time ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex space-x-4">
            {step > 1 && (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-4 font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest text-xs"
              >
                Go Back
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : next}
              disabled={step === 1 && !profile.name}
              className="flex-[2] bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 transform hover:scale-[1.02] active:scale-95"
            >
              {step === 3 ? "Launch Journey" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
