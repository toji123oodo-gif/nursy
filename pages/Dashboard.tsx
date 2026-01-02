
import React, { useState, useEffect, useMemo } from 'react';
// Added missing Link import from react-router-dom
import { Link } from 'react-router-dom';
import { Lock, Play, Star, Clock, CheckCircle, FileText, MonitorPlay, Brain, X, ChevronLeft, List, FileDown, Layers, ChevronRight, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContentItem, Course, Lesson } from '../types';
import { QuizPlayer } from '../components/QuizPlayer';

const Watermark: React.FC<{ userPhone: string }> = ({ userPhone }) => {
  const [position, setPosition] = useState({ top: 10, left: 10 });
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({ top: Math.random() * 80 + 10, left: Math.random() * 80 + 10 });
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="absolute pointer-events-none z-50 text-white/5 md:text-white/10 font-black select-none transition-all duration-1000 text-[10px] md:text-base" style={{ top: `${position.top}%`, left: `${position.left}%`, transform: 'rotate(-15deg)' }}>
      NURSY - {userPhone}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, courses, updateUserData } = useApp();
  
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'resources'>('content');
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    if (courses.length > 0 && !activeCourseId) {
      setActiveCourseId(courses[0].id);
      setActiveLessonId(courses[0].lessons[0]?.id || null);
    }
  }, [courses, activeCourseId]);

  const activeCourse = useMemo(() => courses.find(c => c.id === activeCourseId) || courses[0], [courses, activeCourseId]);
  const activeLesson = useMemo(() => {
    if (!activeCourse) return null;
    return activeCourse.lessons.find(l => l.id === activeLessonId) || activeCourse.lessons[0];
  }, [activeCourse, activeLessonId]);
  
  const activeContent = useMemo(() => {
    if (!activeLesson) return null;
    return activeLesson.contents.find(c => c.type === 'video') || activeLesson.contents[0] || null;
  }, [activeLesson]);

  if (!user || !activeCourse || !activeLesson) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-main">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const isLessonAccessible = (index: number) => {
    if (user?.subscriptionTier === 'pro') return true;
    return index < 2; 
  };

  const isLessonCompleted = (lessonId: string) => user?.completedLessons?.includes(lessonId);

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user) return;
    const currentCompleted = user.completedLessons || [];
    const updatedCompleted = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];
    await updateUserData({ completedLessons: updatedCompleted });
  };

  const handleQuizComplete = async (score: number) => {
    if (!user) return;
    const currentGrades = user.quizGrades || {};
    await updateUserData({ quizGrades: { ...currentGrades, [activeLesson.id]: score } });
  };

  const courseProgress = Math.round((user.completedLessons?.length || 0) / activeCourse.lessons.length * 100);

  return (
    <div className="min-h-screen bg-brand-main py-6 md:py-12 px-4 md:px-10">
      {/* Quiz Full Screen Overlay */}
      {isQuizActive && activeLesson.quiz && (
        <QuizPlayer 
          quiz={activeLesson.quiz} 
          onComplete={handleQuizComplete} 
          onClose={() => setIsQuizActive(false)} 
        />
      )}

      <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-10 xl:gap-14">
        
        {/* Main Area: Player & Tabs */}
        <div className="flex-1 space-y-10">
            {/* Premium Player Container */}
            <div className="player-glow-container animate-fade-in">
                <div className="bg-brand-card rounded-[3rem] md:rounded-[4rem] border border-white/10 overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] relative group">
                    <div className="aspect-video bg-black relative">
                       {activeContent?.type === 'video' ? (
                          <iframe className="w-full h-full" src={`${activeContent.url}?modestbranding=1&rel=0&autoplay=0`} title={activeContent.title} frameBorder="0" allowFullScreen></iframe>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-brand-muted gap-4">
                             <MonitorPlay size={80} className="opacity-10 animate-pulse" />
                             <p className="font-black text-xl italic tracking-tighter">المحتوى المرئي يتم تجهيزه...</p>
                          </div>
                        )}
                        <Watermark userPhone={user.phone || user.email} />
                    </div>
                    
                    {/* Lesson Info Header */}
                    <div className="p-8 md:p-12 bg-gradient-to-tr from-brand-card via-brand-card to-brand-hover/20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
                        <div className="text-center md:text-right w-full">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                                <Sparkles size={14} className="animate-pulse" /> {activeCourse.subject} &bull; {activeCourse.title}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">{activeLesson.title}</h2>
                        </div>
                        
                        <div className="flex bg-brand-main/80 p-2 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl w-full md:w-auto">
                            <button onClick={() => setActiveTab('content')} className={`flex-1 md:flex-none px-8 md:px-12 py-4 rounded-[1.8rem] text-xs font-black transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'content' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>
                                <BookOpen size={18} /> التفاصيل
                            </button>
                            <button onClick={() => setActiveTab('resources')} className={`flex-1 md:flex-none px-8 md:px-12 py-4 rounded-[1.8rem] text-xs font-black transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'resources' ? 'bg-brand-gold text-brand-main shadow-glow' : 'text-brand-muted hover:text-white'}`}>
                                <FileDown size={18} /> المصادر
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Contents with Better UI */}
            <div className="animate-fade-in-up">
                {activeTab === 'resources' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').map(item => (
                          <div key={item.id} className="premium-card p-10 rounded-[3rem] flex items-center justify-between group relative overflow-hidden">
                              <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full"></div>
                              <div className="flex items-center gap-6 relative z-10">
                                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-gold/10 rounded-[2rem] flex items-center justify-center text-brand-gold shadow-inner shrink-0 group-hover:scale-110 transition-transform"><FileText size={32} /></div>
                                  <div>
                                      <h4 className="text-white font-black text-xl md:text-2xl line-clamp-1">{item.title}</h4>
                                      <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                          <CheckCircle size={12} className="text-green-500"/> متاح للتحميل (PDF)
                                      </p>
                                  </div>
                              </div>
                              <button onClick={() => user.subscriptionTier === 'pro' && window.open(item.url)} className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center transition-all shrink-0 relative z-10 ${user.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main shadow-glow' : 'bg-white/5 text-brand-muted'}`}>
                                  {user.subscriptionTier === 'pro' ? <FileDown size={28} /> : <Lock size={22} />}
                              </button>
                          </div>
                      ))}
                      {activeLesson.contents?.filter(c => c.type === 'pdf' || c.type === 'document').length === 0 && (
                        <div className="col-span-full py-20 text-center bg-brand-card/20 rounded-[3rem] border border-white/5">
                            <FileText size={48} className="mx-auto text-brand-muted mb-4 opacity-20" />
                            <p className="text-brand-muted font-bold text-lg italic">لا توجد ملفات مرفقة لهذه المحاضرة حالياً</p>
                        </div>
                      )}
                  </div>
                )}
                
                {activeTab === 'content' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="premium-card p-10 md:p-14 rounded-[4rem] flex flex-col items-center text-center gap-8 group hover:border-brand-gold/50">
                          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-700 ${isLessonCompleted(activeLesson.id) ? 'bg-green-500/20 text-green-500 rotate-12 scale-110' : 'bg-brand-gold/20 text-brand-gold -rotate-6'}`}>
                              {isLessonCompleted(activeLesson.id) ? <CheckCircle size={56} /> : <Star size={56} />}
                          </div>
                          <div className="space-y-3">
                              <h4 className="text-white font-black text-2xl md:text-3xl">إنجاز المحاضرة</h4>
                              <p className="text-brand-muted text-sm md:text-base font-medium leading-relaxed max-w-xs">اضغط هنا لتمييز المحاضرة كمكتملة في سجلك الأكاديمي.</p>
                          </div>
                          <button onClick={() => toggleLessonCompletion(activeLesson.id)} className={`w-full py-5 rounded-[1.8rem] font-black text-lg md:text-xl transition-all transform active:scale-95 ${isLessonCompleted(activeLesson.id) ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-brand-gold text-brand-main shadow-glow'}`}>
                              {isLessonCompleted(activeLesson.id) ? 'إلغاء الإتمام' : 'تمت المذاكرة'}
                          </button>
                      </div>

                      {activeLesson.quiz ? (
                        <div className="premium-card p-10 md:p-14 rounded-[4rem] flex flex-col items-center text-center gap-8 border-brand-gold/20 bg-brand-gold/5 group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-brand-gold text-brand-main flex items-center justify-center shadow-glow animate-float">
                                <Brain size={56} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-white font-black text-2xl md:text-3xl">تحدي الذكاء</h4>
                                <p className="text-brand-muted text-sm md:text-base font-medium leading-relaxed max-w-xs">ابدأ الاختبار الآن لتثبيت المعلومات التي تعلمتها في الفيديو.</p>
                            </div>
                            <button onClick={() => setIsQuizActive(true)} className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-[1.8rem] shadow-glow hover:scale-[1.03] transition-all text-lg md:text-xl flex items-center justify-center gap-4">
                                ابدأ الاختبار الآن <ChevronLeft size={24} />
                            </button>
                        </div>
                      ) : (
                        <div className="premium-card p-10 md:p-14 rounded-[4rem] flex flex-col items-center justify-center text-center gap-6 border-white/5 opacity-50 grayscale">
                             <GraduationCap size={64} className="text-brand-muted" />
                             <p className="text-brand-muted font-bold text-lg">الاختبار متاح فقط في مواد البريميوم</p>
                        </div>
                      )}
                  </div>
                )}
            </div>
        </div>

        {/* Right Sidebar: Premium Roadmap UI */}
        <div className="xl:w-[500px] shrink-0">
            <div className="bg-brand-card/40 backdrop-blur-3xl rounded-[3.5rem] md:rounded-[5rem] border border-white/10 overflow-hidden sticky top-32 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
                {/* Roadmap Header */}
                <div className="p-10 md:p-12 border-b border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold to-transparent"></div>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h3 className="text-white text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-4">
                                <List size={28} className="text-brand-gold" /> خارطة المنهج
                            </h3>
                            <p className="text-[10px] text-brand-muted font-black uppercase tracking-[0.4em] mt-3">Curriculum Journey</p>
                        </div>
                        <div className="text-left">
                            <span className="text-4xl font-black text-brand-gold">{courseProgress}%</span>
                        </div>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-2.5 bg-brand-main rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="h-full bg-brand-gold rounded-full shadow-glow transition-all duration-1000 ease-out" style={{ width: `${courseProgress}%` }}></div>
                    </div>
                </div>
                
                {/* Roadmap Lessons List */}
                <div className="max-h-[55vh] xl:max-h-[65vh] overflow-y-auto no-scrollbar py-8 px-6 space-y-6 relative">
                    <div className="roadmap-line"></div>
                    
                    {activeCourse.lessons.map((lesson, idx) => {
                        const accessible = isLessonAccessible(idx);
                        const active = activeLessonId === lesson.id;
                        const completed = isLessonCompleted(lesson.id);
                        return (
                            <button 
                              key={lesson.id} 
                              onClick={() => accessible && setActiveLessonId(lesson.id)} 
                              className={`w-full group flex items-center gap-6 p-6 md:p-7 rounded-[2.5rem] border transition-all duration-500 text-right relative z-10 ${
                                active 
                                ? 'bg-brand-gold/10 border-brand-gold/40 shadow-glow/10 translate-x-[-10px]' 
                                : 'bg-brand-main/40 border-white/5 hover:border-white/20 hover:bg-brand-main/60'
                              } ${!accessible ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl shrink-0 transition-all duration-500 relative z-10 ${
                                  active 
                                  ? 'bg-brand-gold text-brand-main shadow-glow scale-110' 
                                  : completed 
                                    ? 'bg-green-500/20 text-green-500' 
                                    : 'bg-brand-card text-brand-muted'
                                }`}>
                                    {accessible ? (completed ? <CheckCircle size={28} /> : idx + 1) : <Lock size={24} />}
                                    {active && <div className="absolute inset-0 rounded-2xl border-2 border-brand-gold animate-ping opacity-20"></div>}
                                </div>

                                <div className="flex-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className={`text-base md:text-xl font-black transition-all ${active ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-brand-muted/70">
                                       <span className="flex items-center gap-1.5"><Clock size={12} className="text-brand-gold" /> 45د</span>
                                       {lesson.quiz && <span className="text-brand-gold/80 flex items-center gap-1.5"><Brain size={12} /> اختبار</span>}
                                       {accessible && !completed && !active && <span className="text-white/20">&bull; جاهز</span>}
                                    </div>
                                </div>
                                
                                {active && (
                                   <div className="w-10 h-10 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center animate-bounce-slow">
                                      <ChevronLeft size={20} />
                                   </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {/* Roadmap Sidebar Footer */}
                <div className="p-10 bg-brand-main/50 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] text-brand-muted font-black uppercase tracking-widest">المستوى الحالي</p>
                            <p className="text-lg font-black text-white">طالب مجتهد</p>
                        </div>
                    </div>
                    <Link to="/wallet" className="px-6 py-3 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase border border-white/10 hover:bg-brand-gold hover:text-brand-main transition-all">تفعيل PRO</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
