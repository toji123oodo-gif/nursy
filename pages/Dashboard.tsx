
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Play, Star, Clock, AlertCircle, CheckCircle, XCircle, FileText, HelpCircle, Download, File, Activity, Unlock, Brain, RotateCw, Bot, Send, Sparkles, X, Headphones, Image as ImageIcon, FileType, Music, Pause, Volume2, VolumeX, Maximize2, BookOpen, ChevronRight, List, FileDown, Layout, ChevronLeft, ChevronDown, MonitorPlay } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ContentItem } from '../types';

const Watermark: React.FC<{ userPhone: string }> = ({ userPhone }) => {
  const [position, setPosition] = useState({ top: 10, left: 10 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-50 text-white/5 md:text-white/10 font-black select-none transition-all duration-1000 text-[10px] md:text-base"
      style={{ top: `${position.top}%`, left: `${position.left}%`, transform: 'rotate(-15deg)' }}
    >
      NURSY - {userPhone}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, courses, updateUserData } = useApp();
  const [activeCourse, setActiveCourse] = useState(courses[0]); 
  const [activeLesson, setActiveLesson] = useState(activeCourse.lessons[0]);
  const [activeContent, setActiveContent] = useState<ContentItem | null>(activeLesson.contents?.[0] || null);
  const [activeTab, setActiveTab] = useState<'content' | 'resources'>('content');
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    if (activeLesson.contents?.length > 0) {
        setActiveContent(activeLesson.contents[0]);
    } else {
        setActiveContent(null);
    }
    // Smooth scroll to top on mobile lesson change
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const updatedCompleted = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];
    await updateUserData({ completedLessons: updatedCompleted });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen px-0 md:px-8 py-0 md:py-8 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 md:gap-8">
        
        {/* Main Content Side */}
        <div className="flex-1 space-y-4 md:space-y-6">
            
            {/* Video Player - Edge to edge on mobile */}
            {activeTab === 'content' && activeContent && activeContent.type === 'video' ? (
                <div className="relative aspect-video bg-black md:rounded-[2.5rem] overflow-hidden shadow-2xl border-b md:border border-white/10 group ring-4 ring-black">
                    <iframe 
                        className="w-full h-full" 
                        src={`${activeContent.url}?modestbranding=1&rel=0`} 
                        title={activeContent.title}
                        frameBorder="0" 
                        allowFullScreen
                    ></iframe>
                    <Watermark userPhone={user.phone || user.email} />
                </div>
            ) : null}

            {/* Lesson Title & Info - Padding only on mobile */}
            <div className="px-6 md:px-0 space-y-4">
                <div className="bg-brand-card/30 md:bg-brand-card/50 border border-white/5 p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full">
                        <div className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase mb-2">
                            <MonitorPlay size={14} /> {activeCourse.title}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{activeLesson.title}</h2>
                    </div>
                    <div className="flex bg-brand-main p-1.5 rounded-2xl border border-white/5 w-full md:w-auto shadow-inner">
                        <button onClick={() => setActiveTab('content')} className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'content' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>الدرس</button>
                        <button onClick={() => setActiveTab('resources')} className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'resources' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>الملفات</button>
                    </div>
                </div>

                {activeTab === 'resources' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                      {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').map(item => (
                          <div key={item.id} className="bg-brand-card/50 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:border-brand-gold/30 transition-all shadow-xl group">
                              <div className="flex items-center gap-4">
                                  <div className="p-4 bg-brand-gold/10 rounded-2xl text-brand-gold group-hover:scale-110 transition-transform"><FileText size={24} /></div>
                                  <div>
                                      <h4 className="text-white font-black text-sm">{item.title}</h4>
                                      <p className="text-brand-muted text-[10px] font-mono mt-1 opacity-60">{item.fileSize || '2.0 MB'}</p>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => user.subscriptionTier === 'pro' && window.open(item.url)}
                                  className={`p-4 rounded-2xl transition-all shadow-lg ${user.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main active:scale-90' : 'bg-white/5 text-brand-muted cursor-not-allowed'}`}
                              >
                                  {user.subscriptionTier === 'pro' ? <FileDown size={22} /> : <Lock size={22} />}
                              </button>
                          </div>
                      ))}
                  </div>
                )}

                {/* Completion CTA */}
                <div className="bg-brand-card/50 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className={`p-4 rounded-2xl shrink-0 shadow-lg ${isLessonCompleted(activeLesson.id) ? 'bg-green-500/20 text-green-500 shadow-green-500/10' : 'bg-brand-gold/20 text-brand-gold shadow-brand-gold/10'}`}>
                            {isLessonCompleted(activeLesson.id) ? <CheckCircle size={28} /> : <Star size={28} />}
                        </div>
                        <div>
                            <h4 className="text-white font-black text-lg leading-tight">حالة الدرس</h4>
                            <p className="text-brand-muted text-xs mt-1">{isLessonCompleted(activeLesson.id) ? 'أحسنت! لقد أتممت هذا الدرس بنجاح' : 'هذا الدرس لم يكتمل، حدده عند الانتهاء'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => toggleLessonCompletion(activeLesson.id)}
                        className={`w-full md:w-auto px-10 py-4.5 rounded-[1.5rem] md:rounded-2xl font-black text-sm md:text-base transition-all transform active:scale-95 shadow-xl ${
                            isLessonCompleted(activeLesson.id) 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                            : 'bg-brand-gold text-brand-main shadow-glow'
                        }`}
                    >
                        {isLessonCompleted(activeLesson.id) ? 'إلغاء المكتمل' : 'تمييز كمكتمل'}
                    </button>
                </div>

                {/* Mobile Floating Lesson Selector */}
                <div className="lg:hidden">
                    <button 
                      onClick={() => setShowPlaylist(true)}
                      className="w-full bg-brand-gold/10 border border-brand-gold/20 p-6 rounded-[2rem] flex items-center justify-between text-brand-gold font-black active:scale-95 transition-all shadow-glow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-brand-gold text-brand-main p-2 rounded-lg"><List size={18} /></div>
                        <span>عرض قائمة الدروس</span>
                      </div>
                      <span className="text-[10px] bg-brand-gold/20 px-3 py-1 rounded-full uppercase tracking-widest">{activeCourse.lessons.length} درس</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Desktop Sidebar Playlist */}
        <div className="hidden lg:block w-96 shrink-0">
            <div className="bg-brand-card rounded-[3rem] border border-white/5 overflow-hidden sticky top-28 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                <div className="p-8 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-white text-xl font-black flex items-center gap-3"><List size={22} className="text-brand-gold" /> قائمة الدروس</h3>
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px] font-black text-brand-gold border border-brand-gold/20">
                      {activeCourse.lessons.length}
                    </div>
                </div>
                <div className="max-h-[65vh] overflow-y-auto custom-scrollbar no-scrollbar py-2">
                    {activeCourse.lessons.map((lesson, idx) => {
                        const accessible = isLessonAccessible(idx);
                        const active = activeLesson.id === lesson.id;
                        const completed = isLessonCompleted(lesson.id);
                        return (
                            <button 
                                key={lesson.id}
                                onClick={() => accessible && setActiveLesson(lesson)}
                                className={`w-full flex items-center gap-5 p-6 border-b border-white/5 last:border-0 transition-all text-right ${active ? 'bg-brand-gold/10' : 'hover:bg-white/5'} ${!accessible ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 transition-all shadow-lg ${
                                    active ? 'bg-brand-gold text-brand-main' : completed ? 'bg-green-500/20 text-green-500 shadow-green-500/5' : 'bg-brand-main text-brand-muted'
                                }`}>
                                    {accessible ? completed ? <CheckCircle size={22} /> : (idx + 1) : <Lock size={20} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm md:text-base font-black transition-colors ${active ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Clock size={12} className="text-brand-muted" />
                                        <span className="text-[10px] text-brand-muted font-bold tracking-wider">{lesson.duration || '40:00'}</span>
                                    </div>
                                </div>
                                {active && <ChevronLeft size={20} className="text-brand-gold animate-bounce-x" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Mobile Modern Bottom Drawer for Lessons */}
        <div className={`lg:hidden fixed inset-0 z-[150] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showPlaylist ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-brand-main/80 backdrop-blur-md transition-opacity duration-500 ${showPlaylist ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowPlaylist(false)}></div>
            <div className={`absolute bottom-0 left-0 right-0 bg-brand-card rounded-t-[3.5rem] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 transform ${showPlaylist ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex flex-col h-[75vh]">
                    <div className="p-4 flex flex-col items-center">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mb-6"></div>
                        <div className="w-full px-4 flex items-center justify-between">
                          <h3 className="text-2xl font-black text-white">قائمة المحاضرات</h3>
                          <button onClick={() => setShowPlaylist(false)} className="p-3 bg-white/5 rounded-2xl text-brand-muted active:scale-90 transition-all"><X size={24} /></button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-3 no-scrollbar">
                        {activeCourse.lessons.map((lesson, idx) => {
                            const accessible = isLessonAccessible(idx);
                            const active = activeLesson.id === lesson.id;
                            const completed = isLessonCompleted(lesson.id);
                            return (
                                <button 
                                    key={lesson.id}
                                    onClick={() => {
                                        if (accessible) {
                                            setActiveLesson(lesson);
                                            setShowPlaylist(false);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-5 p-5 rounded-[2rem] border transition-all text-right active:scale-[0.98] ${active ? 'bg-brand-gold/10 border-brand-gold/30' : 'bg-white/5 border-transparent'} ${!accessible ? 'opacity-40' : ''}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-xl ${
                                        active ? 'bg-brand-gold text-brand-main' : completed ? 'bg-green-500/20 text-green-500 shadow-green-500/5' : 'bg-brand-main text-brand-muted'
                                    }`}>
                                        {accessible ? completed ? <CheckCircle size={22} /> : (idx + 1) : <Lock size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-black transition-colors ${active ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] text-brand-muted font-bold tracking-widest">{lesson.duration || '40:00'}</span>
                                        </div>
                                    </div>
                                    {active && <div className="w-2 h-2 bg-brand-gold rounded-full shadow-glow"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
