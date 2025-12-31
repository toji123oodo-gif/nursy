
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Play, Star, Clock, AlertCircle, CheckCircle, XCircle, FileText, HelpCircle, Download, File, Activity, Unlock, Brain, RotateCw, Bot, Send, Sparkles, X, Headphones, Image as ImageIcon, FileType, Music, Pause, Volume2, VolumeX, Maximize2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ContentItem } from '../types';
import { GoogleGenAI } from "@google/genai";

// Mock Flashcards Data (Keep existing)
const lessonFlashcards = [
    { id: 1, term: 'Osteoblast', definition: 'Cells that form new bone.' },
    { id: 2, term: 'Osteoclast', definition: 'Cells that break down bone matrix.' },
    { id: 3, term: 'Femur', definition: 'The longest and strongest bone in the body (Thigh bone).' },
    { id: 4, term: 'Axial Skeleton', definition: 'Consists of the skull, vertebral column, and rib cage.' },
    { id: 5, term: 'Ligament', definition: 'Connective tissue that connects bone to bone.' },
];

// Mock Quiz Data (Keep existing)
const lessonQuiz = [
    {
        id: 1,
        question: "How many bones are in the adult human body?",
        options: ["206", "205", "300", "210"],
        correct: 0
    },
    {
        id: 2,
        question: "Which represents the Axial Skeleton?",
        options: ["Arms & Legs", "Skull & Vertebral Column", "Hands & Feet", "Pelvis"],
        correct: 1
    },
    {
        id: 3,
        question: "What is the longest bone in the human body?",
        options: ["Humerus", "Tibia", "Femur", "Fibula"],
        correct: 2
    }
];

// --- CUSTOM COMPONENTS ---

const Watermark: React.FC<{ userPhone: string }> = ({ userPhone }) => {
  const [position, setPosition] = useState({ top: 10, left: 10 });
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        top: Math.random() * 70 + 10,
        left: Math.random() * 70 + 10,
      });
      setOpacity(0.2 + Math.random() * 0.3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-50 text-white/20 font-mono text-sm md:text-lg select-none whitespace-nowrap"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        opacity: opacity,
        transform: 'translate(-50%, -50%) rotate(-15deg)',
      }}
    >
      {userPhone}
    </div>
  );
};

// --- AUDIO PLAYER COMPONENT ---
const CustomAudioPlayer: React.FC<{ url: string, title: string, userPhone: string }> = ({ url, title, userPhone }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="bg-brand-card p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
            {/* Visualizer Background Effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                 <div className={`w-full h-32 flex items-center justify-center gap-1 ${isPlaying ? 'animate-pulse' : ''}`}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-2 bg-brand-gold rounded-full transition-all duration-300" 
                             style={{ height: isPlaying ? `${Math.random() * 100}%` : '20%' }}></div>
                    ))}
                 </div>
            </div>

            <audio 
                ref={audioRef} 
                src={url} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-brand-main border-4 border-brand-gold/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                    <Music size={40} className={`text-brand-gold ${isPlaying ? 'animate-spin-slow' : ''}`} />
                </div>
                
                <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                    <p className="text-brand-muted text-xs">مشغل الصوتيات الذكي</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-3">
                    <span className="text-xs text-brand-muted font-mono">{formatTime(currentTime)}</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={duration || 0} 
                        value={currentTime} 
                        onChange={handleSeek}
                        className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                    />
                    <span className="text-xs text-brand-muted font-mono">{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                    <button onClick={() => { audioRef.current!.currentTime -= 10; }} className="text-brand-muted hover:text-white transition-colors text-xs font-bold">-10s</button>
                    
                    <button 
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-brand-gold text-brand-main flex items-center justify-center hover:scale-105 transition-transform shadow-glow"
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>

                    <button onClick={() => { audioRef.current!.currentTime += 10; }} className="text-brand-muted hover:text-white transition-colors text-xs font-bold">+10s</button>
                </div>
            </div>
            <Watermark userPhone={userPhone} />
        </div>
    );
};

// --- DOCUMENT VIEWER (PDF/WORD) ---
const DocumentViewer: React.FC<{ url: string, type: 'pdf' | 'document', userPhone: string }> = ({ url, type, userPhone }) => {
    // Google Docs Viewer allows viewing PDF, DOC, DOCX, PPT inside browser without download
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

    return (
        <div className="relative w-full h-[600px] bg-white rounded-2xl overflow-hidden border border-white/10 shadow-xl">
             <div className="absolute top-0 left-0 w-full bg-brand-card p-2 flex justify-between items-center border-b border-brand-gold/20 z-10">
                 <span className="text-white text-xs font-bold flex items-center gap-2">
                     <FileText size={14} className="text-brand-gold" />
                     عارض الملفات الذكي ({type.toUpperCase()})
                 </span>
             </div>
             <iframe 
                src={viewerUrl} 
                className="w-full h-full pt-8" 
                frameBorder="0"
             ></iframe>
             <Watermark userPhone={userPhone} />
        </div>
    );
};

// --- IMAGE VIEWER ---
const ImageViewer: React.FC<{ url: string, title: string, userPhone: string }> = ({ url, title, userPhone }) => {
    return (
        <div className="relative w-full bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
            <img src={url} alt={title} className="w-full h-auto max-h-[600px] object-contain mx-auto" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-center font-bold">{title}</p>
            </div>
            <Watermark userPhone={userPhone} />
            <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-brand-gold hover:text-brand-main transition-colors" onClick={() => window.open(url, '_blank')}>
                <Maximize2 size={20} />
            </button>
        </div>
    );
};

// --- AI Chat Widget (Upgraded with Real Gemini API) ---
const AiChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([
        { sender: 'bot', text: 'مرحباً بك! أنا مساعدك الذكي في Nursy. كيف يمكنني مساعدتك في فهم محتوى الكورس اليوم؟' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;
        
        const userQuery = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
        setInput('');
        setIsThinking(true);

        // Fix: Implementing real Gemini API content generation
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userQuery,
                config: {
                    systemInstruction: "أنت مساعد ذكي لمنصة Nursy التعليمية لطلاب التمريض. مهمتك هي الإجابة على استفسارات الطلاب حول المواد العلمية (تشريح، فسيولوجيا، ميكروبيولوجيا) بأسلوب أكاديمي دقيق ومبسط باللغة العربية.",
                    temperature: 0.7,
                }
            });
            
            setMessages(prev => [...prev, { sender: 'bot', text: response.text || "عذراً، لم أتمكن من الحصول على رد مفيد. حاول مرة أخرى." }]);
        } catch (err) {
            console.error("Gemini AI error:", err);
            setMessages(prev => [...prev, { sender: 'bot', text: "عذراً، واجهت مشكلة في الاتصال بمحرك الذكاء الاصطناعي. يرجى المحاولة لاحقاً." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="fixed bottom-24 left-4 md:left-8 w-[90%] md:w-96 bg-brand-card border border-brand-gold/50 rounded-2xl shadow-2xl overflow-hidden z-40 animate-scale-up flex flex-col h-[450px]">
             <div className="bg-gradient-to-r from-brand-gold to-yellow-600 p-3 flex justify-between items-center text-brand-main">
                <span className="font-bold flex items-center gap-2"><Bot size={18} /> Nursy AI Assistant</span>
                <button onClick={onClose}><X size={16} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-brand-main scroll-smooth">
                {messages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${m.sender === 'user' ? 'bg-brand-gold/20 text-brand-gold mr-auto rounded-tl-none' : 'bg-white/5 text-white ml-auto rounded-tr-none border border-white/5'}`}>
                        {m.text}
                    </div>
                ))}
                {isThinking && (
                    <div className="flex items-center gap-2 text-brand-muted text-xs animate-pulse bg-white/5 p-2 rounded-xl ml-auto w-fit">
                        <RotateCw size={12} className="animate-spin" />
                        جاري معالجة سؤالك...
                    </div>
                )}
            </div>
            <div className="p-3 bg-brand-card border-t border-white/5 flex gap-2">
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-brand-main rounded-full px-4 py-2 text-sm text-white border border-white/10 focus:border-brand-gold outline-none transition-all" 
                    placeholder="اطلب شرحاً لأي نقطة علمية..." 
                    disabled={isThinking}
                />
                <button 
                    onClick={handleSend} 
                    disabled={isThinking}
                    className="w-10 h-10 rounded-full bg-brand-gold text-brand-main flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-glow"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};


export const Dashboard: React.FC = () => {
  const { user, courses, upgradeToPro } = useApp();
  const [activeCourse, setActiveCourse] = useState(courses[0]); 
  const [activeLesson, setActiveLesson] = useState(activeCourse.lessons[0]);
  
  // Set default active content to the first item of the active lesson
  const [activeContent, setActiveContent] = useState<ContentItem | null>(
      activeLesson.contents.length > 0 ? activeLesson.contents[0] : null
  );

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'flashcards'>('content');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showAiChat, setShowAiChat] = useState(false);

  // Flashcard & Quiz State (Simplified for this view)
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // When lesson changes, reset content to first item
    if (activeLesson.contents.length > 0) {
        setActiveContent(activeLesson.contents[0]);
    } else {
        setActiveContent(null);
    }
    setActiveTab('content');
  }, [activeLesson]);

  const isLessonAccessible = (index: number) => {
    if (user?.subscriptionTier === 'pro') return true;
    return index < 2; 
  };

  const handleLessonClick = (lesson: typeof activeLesson, index: number) => {
    if (isLessonAccessible(index)) {
      setActiveLesson(lesson);
      setShowUpgradeModal(false);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const toggleLessonCompletion = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  const handleSimulateUpgrade = () => {
      upgradeToPro();
      setShowUpgradeModal(false);
      alert("تم تفعيل الاشتراك بنجاح لمدة 30 يوم!");
  };

  const getIconForType = (type: string) => {
      switch(type) {
          case 'video': return <Play size={16} />;
          case 'audio': return <Headphones size={16} />;
          case 'pdf': return <FileText size={16} />;
          case 'document': return <File size={16} />;
          case 'image': return <ImageIcon size={16} />;
          default: return <File size={16} />;
      }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto relative min-h-screen">
      
      {/* AI Button */}
      {user.subscriptionTier === 'pro' && !showAiChat && (
          <button onClick={() => setShowAiChat(true)} className="fixed bottom-6 left-6 z-40 bg-brand-gold text-brand-main p-4 rounded-full shadow-glow animate-bounce-slow">
              <Bot size={28} />
          </button>
      )}
      {showAiChat && <AiChatWidget onClose={() => setShowAiChat(false)} />}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-card border border-brand-gold/30 rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-brand-muted"><XCircle size={24} /></button>
            <Lock size={40} className="text-brand-gold mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">محتوى حصري</h3>
            <p className="text-brand-muted mb-6">اشترك الآن لفتح جميع الدروس والملفات.</p>
            <button onClick={handleSimulateUpgrade} className="w-full bg-brand-gold text-brand-main font-bold py-3 rounded-xl">تفعيل الاشتراك</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-black text-white mb-1">{activeCourse.title}</h1>
        <p className="text-brand-muted text-sm">{activeLesson.title}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area (2/3) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Content Tabs */}
            <div className="flex bg-brand-card p-1 rounded-xl border border-white/5 w-fit overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-brand-gold text-brand-main' : 'text-brand-muted hover:text-white'}`}
                >
                    <BookOpen size={16} /> محتوى الدرس
                </button>
                <button 
                    onClick={() => setActiveTab('quiz')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'quiz' ? 'bg-brand-gold text-brand-main' : 'text-brand-muted hover:text-white'}`}
                >
                    <HelpCircle size={16} /> الامتحان
                </button>
                <button 
                    onClick={() => setActiveTab('flashcards')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'flashcards' ? 'bg-brand-gold text-brand-main' : 'text-brand-muted hover:text-white'}`}
                >
                    <Brain size={16} /> فلاش كارد
                </button>
            </div>

            {/* VIEWER AREA */}
            <div className="animate-fade-in min-h-[400px]">
                {activeTab === 'content' ? (
                    activeContent ? (
                        <>
                            {/* Render Content Based on Type */}
                            {activeContent.type === 'video' && (
                                <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-video">
                                    <iframe className="w-full h-full absolute inset-0" src={activeContent.url} title={activeContent.title} frameBorder="0" allowFullScreen></iframe>
                                    <Watermark userPhone={user.email} />
                                </div>
                            )}

                            {activeContent.type === 'audio' && (
                                <CustomAudioPlayer url={activeContent.url} title={activeContent.title} userPhone={user.email} />
                            )}

                            {(activeContent.type === 'pdf' || activeContent.type === 'document') && (
                                <DocumentViewer url={activeContent.url} type={activeContent.type} userPhone={user.email} />
                            )}

                            {activeContent.type === 'image' && (
                                <ImageViewer url={activeContent.url} title={activeContent.title} userPhone={user.email} />
                            )}

                            {/* Content Info Bar */}
                            <div className="mt-4 flex items-center justify-between bg-brand-card p-4 rounded-xl border border-white/5">
                                <div>
                                    <h3 className="text-white font-bold text-lg">{activeContent.title}</h3>
                                    <p className="text-xs text-brand-muted mt-1 uppercase flex items-center gap-1">
                                        {getIconForType(activeContent.type)} {activeContent.type} 
                                        {activeContent.duration && ` • ${activeContent.duration}`}
                                        {activeContent.fileSize && ` • ${activeContent.fileSize}`}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => toggleLessonCompletion(activeLesson.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${completedLessons.includes(activeLesson.id) ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                >
                                    <CheckCircle size={16} /> {completedLessons.includes(activeLesson.id) ? 'مكتمل' : 'إنهاء الدرس'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center bg-brand-card rounded-2xl border border-white/5">
                            <FileText size={48} className="text-brand-muted mb-4 opacity-50" />
                            <p className="text-brand-muted">لا يوجد محتوى في هذا الدرس حالياً</p>
                        </div>
                    )
                ) : activeTab === 'quiz' ? (
                     // Placeholder for Quiz View (Existing Logic)
                     <div className="bg-brand-card p-8 rounded-2xl border border-white/5 text-center">
                         <div className="w-16 h-16 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-4">
                             <HelpCircle className="text-brand-gold" size={32} />
                         </div>
                         <h3 className="text-white font-bold text-xl mb-2">امتحان المحاضرة</h3>
                         <p className="text-brand-muted mb-6">اختبر معلوماتك في {lessonQuiz.length} أسئلة.</p>
                         <button className="bg-brand-gold text-brand-main px-6 py-3 rounded-xl font-bold">ابدأ الامتحان</button>
                     </div>
                ) : (
                    // Placeholder for Flashcards (Existing Logic)
                    <div className="bg-brand-card p-8 rounded-2xl border border-white/5 text-center h-[400px] flex flex-col items-center justify-center">
                         <Brain className="text-brand-gold mb-4 opacity-50" size={48} />
                         <h3 className="text-white font-bold text-xl">الفلاش كارد</h3>
                         <p className="text-brand-muted">راجع المصطلحات الهامة</p>
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-4">
            
            {/* Active Lesson Contents List */}
            {activeLesson.contents.length > 0 && (
                <div className="bg-brand-card rounded-2xl border border-brand-gold/20 overflow-hidden shadow-lg">
                    <div className="p-4 bg-brand-gold/10 border-b border-brand-gold/10 flex justify-between items-center">
                        <h3 className="font-bold text-brand-gold text-sm flex items-center gap-2">
                            <Sparkles size={16} />
                            محتويات هذا الدرس
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {activeLesson.contents.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveContent(item); setActiveTab('content'); }}
                                className={`w-full flex items-center gap-3 p-3 transition-colors text-right hover:bg-white/5 ${activeContent?.id === item.id ? 'bg-white/5 border-r-2 border-brand-gold' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeContent?.id === item.id ? 'bg-brand-gold text-brand-main' : 'bg-brand-main text-brand-muted'}`}>
                                    {getIconForType(item.type)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className={`text-sm font-bold truncate ${activeContent?.id === item.id ? 'text-white' : 'text-brand-muted'}`}>{item.title}</p>
                                    <p className="text-[10px] text-brand-muted/50 uppercase">{item.type}</p>
                                </div>
                                {activeContent?.id === item.id && <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Course Playlist */}
            <div className="bg-brand-card rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                <div className="p-4 bg-black/20 border-b border-white/5">
                    <h3 className="font-bold text-white text-sm">فهرس الكورس</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {activeCourse.lessons.map((lesson, idx) => {
                        const accessible = isLessonAccessible(idx);
                        const isActive = activeLesson.id === lesson.id;
                        
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson, idx)}
                                className={`w-full flex items-center gap-3 p-4 border-b border-white/5 last:border-0 text-right transition-colors
                                    ${isActive ? 'bg-brand-gold/5' : 'hover:bg-white/5'}
                                    ${!accessible ? 'opacity-50' : ''}
                                `}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${isActive ? 'bg-brand-gold text-brand-main' : 'bg-brand-main text-brand-muted'}`}>
                                    {accessible ? (idx + 1) : <Lock size={14} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold mb-1 ${isActive ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-brand-muted">
                                        <span>{lesson.contents.length} ملفات</span>
                                        {completedLessons.includes(lesson.id) && <span className="text-green-500 flex items-center gap-1"><CheckCircle size={10} /> مكتمل</span>}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
