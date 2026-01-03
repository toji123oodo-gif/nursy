
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, Mic2, Star, Clock, CheckCircle, FileText, Brain, X, 
  ChevronLeft, List, FileDown, ChevronRight, Sparkles, 
  BookOpen, GraduationCap, Flame, TrendingUp, Calendar,
  Play, Pause, SkipBack, SkipForward, Volume2, Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizPlayer } from '../components/QuizPlayer';

const AudioPlayer: React.FC<{ url: string; title: string; userPhone: string }> = ({ url, title, userPhone }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (Number(e.target.value) / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  return (
    <div className="relative group bg-gradient-to-br from-brand-card to-[#0d1b32] rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl overflow-hidden">
      {/* Watermark for Security */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none overflow-hidden">
        <span className="text-white text-9xl font-black rotate-[-25deg] whitespace-nowrap">NURSY - {userPhone}</span>
      </div>

      <audio ref={audioRef} src={url} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedMetadata} />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="w-40 h-40 md:w-56 md:h-56 bg-brand-main rounded-[3rem] border border-brand-gold/20 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-700">
           <Headphones size={80} className="text-brand-gold animate-float" />
        </div>

        <div className="text-center space-y-2">
           <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em]">Audio Lesson</span>
           <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter">{title}</h3>
        </div>

        <div className="w-full space-y-4">
          <input 
            type="range" value={progress} onChange={handleSeek}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold" 
          />
          <div className="flex justify-between text-[10px] font-mono text-brand-muted font-black">
             <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
             <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex items-center gap-8 md:gap-12">
           <button onClick={() => {if(audioRef.current) audioRef.current.currentTime -= 10}} className="text-brand-muted hover:text-white transition-colors"><SkipBack size={32} /></button>
           <button onClick={togglePlay} className="w-24 h-24 bg-brand-gold text-brand-main rounded-full flex items-center justify-center shadow-glow hover:scale-110 active:scale-95 transition-all">
              {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="translate-x-1" />}
           </button>
           <button onClick={() => {if(audioRef.current) audioRef.current.currentTime += 10}} className="text-brand-muted hover:text-white transition-colors"><SkipForward size={32} /></button>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, courses, updateUserData } = useApp();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
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

  if (!user || !activeCourse || !activeLesson) return null;

  const audioContent = activeLesson.contents.find(c => c.type === 'audio');
  const pdfContents = activeLesson.contents.filter(c => c.type === 'pdf' || c.type === 'document');

  const isLessonAccessible = (index: number) => user?.subscriptionTier === 'pro' || index < 1;
  const isCompleted = (id: string) => user.completedLessons?.includes(id);

  const toggleCompletion = async (id: string) => {
    const updated = isCompleted(id) ? user.completedLessons?.filter(x => x !== id) : [...(user.completedLessons || []), id];
    await updateUserData({ completedLessons: updated });
  };

  const handleQuizComplete = async (score: number) => {
    await updateUserData({ quizGrades: { ...(user.quizGrades || {}), [activeLesson.id]: score } });
  };

  const courseProgress = Math.round((user.completedLessons?.length || 0) / activeCourse.lessons.length * 100);

  return (
    <div className="min-h-screen bg-brand-main py-10 px-4 md:px-10">
      {isQuizActive && activeLesson.quiz && (
        <QuizPlayer quiz={activeLesson.quiz} onComplete={handleQuizComplete} onClose={() => setIsQuizActive(false)} />
      )}

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* Main Resource Area */}
        <div className="flex-1 space-y-10">
          
          {/* Section 1: Audio Pod */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Mic2 className="text-brand-gold" /> ركن الاستماع والشرح
            </h2>
            {audioContent ? (
              <AudioPlayer url={audioContent.url} title={activeLesson.title} userPhone={user.phone || user.email} />
            ) : (
              <div className="bg-brand-card/50 border border-white/5 rounded-[3rem] p-20 text-center">
                 <Headphones size={64} className="text-brand-muted opacity-20 mx-auto mb-4" />
                 <p className="text-brand-muted font-bold">لا يوجد ملف صوتي لهذه المحاضرة</p>
              </div>
            )}
          </div>

          {/* Section 2: Files & Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <FileText className="text-brand-gold" /> المذكرات والملخصات
               </h2>
               <div className="space-y-4">
                 {pdfContents.map(file => (
                   <div key={file.id} className="bg-brand-card/80 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><FileDown size={24} /></div>
                        <div>
                          <p className="text-white font-black text-sm">{file.title}</p>
                          <p className="text-[10px] text-brand-muted font-bold">PDF • {file.fileSize || '2.4 MB'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => user.subscriptionTier === 'pro' && window.open(file.url)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${user.subscriptionTier === 'pro' ? 'bg-brand-gold text-brand-main shadow-glow' : 'bg-white/5 text-brand-muted'}`}
                      >
                        {user.subscriptionTier === 'pro' ? <FileDown size={20} /> : <Lock size={18} />}
                      </button>
                   </div>
                 ))}
                 {pdfContents.length === 0 && <p className="text-brand-muted italic text-center py-10 bg-brand-card/20 rounded-[2rem]">لا توجد مذكرات مرفقة</p>}
               </div>
            </div>

            <div className="space-y-6">
               <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Brain className="text-brand-gold" /> مركز الاختبارات
               </h2>
               {activeLesson.quiz ? (
                 <div className="bg-brand-gold/5 border border-brand-gold/20 p-10 rounded-[3rem] text-center space-y-6 group">
                    <div className="w-20 h-20 bg-brand-gold text-brand-main rounded-2xl flex items-center justify-center mx-auto shadow-glow animate-float"><Brain size={40} /></div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-white">اختبار المحاضرة</h3>
                       <p className="text-brand-muted text-xs font-bold">اختبر معلوماتك بعد سماع الشرح</p>
                    </div>
                    <button onClick={() => setIsQuizActive(true)} className="w-full bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow hover:scale-[1.02] transition-all">ابدأ التحدي الآن</button>
                 </div>
               ) : (
                 <div className="bg-brand-card/20 border border-white/5 p-10 rounded-[3rem] text-center text-brand-muted opacity-50 grayscale flex flex-col items-center justify-center h-full">
                    <Lock size={48} className="mb-4" />
                    <p className="font-bold">الاختبار متاح للمشتركين فقط</p>
                 </div>
               )}
            </div>
          </div>
          
          {/* Section 3: Completion CTA */}
          <button 
            onClick={() => toggleCompletion(activeLesson.id)}
            className={`w-full py-8 rounded-[2.5rem] font-black text-2xl transition-all flex items-center justify-center gap-4 ${isCompleted(activeLesson.id) ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-brand-card text-white border border-white/5 hover:border-brand-gold/30'}`}
          >
            {isCompleted(activeLesson.id) ? <><CheckCircle size={32} /> تـم إنجاز المحاضرة</> : <><Star size={32} /> حدد كـمكتملة</>}
          </button>
        </div>

        {/* Roadmap Sidebar */}
        <div className="lg:w-[450px] shrink-0">
           <div className="bg-brand-card/60 backdrop-blur-3xl rounded-[4rem] border border-white/10 sticky top-28 overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-white/5 space-y-6">
                 <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-2xl font-black">خطة المذاكرة</h3>
                      <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mt-1">Course Roadmap</p>
                    </div>
                    <span className="text-3xl font-black text-brand-gold">{courseProgress}%</span>
                 </div>
                 <div className="h-2 bg-brand-main rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className="h-full bg-brand-gold rounded-full transition-all duration-1000" style={{ width: `${courseProgress}%` }}></div>
                 </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-6 space-y-4">
                 {activeCourse.lessons.map((lesson, idx) => {
                   const accessible = isLessonAccessible(idx);
                   const active = activeLessonId === lesson.id;
                   const done = isCompleted(lesson.id);
                   return (
                     <button 
                       key={lesson.id}
                       onClick={() => accessible && setActiveLessonId(lesson.id)}
                       className={`w-full flex items-center gap-5 p-5 rounded-[1.8rem] border transition-all ${active ? 'bg-brand-gold/10 border-brand-gold/40' : 'bg-brand-main/50 border-white/5 hover:bg-white/5'} ${!accessible && 'opacity-30 grayscale cursor-not-allowed'}`}
                     >
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${active ? 'bg-brand-gold text-brand-main shadow-glow' : done ? 'bg-green-500/20 text-green-500' : 'bg-brand-card text-brand-muted'}`}>
                         {accessible ? (done ? <CheckCircle size={20}/> : idx + 1) : <Lock size={18}/>}
                       </div>
                       <div className="flex-1 text-right">
                         <p className={`font-black text-sm ${active ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</p>
                         <p className="text-[9px] text-brand-muted font-bold flex items-center gap-2 mt-1">
                            <Clock size={10} /> 45 دقيقة • {lesson.quiz ? 'اختبار متاح' : 'بدون اختبار'}
                         </p>
                       </div>
                       {active && <ChevronLeft className="text-brand-gold animate-bounce-slow" size={20} />}
                     </button>
                   );
                 })}
              </div>
              
              <Link to="/wallet" className="block p-8 bg-brand-main/50 text-center font-black text-brand-gold hover:bg-brand-gold hover:text-brand-main transition-all uppercase text-xs tracking-widest border-t border-white/5">
                تطوير الحساب لـ PRO
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};
