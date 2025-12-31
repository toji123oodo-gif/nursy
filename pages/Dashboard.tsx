
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Play, Star, Clock, AlertCircle, CheckCircle, XCircle, FileText, HelpCircle, Download, File, Activity, Unlock, Brain, RotateCw, Bot, Send, Sparkles, X, Headphones, Image as ImageIcon, FileType, Music, Pause, Volume2, VolumeX, Maximize2, BookOpen, ChevronRight, List, FileDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ContentItem } from '../types';
import { GoogleGenAI } from "@google/genai";

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

const CustomAudioPlayer: React.FC<{ url: string, title: string, userPhone: string }> = ({ url, title, userPhone }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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
            <audio 
                ref={audioRef} 
                src={url} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-brand-main border-4 border-brand-gold/30 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                    <Music size={40} className={`text-brand-gold ${isPlaying ? 'animate-spin' : ''}`} />
                </div>
                
                <div className="text-center">
                    <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                </div>

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

                <button 
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-brand-gold text-brand-main flex items-center justify-center hover:scale-105 transition-transform shadow-glow"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
            </div>
            <Watermark userPhone={userPhone} />
        </div>
    );
};

const DocumentViewer: React.FC<{ url: string, type: 'pdf' | 'document', userPhone: string }> = ({ url, type, userPhone }) => {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    return (
        <div className="relative w-full h-[600px] bg-white rounded-2xl overflow-hidden border border-white/10 shadow-xl">
             <iframe src={viewerUrl} className="w-full h-full" frameBorder="0"></iframe>
             <Watermark userPhone={userPhone} />
        </div>
    );
};

const AiChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([
        { sender: 'bot', text: 'مرحباً بك! أنا مساعدك الذكي في Nursy. كيف يمكنني مساعدتك اليوم؟' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

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

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userQuery,
                config: {
                    systemInstruction: "أنت مساعد ذكي لمنصة Nursy التعليمية لطلاب التمريض.",
                    temperature: 0.7,
                }
            });
            setMessages(prev => [...prev, { sender: 'bot', text: response.text || "عذراً، حدث خطأ." }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'bot', text: "خطأ في الاتصال بالذكاء الاصطناعي." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="fixed bottom-24 left-4 md:left-8 w-[90%] md:w-96 bg-brand-card border border-brand-gold/50 rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col h-[450px]">
             <div className="bg-brand-gold p-3 flex justify-between items-center text-brand-main">
                <span className="font-bold flex items-center gap-2"><Bot size={18} /> Nursy AI</span>
                <button onClick={onClose}><X size={16} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-brand-main">
                {messages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-2xl text-sm max-w-[85%] ${m.sender === 'user' ? 'bg-brand-gold/20 text-brand-gold mr-auto' : 'bg-white/5 text-white ml-auto'}`}>
                        {m.text}
                    </div>
                ))}
            </div>
            <div className="p-3 bg-brand-card border-t border-white/5 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-brand-main rounded-full px-4 py-2 text-sm text-white border border-white/10 outline-none" placeholder="اسألني أي شيء..." />
                <button onClick={handleSend} disabled={isThinking} className="w-10 h-10 rounded-full bg-brand-gold text-brand-main flex items-center justify-center"><Send size={18} /></button>
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
  const { user, courses, upgradeToPro, updateUserData } = useApp();
  const [activeCourse, setActiveCourse] = useState(courses[0]); 
  const [activeLesson, setActiveLesson] = useState(activeCourse.lessons[0]);
  const [activeContent, setActiveContent] = useState<ContentItem | null>(activeLesson.contents?.[0] || null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'resources'>('content');
  const [showAiChat, setShowAiChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (activeLesson.contents?.length > 0) {
        setActiveContent(activeLesson.contents[0]);
    } else {
        setActiveContent(null);
    }
  }, [activeLesson]);

  const isLessonAccessible = (index: number) => {
    if (user?.subscriptionTier === 'pro') return true;
    return index < 2; 
  };

  const isLessonCompleted = (lessonId: string) => {
    return user?.completedLessons?.includes(lessonId);
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user) return;
    const currentCompleted = user.completedLessons || [];
    let updatedCompleted: string[];
    
    if (currentCompleted.includes(lessonId)) {
        updatedCompleted = currentCompleted.filter(id => id !== lessonId);
    } else {
        updatedCompleted = [...currentCompleted, lessonId];
    }
    
    await updateUserData({ completedLessons: updatedCompleted });
  };

  const handleDownload = (item: ContentItem) => {
    if (user?.subscriptionTier !== 'pro') return;
    window.open(item.url, '_blank');
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto relative min-h-screen">
      {user.subscriptionTier === 'pro' && !showAiChat && (
          <button onClick={() => setShowAiChat(true)} className="fixed bottom-6 left-6 z-40 bg-brand-gold text-brand-main p-4 rounded-full shadow-glow transform hover:scale-110 transition-transform">
              <Bot size={28} />
          </button>
      )}
      {showAiChat && <AiChatWidget onClose={() => setShowAiChat(false)} />}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex bg-brand-card p-1 rounded-xl border border-white/5">
                    <button 
                        onClick={() => setActiveTab('content')} 
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
                    >
                        المحتوى الدراسي
                    </button>
                    <button 
                        onClick={() => setActiveTab('resources')} 
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'resources' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
                    >
                        المصادر
                    </button>
                    <button 
                        onClick={() => setActiveTab('quiz')} 
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}
                    >
                        اختبار قصير
                    </button>
                </div>
                
                <div className="text-right">
                    <h2 className="text-2xl font-black text-white">{activeLesson.title}</h2>
                    <p className="text-brand-muted text-sm">{activeCourse.title} • {activeCourse.instructor}</p>
                </div>
            </div>
            
            {activeTab === 'content' && activeContent ? (
                <div className="animate-fade-in space-y-6">
                    {activeContent.type === 'video' && (
                        <div className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl ring-1 ring-white/10 group">
                            {activeContent.url ? (
                                <iframe 
                                    className="w-full h-full" 
                                    src={`${activeContent.url}?autoplay=0&rel=0&modestbranding=1`} 
                                    title={activeContent.title}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-muted">
                                    <AlertCircle size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">عذراً، هذا الفيديو غير متوفر حالياً</p>
                                </div>
                            )}
                            <Watermark userPhone={user.phone || user.email} />
                            
                            {/* Overlay info */}
                            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                                    <Play size={14} fill="currentColor" className="text-brand-gold" />
                                    <span className="text-xs font-bold text-white">{activeContent.title}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeContent.type === 'audio' && <CustomAudioPlayer url={activeContent.url} title={activeContent.title} userPhone={user.phone || user.email} />}
                    {(activeContent.type === 'pdf' || activeContent.type === 'document') && <DocumentViewer url={activeContent.url} type={activeContent.type} userPhone={user.phone || user.email} />}
                    
                    {/* Content Meta */}
                    <div className="bg-brand-card border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{activeContent.title}</h4>
                                <p className="text-brand-muted text-xs">تم الرفع بواسطة: {activeCourse.instructor}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                             <button 
                                onClick={() => toggleLessonCompletion(activeLesson.id)}
                                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
                                    isLessonCompleted(activeLesson.id) 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                                    : 'bg-white/5 text-white border-white/5 hover:bg-white/10'
                                }`}
                             >
                                {isLessonCompleted(activeLesson.id) ? (
                                    <>
                                        <CheckCircle size={18} /> تم الإكمال
                                    </>
                                ) : (
                                    <>
                                        <RotateCw size={18} /> تمييز كمكتمل
                                    </>
                                )}
                             </button>
                             <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-brand-muted hover:text-white">
                                <Download size={20} />
                             </button>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'resources' ? (
                <div className="animate-fade-in space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').length > 0 ? (
                            activeLesson.contents
                                .filter(c => c.type === 'pdf' || c.type === 'document')
                                .map((item) => (
                                    <div key={item.id} className="bg-brand-card border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-brand-gold/30 transition-all shadow-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shadow-glow">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm">{item.title}</h4>
                                                <p className="text-brand-muted text-[10px] font-mono mt-1">{item.fileSize || '2.4 MB'} • {item.type.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="relative group/tooltip">
                                            <button 
                                                onClick={() => handleDownload(item)}
                                                disabled={user.subscriptionTier !== 'pro'}
                                                className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
                                                    user.subscriptionTier === 'pro' 
                                                    ? 'bg-brand-gold text-brand-main hover:scale-110 shadow-glow' 
                                                    : 'bg-white/5 text-brand-muted cursor-not-allowed'
                                                }`}
                                            >
                                                {user.subscriptionTier === 'pro' ? <FileDown size={20} /> : <Lock size={20} />}
                                            </button>
                                            
                                            {user.subscriptionTier !== 'pro' && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-brand-main border border-brand-gold/30 text-brand-gold text-[10px] font-black rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-2xl pointer-events-none">
                                                    هذه الميزة متاحة لمشتركي PRO فقط
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-brand-card/30 rounded-3xl border border-dashed border-white/10">
                                <FileText size={48} className="mx-auto mb-4 opacity-10" />
                                <p className="text-brand-muted font-bold">لا توجد ملفات مرفقة لهذا الدرس</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : activeTab === 'content' ? (
                <div className="p-24 text-center text-brand-muted bg-brand-card/30 rounded-3xl border border-dashed border-white/5">
                    <Bot size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold text-lg">اختر درساً من القائمة لبدء التعلم</p>
                    <p className="text-sm mt-2">جميع المواد متاحة للمشتركين PRO</p>
                </div>
            ) : (
                <div className="p-24 text-center text-brand-muted bg-brand-card/30 rounded-3xl border border-dashed border-white/5 animate-fade-in">
                    <Sparkles size={48} className="mx-auto mb-4 text-brand-gold opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">قسم الاختبارات القصير</h3>
                    <p className="max-w-md mx-auto">سيتم إضافة اختبارات تفاعلية بعد كل درس قريباً لتقييم مستواك الدراسي.</p>
                </div>
            )}
        </div>

        {/* Sidebar / Playlist */}
        <div className="w-full lg:w-80 shrink-0">
            <div className="bg-brand-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl sticky top-28">
                <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-black text-white flex items-center gap-2">
                        <List size={18} className="text-brand-gold" />
                        محتويات الكورس
                    </h3>
                    <span className="text-[10px] font-bold bg-brand-gold text-brand-main px-2 py-0.5 rounded-full">
                        {activeCourse.lessons.length} دروس
                    </span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    {activeCourse.lessons.map((lesson, idx) => {
                        const accessible = isLessonAccessible(idx);
                        const isActive = activeLesson.id === lesson.id;
                        const completed = isLessonCompleted(lesson.id);
                        
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => accessible ? setActiveLesson(lesson) : setShowUpgradeModal(true)}
                                className={`w-full flex items-center gap-4 p-5 border-b border-white/5 last:border-0 text-right transition-all group relative ${
                                    isActive ? 'bg-brand-gold/10' : 'hover:bg-white/5'
                                } ${completed ? 'border-r-4 border-r-green-500/50' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all ${
                                    isActive ? 'bg-brand-gold text-brand-main shadow-glow' : 
                                    completed ? 'bg-green-500/10 text-green-500' : 'bg-brand-main text-brand-muted group-hover:text-white'
                                }`}>
                                    {completed ? <CheckCircle size={16} /> : accessible ? (idx + 1) : <Lock size={14} className="text-brand-muted" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold transition-colors ${
                                        isActive ? 'text-brand-gold' : 
                                        completed ? 'text-green-400' : 'text-white'
                                    }`}>{lesson.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock size={10} className="text-brand-muted" />
                                        <span className="text-[10px] text-brand-muted font-bold">{lesson.duration || '45:00'}</span>
                                        {completed && <span className="text-[9px] text-green-500/70 font-black mr-2">مكتمل</span>}
                                    </div>
                                </div>
                                {isActive && <ChevronRight size={16} className="text-brand-gold" />}
                            </button>
                        );
                    })}
                </div>
                
                {user.subscriptionTier === 'free' && (
                    <div className="p-6 bg-brand-gold/10 border-t border-brand-gold/20">
                        <p className="text-[10px] font-bold text-brand-gold mb-3 text-center uppercase tracking-widest">التطوير للباقة الكاملة</p>
                        <Link to="/wallet" className="block w-full bg-brand-gold text-brand-main text-center font-bold py-3 rounded-xl shadow-glow hover:bg-brand-goldHover transition-all">
                            اشترك الآن
                        </Link>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
