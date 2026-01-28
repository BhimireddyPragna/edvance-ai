
import React from 'react';
import { Roadmap, Unit } from '../types';

interface SkillTreeViewProps {
  roadmap: Roadmap | null;
  onUnitSelect: (module: any, unit: Unit) => void;
}

const SkillTreeView: React.FC<SkillTreeViewProps> = ({ roadmap, onUnitSelect }) => {
  if (!roadmap) return null;

  return (
    <div className="flex-1 overflow-auto p-8 custom-scrollbar bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-2">Your Skill Tree</h1>
          <p className="text-slate-500">Visualize your path to becoming a {roadmap.careerGoal}.</p>
        </div>

        <div className="flex flex-col items-center space-y-16">
          {roadmap.modules.map((module, mIndex) => (
            <div key={module.id} className="w-full flex flex-col items-center">
              <div className={`px-10 py-5 rounded-[2.5rem] shadow-xl z-20 border-4 transition-all ${
                module.isLocked ? 'bg-slate-200 border-slate-300 text-slate-400' : 'bg-blue-600 border-blue-400 text-white'
              }`}>
                <h3 className="font-black uppercase tracking-widest text-sm mb-1">Module {mIndex + 1}</h3>
                <p className="text-xl font-black">{module.title}</p>
              </div>

              <div className="flex justify-center mt-12 w-full max-w-4xl relative">
                {/* Connection lines */}
                {!module.isLocked && (
                  <svg className="absolute top-[-48px] left-0 w-full h-12 -z-10 overflow-visible">
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="4" />
                  </svg>
                )}

                <div className="flex flex-wrap justify-center gap-8">
                  {module.units.map((unit) => (
                    <div key={unit.id} className="relative flex flex-col items-center">
                       {/* Connection line from module to unit */}
                       <div className={`absolute top-[-48px] w-1 h-12 ${module.isLocked ? 'bg-slate-100' : 'bg-slate-200'}`}></div>

                      <button
                        onClick={() => !module.isLocked && onUnitSelect(module, unit)}
                        disabled={module.isLocked}
                        className={`w-32 h-32 rounded-[2rem] flex flex-col items-center justify-center p-4 transition-all relative border-4 ${
                          unit.isCompleted 
                            ? 'bg-emerald-500 border-emerald-300 text-white shadow-lg shadow-emerald-100 scale-110 rotate-3' 
                            : module.isLocked 
                              ? 'bg-white border-slate-50 text-slate-200' 
                              : 'bg-white border-blue-100 text-blue-600 hover:border-blue-600 hover:scale-105 shadow-md'
                        }`}
                      >
                        <i className={`fa-solid ${
                          unit.type === 'boss-battle' ? 'fa-skull' : 
                          unit.type === 'quiz' ? 'fa-brain' :
                          unit.type === 'project' ? 'fa-code' : 'fa-lightbulb'
                        } text-2xl mb-2`}></i>
                        <span className="text-[10px] font-black uppercase text-center leading-tight line-clamp-2">{unit.title}</span>
                        {unit.isCompleted && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-white">
                            <i className="fa-solid fa-check text-xs"></i>
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
             <i className="fa-solid fa-flag-checkered text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTreeView;
