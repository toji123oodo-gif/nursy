
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, Mic2, Clock, CheckCircle, FileText, Brain, 
  ChevronLeft, FileDown, Sparkles, Headphones, Play, Pause, 
  SkipBack, SkipForward, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizPlayer } from '../components/QuizPlayer';

const AudioPlayer: React.FC<{ url: string; title: string; userPhone: string }> = ({ url, title, userPhone }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
  };

  return (
    <div className="relative group bg-brand-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-white/10 shadow-2xl overflow-hidden">
      <audio ref={audioRef} src={url} onTimeUpdate={onTimeUpdate} />
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
        <div className="w-32 h-32 md:w-56 md:h-56 bg-brand-main rounded-[2rem] md:rounded-[3rem] flex items-center justify-center shadow-glow">
           <Headphones size={48} className="text-brand-gold md:hidden" />
           <Headphones size={80} className="text-brand-gold hidden md:block" />
        </div>
        <div className="text-center space-y-2 px-2">
           <h3 className="text-xl md:text-4xl font-black text-white tracking-tighter line-clamp-2">{title}</h3>
        </div>
        <div className="w-full">
          <input type="range" value={progress} readOnly className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold" />
        </div>
        <div className="flex items-center gap-6 md:gap-12">
           <button onClick={togglePlay} className="w-16 h-16 md:w-24 md:h-24 bg-brand-gold text-brand-main rounded-full flex items-center justify-center shadow-glow">
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-1" />}
           </button>
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
  const activeLesson = useMemo(() => activeCourse?.lessons.find(l => l.id === activeLessonId) || activeCourse?.lessons[0], [activeCourse, activeLessonId]);

  if (!user || !activeCourse || !activeLesson) return null;

  const isCompleted = (id: string) => user.completedLessons?.includes(id);
  const toggleCompletion = async (id: string) => {
    const updated = isCompleted(id) ? user.completedLessons?.filter(x => x !== id) : [...(user.completedLessons || []), id];
    await updateUserData({ completedLessons: updated });
  };

  const courseProgress = Math.round((user.completedLessons?.length || 0) / activeCourse.lessons.length * 100);

  return (
    <div className="min-h-screen container mx-auto px-4 py-6 md:py-10">
      {isQuizActive && activeLesson.quiz && (
        <QuizPlayer quiz={activeLesson.quiz} onComplete={() => {}} onClose={() => setIsQuizActive(false)} />
      )}

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Resource Area */}
        <div className="flex-1 space-y-8 md:space-y-12">
          <AudioPlayer url={activeLesson.contents.find(c => c.type === 'audio')?.url || ''} title={activeLesson.title} userPhone={user.phone} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-card p-6 md:p-10 rounded-[2.5rem] border border-white/5">
               <h4 className="text-white font-black mb-6 flex items-center gap-3"><FileText className="text-brand-gold" /> الملحقات</h4>
               <div className="space-y-3">
                 {activeLesson.contents.filter(c => c.type === 'pdf').map(f => (
                   <div key={f.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[150px]">{f.title}</span>
                      <button className="p-2 bg-brand-gold text-brand-main rounded-xl"><FileDown size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
            <div className="bg-brand-card p-6 md:p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center">
               <Brain className="text-brand-gold mb-4" size={32} />
               <h4 className="text-white font-black text-lg">اختبار المحاضرة</h4>
               <button onClick={() => setIsQuizActive(true)} className="mt-4 w-full bg-brand-gold text-brand-main font-black py-3 rounded-xl shadow-glow">ابدأ الآن</button>
            </div>
          </div>

          <button onClick={() => toggleCompletion(activeLesson.id)} className={`w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 ${isCompleted(activeLesson.id) ? 'bg-green-500/10 text-green-500' : 'bg-brand-card text-white'}`}>
             {isCompleted(activeLesson.id) ? <CheckCircle /> : <Star />} {isCompleted(activeLesson.id) ? 'تـم الإنجاز' : 'تحديد كمكتمل'}
          </button>
        </div>

        {/* Sidebar / Roadmap (Stacks below on Mobile) */}
        <div className="lg:w-96 space-y-6">
           <div className="bg-brand-card p-8 rounded-[2.5rem] border border-white/10 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-white font-black">خطة المذاكرة</h3>
                 <span className="text-brand-gold font-black">{courseProgress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                 <div className="h-full bg-brand-gold transition-all duration-1000" style={{ width: `${courseProgress}%` }}></div>
              </div>
              <div className="space-y-3 max-h-[40vh] md:max-h-[60vh] overflow-y-auto no-scrollbar">
                {activeCourse.lessons.map((lesson, idx) => (
                  <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${activeLessonId === lesson.id ? 'bg-brand-gold/10 border-brand-gold/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${isCompleted(lesson.id) ? 'bg-green-500 text-white' : 'bg-brand-main text-brand-muted'}`}>{idx + 1}</div>
                    <span className={`text-xs font-bold truncate flex-1 text-right ${activeLessonId === lesson.id ? 'text-brand-gold' : 'text-white'}`}>{lesson.title}</span>
                    {activeLessonId === lesson.id && <ChevronLeft size={16} className="text-brand-gold" />}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
