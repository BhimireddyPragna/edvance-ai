
import React, { useState, useEffect, useRef } from 'react';
import { Unit, Message } from '../types';
import { getTutorResponse, generateUnitVisual, generateUnitContent } from '../services/geminiService';

interface AITutorViewProps {
  unit: Unit;
  onBack: () => void;
  onComplete: () => void;
}

const AITutorView: React.FC<AITutorViewProps> = ({ unit, onBack, onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hi! I'm your dedicated tutor for "${unit.title}". Feel free to ask questions as you go through the lesson content on the left!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(true);
  const [chatWidth, setChatWidth] = useState(400); // Default chat width in px
  const [isResizing, setIsResizing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLesson();
  }, [unit]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const fetchLesson = async () => {
    setContentLoading(true);
    try {
      const content = await generateUnitContent(unit.title, unit.description, 'Visual');
      setLessonContent(content);
    } catch (error) {
      setLessonContent("Failed to load lesson content. Please try again.");
    } finally {
      setContentLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getTutorResponse([...messages, userMsg], unit.title);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVisual = async () => {
    if (visualLoading) return;
    setVisualLoading(true);
    
    try {
      const imageData = await generateUnitVisual(unit.title, unit.description);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I've generated a visual mind map for this unit. You can use this to see how the concepts connect!", 
        image: imageData 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I tried to generate a visual for you, but the creative engine hit a snag. Let's keep chatting!" }]);
    } finally {
      setVisualLoading(false);
    }
  };

  // Resizing logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        setChatWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = () => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  };

  // Helper to process line-by-line rendering according to user preferences
  const renderLessonLine = (line: string, index: number) => {
    // 1. Remove leading numbers (e.g., "1. Overview" -> "Overview")
    let cleaned = line.replace(/^\d+\.\s+/, '');
    
    // 2. Detect Markdown headers (preserving structure but cleaning the text)
    if (cleaned.startsWith('# ')) {
      const text = cleaned.replace('# ', '').replace(/\*/g, '"');
      return <h1 key={index} className="text-3xl font-black text-slate-900 mt-10 mb-4">{text}</h1>;
    }
    if (cleaned.startsWith('## ')) {
      const text = cleaned.replace('## ', '').replace(/\*/g, '"');
      return <h2 key={index} className="text-2xl font-black text-slate-800 mt-8 mb-3">{text}</h2>;
    }
    if (cleaned.startsWith('### ')) {
      const text = cleaned.replace('### ', '').replace(/\*/g, '"');
      return <h3 key={index} className="text-xl font-bold text-slate-800 mt-6 mb-2">{text}</h3>;
    }
    
    // 3. Detect list items (Markdown lists often start with '-' or '*')
    if (cleaned.startsWith('- ') || cleaned.startsWith('* ')) {
      const text = cleaned.substring(2).replace(/\*/g, '"');
      return <li key={index} className="ml-6 mb-2 list-disc">{text}</li>;
    }
    
    // 4. Handle empty lines
    if (cleaned.trim() === '') return <br key={index} />;
    
    // 5. Normal paragraphs (replacing asterisks with inverted commas)
    const processedText = cleaned.replace(/\*\*/g, '"').replace(/\*/g, '"');
    return <p key={index}>{processedText}</p>;
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Header */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-book-open"></i>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 tracking-tight">{unit.title}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Lesson View</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleGenerateVisual}
            disabled={visualLoading}
            className={`text-xs font-black px-4 py-2 rounded-xl flex items-center transition-all shadow-sm ${
              visualLoading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            {visualLoading ? (
              <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
            )}
            Mind Map
          </button>
          <div className="w-px h-6 bg-slate-200"></div>
          <button 
            onClick={onComplete}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-black transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            Mark Complete
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Lesson Content */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
          <div className="max-w-3xl mx-auto prose prose-slate">
            {contentLoading ? (
              <div className="space-y-6 animate-pulse mt-10">
                <div className="h-10 bg-slate-100 rounded-2xl w-3/4"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-5/6"></div>
                <div className="h-64 bg-slate-50 rounded-3xl w-full"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-4/5"></div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center space-x-3 mb-8">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{unit.type}</span>
                  <span className="text-slate-400 text-sm">•</span>
                  <span className="text-slate-400 text-xs font-bold"><i className="fa-solid fa-clock mr-1.5"></i>{unit.estimatedTime}</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-8 leading-tight">{unit.title}</h1>
                <div className="text-slate-700 leading-relaxed text-lg space-y-6">
                  {lessonContent.split('\n').map((line, i) => renderLessonLine(line, i))}
                </div>
                
                {/* Visual Placeholder if any in content */}
                <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                   <div className="max-w-sm">
                      <h4 className="text-lg font-black text-slate-800 mb-2">Want a visual summary?</h4>
                      <p className="text-sm text-slate-500">Ask the AI Tutor to generate a mind map for this specific unit to see the connections.</p>
                   </div>
                   <button 
                     onClick={handleGenerateVisual}
                     className="bg-white text-indigo-600 p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                   >
                     <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
                   </button>
                </div>
                
                <div className="h-32"></div> {/* Footer padding */}
              </div>
            )}
          </div>
        </div>

        {/* Resizer Handle */}
        <div 
          ref={resizerRef}
          onMouseDown={startResizing}
          className={`w-1.5 bg-slate-100 hover:bg-indigo-300 cursor-col-resize transition-colors z-20 group relative ${isResizing ? 'bg-indigo-400' : ''}`}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-10 bg-white border rounded-full flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="fa-solid fa-grip-vertical text-[10px]"></i>
          </div>
        </div>

        {/* AI Tutor Chat Sidebar */}
        <aside 
          className="bg-slate-50 border-l flex flex-col z-10 transition-shadow duration-300"
          style={{ width: `${chatWidth}px` }}
        >
          <div className="p-5 border-b bg-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <i className="fa-solid fa-robot text-sm"></i>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Tutor</h3>
                <p className="text-[9px] text-emerald-500 font-bold uppercase">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
               <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <i className="fa-solid fa-broom text-xs"></i>
               </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                  {m.image && (
                    <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 shadow-md group relative">
                      <img src={m.image} alt="Visual" className="w-full h-auto" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button className="bg-white text-slate-800 p-2 rounded-lg text-xs font-black">Open Fullscreen</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border flex space-x-1.5 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 focus-within:border-indigo-300 focus-within:bg-white transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your tutor..."
                className="flex-1 bg-transparent border-none py-2 text-sm outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`ml-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AITutorView;
