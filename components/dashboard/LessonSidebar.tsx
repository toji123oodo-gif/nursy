
import React from 'react';
import { List, Clock, Zap, CheckCircle, Star } from 'lucide-react';
import { Lesson } from '../../types';

interface Props {
  lessons: Lesson[];
  activeLessonId: string;
  completedLessons: string[];
  onLessonClick: (id: string) => void;
}

export const LessonSidebar: React.FC<Props> = ({ lessons, activeLessonId, completedLessons, onLessonClick }) => {
  const isCompleted = (id: string) => completedLessons.includes(id);

  return (
    <div className="bg-brand-card p-8 md:p-10 rounded-[3.5rem] border border-white/10 sticky top-32 shadow-2xl overflow-hidden ns-animate--fade-in-up">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-30"></div>
      
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          <List className="text-brand-gold" /> خريطة المذاكرة
        </h3>
        <div className="w-12 h-12 rounded-2xl bg-brand-main border border-brand-gold/20 flex items-center justify-center text-brand-gold font-black text-sm">
          {lessons.length}
        </div>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto ns-util--no-scrollbar pr-1">
        {lessons.map((lesson, idx) => (
          <button 
            key={lesson.id} 
            onClick={() => onLessonClick(lesson.id)} 
            className={`w-full group flex items-center gap-6 p-5 rounded-3xl border transition-all duration-500 ${
              activeLessonId === lesson.id 
              ? 'bg-brand-gold/10 border-brand-gold/40 shadow-inner scale-[1.02]' 
              : 'bg-brand-main/50 border-white/5 hover:border-brand-gold/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 transition-all ${
              isCompleted(lesson.id) 
              ? 'bg-green-500 text-white' 
              : activeLessonId === lesson.id 
                ? 'bg-brand-gold text-brand-main ns-shadow--premium' 
                : 'bg-brand-card text-brand-muted group-hover:bg-brand-gold/20 group-hover:text-brand-gold'
            }`}>
              {isCompleted(lesson.id) ? <CheckCircle size={20} /> : idx + 1}
            </div>
            
            <div className="flex-1 text-right overflow-hidden">
              <p className={`text-sm font-black truncate transition-colors ${activeLessonId === lesson.id ? 'text-brand-gold' : 'text-white'}`}>
                {lesson.title}
              </p>
              <p className="text-[10px] text-brand-muted font-bold flex items-center gap-2 mt-1">
                <Clock size={10} /> {lesson.duration || '45 دقيقة'}
              </p>
            </div>

            {activeLessonId === lesson.id && <Zap size={16} className="text-brand-gold animate-pulse" />}
          </button>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-white/5">
        <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-brand-main flex items-center justify-center text-brand-gold shadow-inner">
            <Star size={24} fill="currentColor"/>
          </div>
          <div>
            <p className="text-white font-black text-sm">استمر يا بطل!</p>
            <p className="text-brand-muted text-[10px] font-bold">باقي لك {lessons.length - completedLessons.length} محاضرات</p>
          </div>
        </div>
      </div>
    </div>
  );
};
