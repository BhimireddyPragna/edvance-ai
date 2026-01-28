
import React, { useState, useEffect } from 'react';
import { UserProfile, Roadmap, Module, Unit, QuizQuestion } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoadmapView from './components/RoadmapView';
import SkillTreeView from './components/SkillTreeView';
import CommunityView from './components/CommunityView';
import CareerHubView from './components/CareerHubView';
import SupportView from './components/SupportView';
import ProfileView from './components/ProfileView';
import AITutorView from './components/AITutorView';
import QuizView from './components/QuizView';
import Onboarding from './components/Onboarding';
import { generateRoadmap, generateUnitQuiz } from './services/geminiService';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<{ module: Module, unit: Unit } | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<{ unit: Unit, questions: QuizQuestion[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakMessage, setStreakMessage] = useState("");
  const [streakStatus, setStreakStatus] = useState<'success' | 'protected' | 'broken'>('success');

  useEffect(() => {
    const savedProfile = localStorage.getItem('edvance_profile');
    const savedRoadmap = localStorage.getItem('edvance_roadmap');
    
    if (savedProfile) {
      const p = JSON.parse(savedProfile) as UserProfile;
      setProfile(p);
      checkStreak(p);
      
      if (savedRoadmap) {
        setRoadmap(JSON.parse(savedRoadmap));
      } else {
        fetchRoadmap(p);
      }
    }
  }, []);

  const checkStreak = (p: UserProfile) => {
    const lastDate = new Date(p.lastActiveDate);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    const lastDay = new Date(lastDate);
    lastDay.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let updatedProfile = { ...p };
    
    if (diffDays === 1) {
      updatedProfile.streak += 1;
      updatedProfile.lastActiveDate = today.toISOString();
      setStreakStatus('success');
      setStreakMessage(`Insane! You've reached a ${updatedProfile.streak} day streak!`);
      setShowStreakModal(true);
    } else if (diffDays > 1) {
      const daysToFreeze = diffDays - 1;
      
      if (updatedProfile.freezeTokens >= daysToFreeze) {
        updatedProfile.freezeTokens -= daysToFreeze;
        updatedProfile.lastActiveDate = today.toISOString();
        setStreakStatus('protected');
        setStreakMessage(`Phew! We used ${daysToFreeze} Freeze Tokens to save your ${updatedProfile.streak} day streak.`);
        setShowStreakModal(true);
      } else if (updatedProfile.hasInsurance) {
        updatedProfile.lastActiveDate = today.toISOString();
        setStreakStatus('protected');
        setStreakMessage("Your Premium Insurance kicked in! Streak saved from the void.");
        setShowStreakModal(true);
      } else {
        updatedProfile.streak = 1;
        updatedProfile.lastActiveDate = today.toISOString();
        setStreakStatus('broken');
        setStreakMessage("Ah, the streak was lost! But don't worry, every legend has a Day 1. Let's rebuild!");
        setShowStreakModal(true);
      }
    } else {
      updatedProfile.lastActiveDate = today.toISOString();
    }

    setProfile(updatedProfile);
    localStorage.setItem('edvance_profile', JSON.stringify(updatedProfile));
  };

  const fetchRoadmap = async (p: UserProfile) => {
    setIsGenerating(true);
    try {
      const rm = await generateRoadmap(p);
      setRoadmap(rm);
      localStorage.setItem('edvance_roadmap', JSON.stringify(rm));
    } catch (error) {
      console.error("Failed to generate roadmap", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOnboardingComplete = (p: UserProfile) => {
    const enrichedProfile: UserProfile = {
      ...p,
      xp: 0, 
      level: 1,
      lastActiveDate: new Date().toISOString(),
      freezeTokens: 3,
      hasInsurance: false,
    };
    setProfile(enrichedProfile);
    localStorage.setItem('edvance_profile', JSON.stringify(enrichedProfile));
    fetchRoadmap(enrichedProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('edvance_profile', JSON.stringify(updatedProfile));
  };

  const handleUnitSelect = (m: Module, u: Unit) => {
    setSelectedUnit({ module: m, unit: u });
  };

  const handleTutorComplete = async () => {
    if (!selectedUnit) return;
    
    setIsGenerating(true);
    try {
      const quizQuestions = await generateUnitQuiz(selectedUnit.unit.title, selectedUnit.unit.description);
      setCurrentQuiz({ unit: selectedUnit.unit, questions: quizQuestions });
    } catch (error) {
      console.error("Quiz generation failed", error);
      handleFinalizeCompletion(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalizeCompletion = (score: number) => {
    if (!selectedUnit || !roadmap || !profile) return;

    const updatedModules = roadmap.modules.map(m => {
      if (m.id === selectedUnit.module.id) {
        const updatedUnits = m.units.map(u => {
          if (u.id === selectedUnit.unit.id) {
            return { ...u, isCompleted: true };
          }
          return u;
        });
        return { ...m, units: updatedUnits };
      }
      return m;
    });

    const finalModules = updatedModules.map((m, idx) => {
      if (idx > 0) {
        const prevModule = updatedModules[idx - 1];
        const isPrevComplete = prevModule.units.every(u => u.isCompleted);
        return { ...m, isLocked: !isPrevComplete };
      }
      return m;
    });

    const baseXP = selectedUnit.unit.type === 'boss-battle' ? 500 : 200;
    const quizBonus = score * 50; 
    const xpEarned = baseXP + quizBonus;

    const updatedProfile = {
      ...profile,
      xp: profile.xp + xpEarned,
      level: Math.floor((profile.xp + xpEarned) / 1000) + 1
    };

    const newRoadmap = { ...roadmap, modules: finalModules };
    setProfile(updatedProfile);
    setRoadmap(newRoadmap);
    localStorage.setItem('edvance_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('edvance_roadmap', JSON.stringify(newRoadmap));
    
    setSelectedUnit(null);
    setCurrentQuiz(null);
    setActiveTab('dashboard');
  };

  const calculateProgress = () => {
    if (!roadmap) return 0;
    const totalUnits = roadmap.modules.reduce((acc, m) => acc + m.units.length, 0);
    const completedUnits = roadmap.modules.reduce((acc, m) => acc + m.units.filter(u => u.isCompleted).length, 0);
    return (completedUnits / totalUnits) * 100;
  };

  const renderContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          profile={profile} 
          roadmap={roadmap} 
          onContinue={() => {
            const firstIncompleteModule = roadmap?.modules.find(m => !m.isLocked);
            const firstIncompleteUnit = firstIncompleteModule?.units.find(u => !u.isCompleted);
            if (firstIncompleteModule && firstIncompleteUnit) {
              handleUnitSelect(firstIncompleteModule, firstIncompleteUnit);
            } else {
              setActiveTab('roadmap');
            }
          }}
        />;
      case 'roadmap':
        return <RoadmapView roadmap={roadmap} onUnitSelect={handleUnitSelect} />;
      case 'skilltree':
        return <SkillTreeView roadmap={roadmap} onUnitSelect={handleUnitSelect} />;
      case 'community':
        return <CommunityView />;
      case 'career':
        return <CareerHubView profile={profile} />;
      case 'support':
        return <SupportView />;
      case 'profile':
        return <ProfileView 
          profile={profile} 
          onUpdate={handleUpdateProfile} 
          roadmapProgress={calculateProgress()}
        />;
      default:
        return null;
    }
  };

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (selectedUnit && !currentQuiz) {
    return (
      <AITutorView 
        unit={selectedUnit.unit} 
        onBack={() => setSelectedUnit(null)} 
        onComplete={handleTutorComplete}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </main>

      {currentQuiz && (
        <QuizView 
          unit={currentQuiz.unit} 
          questions={currentQuiz.questions} 
          onFinish={handleFinalizeCompletion} 
          onCancel={() => setCurrentQuiz(null)} 
        />
      )}

      {isGenerating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
              <i className="fa-solid fa-wand-magic-sparkles fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="font-bold text-slate-800">Processing...</p>
           </div>
        </div>
      )}

      {showStreakModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-8 shadow-xl rotate-3 animate-bounce ${
              streakStatus === 'broken' ? 'bg-slate-100 text-slate-400' : streakStatus === 'protected' ? 'bg-amber-100 text-amber-500' : 'bg-orange-100 text-orange-500'
            }`}>
              <i className={`fa-solid ${streakStatus === 'broken' ? 'fa-heart-crack' : streakStatus === 'protected' ? 'fa-snowflake' : 'fa-fire'} animate-flame`}></i>
            </div>
            
            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
              {streakStatus === 'broken' ? 'Aw, Snap!' : streakStatus === 'protected' ? 'Safe and Sound!' : 'Absolute Fire!'}
            </h3>
            
            <p className="text-slate-500 text-lg leading-relaxed mb-10 px-4">
              {streakMessage}
            </p>
            
            <button 
              onClick={() => setShowStreakModal(false)}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 transform"
            >
              KEEP GOING!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
