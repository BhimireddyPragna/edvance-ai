
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getSupportResponse } from '../services/geminiService';

const FAQ_ITEMS = [
  { q: "How do I maintain my streak?", a: "You must complete at least one unit per day. If you miss a day, you can use a Freeze Token to protect your streak." },
  { q: "What are Freeze Tokens?", a: "Freeze Tokens allow you to skip a day of learning without losing your streak. You start with 3 tokens." },
  { q: "How is my roadmap generated?", a: "Edvance uses advanced Gemini AI models to analyze your career goals, current skills, and learning style to create a tailored 4-module path." },
  { q: "Can I change my career goal?", a: "Currently, career goals are set during onboarding. Resetting your goal will generate a new roadmap." },
  { q: "How do I earn XP?", a: "You earn XP by completing units (200 XP) and scoring well on quizzes (up to 150 bonus XP)." }
];

const SupportView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm the Edvance Support AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const filteredFAQs = FAQ_ITEMS.filter(item => 
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getSupportResponse([...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to support servers. Please email help@edvance.ai" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-slate-50">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Help & Support</h1>
            <p className="text-slate-500">Search our knowledge base or chat with our support team.</p>
          </div>

          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search topics (e.g. streaks, roadmap, XP)..." 
              className="w-full pl-12 pr-6 py-4 rounded-2xl border bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredFAQs.map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm group hover:border-blue-200 transition-all">
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center">
                    <i className="fa-solid fa-circle-info text-blue-500 mr-2 text-xs"></i>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
              {filteredFAQs.length === 0 && (
                <p className="text-center py-8 text-slate-400">No results found for "{searchTerm}"</p>
              )}
            </div>
          </section>

          <section className="bg-blue-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl shadow-blue-100">
            <div>
              <h3 className="text-2xl font-bold mb-2">Can't find what you need?</h3>
              <p className="opacity-80">Our specialized human team is ready to help via email.</p>
            </div>
            <a 
              href="mailto:support@edvance.ai" 
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all"
            >
              Contact Email
            </a>
          </section>
        </div>
      </div>

      <aside className="w-96 bg-white border-l flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-headset"></i>
            </div>
            <h2 className="font-bold text-slate-800">Support Chat</h2>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-black uppercase tracking-widest">Online</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border text-slate-700 rounded-tl-none shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl border flex space-x-1 animate-pulse">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Type message..." 
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SupportView;
