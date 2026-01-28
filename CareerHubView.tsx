
import React from 'react';
import { UserProfile } from '../types';

interface CareerHubProps {
  profile: UserProfile;
}

const JOBS = [
  { title: 'Junior Frontend Developer', company: 'TechStream', type: 'Remote', salary: '$70k - $90k', match: 85 },
  { title: 'UX/UI Engineering Intern', company: 'NovaDesign', type: 'Hybrid', salary: '$45k - $55k', match: 92 },
  { title: 'Product Developer', company: 'CreativeLabs', type: 'On-site', salary: '$85k - $110k', match: 74 },
];

const CareerHubView: React.FC<CareerHubProps> = ({ profile }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Career Hub</h1>
            <p className="text-slate-500">Accelerate your path to becoming a <span className="text-blue-600 font-bold">{profile.careerGoal}</span>.</p>
          </div>
          <button className="bg-blue-600 text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <i className="fa-solid fa-file-invoice mr-2"></i> Update Portfolio
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-3xl mb-6">
              <i className="fa-solid fa-microphone-lines"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">AI Mock Interview</h3>
            <p className="text-sm text-slate-500 mb-6">Simulate a technical or behavioral interview with our Career AI.</p>
            <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black transition-all">Start Simulation</button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl mb-6">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Resume Builder</h3>
            <p className="text-sm text-slate-500 mb-6">We've auto-populated your skills from your Edvance journey.</p>
            <button className="w-full py-4 rounded-2xl border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-all">Export PDF</button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center text-3xl mb-6">
               <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Salary Simulator</h3>
            <p className="text-sm text-slate-500 mb-6">Predict your earning potential based on current mastery.</p>
            <button className="w-full py-4 rounded-2xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all">Calculate ROI</button>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
          <div className="p-8 border-b flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800">Job Matches</h2>
            <div className="flex space-x-2">
              <span className="bg-blue-50 text-blue-600 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">Recommended</span>
            </div>
          </div>
          <div className="divide-y">
            {JOBS.map((job, i) => (
              <div key={i} className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{job.title}</h3>
                  <div className="flex items-center space-x-3 text-sm text-slate-500">
                    <span className="font-bold text-slate-700">{job.company}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-bold">{job.salary}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Skill Match</p>
                    <div className="flex items-center">
                       <div className="w-24 h-2 bg-slate-100 rounded-full mr-3 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${job.match}%` }}></div>
                       </div>
                       <span className="text-sm font-black text-emerald-600">{job.match}%</span>
                    </div>
                  </div>
                  <button className="bg-slate-100 text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-200 transition-all">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareerHubView;
