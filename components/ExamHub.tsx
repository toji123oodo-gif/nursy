
import React, { useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  X, Sparkles, Flame, ListChecks
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Exam } from '../types';

const EXAMS_DATA: Exam[] = [
  { id: 'ex1', title: 'English 1', code: 'ENG022', date: 'الخميس 25/12/2025', time: '2:30PM - 4:00PM', location: 'Digital Library L2, L3' },
  { id: 'ex2', title: 'Adult Health Nursing I', code: 'AHN 111', date: 'الأربعاء 31/12/2025', time: '9:15AM - 11:30AM', location: 'Digital Library L1A, L1B, L2, L3, L4' },
  { id: 'ex3', title: 'Health Assessment', code: 'AHN 113', date: 'الاثنين 5/1/2026', time: '9:30AM - 12:00PM', location: 'Digital Library L1A, L1B, L2, L3, L4' },
  { id: 'ex4', title: 'Microbiology (for Nursing)', code: 'BMS 174', date: 'الاثنين 12/1/2026', time: '9:30AM - 12:00PM', location: 'Digital Library L1A, L1B, L2, L3, L4' },
  { id: 'ex5', title: 'Anatomy (for Nursing)', code: 'BMS 114', date: 'الخميس 15/1/2026', time: '9:30AM - 12:00PM', location: 'Digital Library L1A, L1B, L2, L3, L4' },
  { id: 'ex6', title: 'Physiology (for Nursing)', code: 'BMS 134', date: 'الخميس 22/1/2026', time: '9:30AM - 12:00PM', location: 'Digital Library L1A, L1B, L2, L3, L4' },
];

export const ExamHub: React.FC = () => {
  const { user, updateUserData, isExamHubOpen, setExamHubOpen } = useApp();

  const completedExams = useMemo(() => user?.completedExams || [], [user]);
  const progress = useMemo(() => Math.round((completedExams.length / EXAMS_DATA.length) * 100), [completedExams]);

  const toggleExam = async (examId: string) => {
    if (!user) return;
    const isCompleted = completedExams.includes(examId);
    const newCompleted = isCompleted 
      ? completedExams.filter(id => id !== examId) 
      : [...completedExams, examId];
    
    await updateUserData({ completedExams: newCompleted });
  };

  if (!isExamHubOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-brand-main/90 backdrop-blur-xl animate-fade-in" onClick={() => setExamHubOpen(false)}></div>
      
      <div className="relative w-full max-w-5xl bg-brand-card/50 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-right">
                <div className="flex items-center gap-3 text-brand-gold font-black mb-2 uppercase tracking-widest text-xs">
                    <Flame size={16} className="animate-pulse" /> مركز متابعة امتحانات 2025/2026
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">رحلتك نحو <span className="text-brand-gold">الامتياز</span></h2>
            </div>
            
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="8" />
                        <circle 
                            cx="50%" cy="50%" r="45%" 
                            className="stroke-brand-gold fill-none transition-all duration-1000" 
                            strokeWidth="8" 
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * progress) / 100}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl md:text-3xl font-black text-white">{progress}%</span>
                    </div>
                </div>
                <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest">إجمالي الإنجاز</p>
            </div>

            <button onClick={() => setExamHubOpen(false)} className="absolute top-8 left-8 p-3 bg-white/5 text-brand-muted hover:text-white rounded-2xl transition-all">
                <X size={28} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-main/40 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-inner">
                    <div className="w-14 h-14 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center"><ListChecks size={28} /></div>
                    <div>
                        <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">المواد المتبقية</p>
                        <h4 className="text-2xl font-black text-white">{EXAMS_DATA.length - completedExams.length} مواد</h4>
                    </div>
                </div>
                <div className="bg-brand-main/40 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-inner">
                    <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center"><CheckCircle2 size={28} /></div>
                    <div>
                        <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">المواد المنتهية</p>
                        <h4 className="text-2xl font-black text-white">{completedExams.length} مواد</h4>
                    </div>
                </div>
                <div className="bg-brand-main/40 p-6 rounded-3xl border border-white/5 flex items-center gap-5 shadow-inner">
                    <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center"><Clock size={28} /></div>
                    <div>
                        <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest mb-1">موعد الامتحان القادم</p>
                        <h4 className="text-xs font-black text-white">25 ديسمبر 2025</h4>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {EXAMS_DATA.map((exam, idx) => {
                    const isDone = completedExams.includes(exam.id);
                    return (
                        <div 
                            key={exam.id}
                            className={`group relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 ${
                                isDone 
                                ? 'bg-green-500/5 border-green-500/20 grayscale-[0.5]' 
                                : 'bg-brand-main/50 border-white/5 hover:border-brand-gold/30 hover:shadow-glow/10'
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${
                                isDone ? 'bg-green-500 text-white' : 'bg-brand-card text-brand-muted group-hover:bg-brand-gold group-hover:text-brand-main'
                            }`}>
                                {isDone ? <CheckCircle2 size={28} /> : idx + 1}
                            </div>

                            <div className="flex-1 text-center md:text-right space-y-2">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h3 className={`text-xl md:text-2xl font-black transition-all ${isDone ? 'text-green-500/80 line-through' : 'text-white'}`}>
                                        {exam.title}
                                    </h3>
                                    <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-brand-muted font-mono">{exam.code}</span>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-brand-muted">
                                    <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-gold" /> {exam.date}</span>
                                    <span className="flex items-center gap-2"><Clock size={14} className="text-brand-gold" /> {exam.time}</span>
                                    <span className="flex items-center gap-2"><MapPin size={14} className="text-brand-gold" /> {exam.location}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => toggleExam(exam.id)}
                                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 flex items-center gap-3 ${
                                    isDone 
                                    ? 'bg-green-500/10 text-green-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 border border-green-500/20' 
                                    : 'bg-brand-gold text-brand-main shadow-glow'
                                }`}
                            >
                                {isDone ? <>تراجـع</> : <>تـم الانتهاء</>}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/5 flex justify-center">
            <div className="flex items-center gap-4 text-brand-muted text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles size={16} className="text-brand-gold" /> كل التوفيق لفرسان التمريض في مصر
            </div>
        </div>
      </div>
    </div>
  );
};
