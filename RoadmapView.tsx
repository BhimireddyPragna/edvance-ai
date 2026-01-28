
import React from 'react';
import { Roadmap, Module, Unit } from '../types';

interface RoadmapViewProps {
  roadmap: Roadmap | null;
  onUnitSelect: (module: Module, unit: Unit) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, onUnitSelect }) => {
  if (!roadmap) return (
    <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
      <div className="text-center">
        <i className="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
        <p>Generating your personalized roadmap...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{roadmap.careerGoal} Journey</h1>
          <p className="text-slate-500">Your AI-generated path to mastery. Complete units to unlock the next modules.</p>
        </div>

        <div className="space-y-12 relative">
          <div className="absolute left-[27px] top-6 bottom-6 w-1 bg-slate-100 -z-10"></div>
          
          {roadmap.modules.map((module, mIndex) => (
            <div key={module.id} className="relative">
              <div className="flex items-center mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md z-10 ${
                  module.isLocked ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white'
                }`}>
                  <i className={`fa-solid ${module.isLocked ? 'fa-lock' : 'fa-graduation-cap'} text-xl`}></i>
                </div>
                <div className="ml-6">
                  <h3 className={`text-xl font-bold ${module.isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                    Module {mIndex + 1}: {module.title}
                  </h3>
                  <p className="text-sm text-slate-500">{module.units.length} Units • {module.units.filter(u => u.isCompleted).length} Completed</p>
                </div>
              </div>

              <div className="ml-16 grid grid-cols-1 md:grid-cols-2 gap-4">
                {module.units.map((unit) => (
                  <button
                    key={unit.id}
                    disabled={module.isLocked}
                    onClick={() => onUnitSelect(module, unit)}
                    className={`p-5 rounded-2xl border text-left transition-all group ${
                      unit.isCompleted 
                        ? 'bg-emerald-50 border-emerald-100' 
                        : module.isLocked 
                          ? 'bg-slate-50 border-transparent opacity-60 cursor-not-allowed' 
                          : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        unit.type === 'boss-battle' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {unit.type}
                      </span>
                      {unit.isCompleted && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                    </div>
                    <h4 className={`font-bold mb-1 ${unit.isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {unit.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{unit.description}</p>
                    <div className="flex items-center text-xs text-slate-400 font-medium">
                      <i className="fa-solid fa-clock mr-1"></i> {unit.estimatedTime}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
