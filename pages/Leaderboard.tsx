
import React, { useMemo } from 'react';
import { Trophy, Medal, Star, Flame, Crown, Sparkles, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Leaderboard: React.FC = () => {
  const { user } = useApp();

  // Mock data for other students
  const topStudents = [
    { name: 'أحمد محمود القاضي', xp: 12500, level: 25, streak: 45, rank: 1 },
    { name: 'سارة يوسف مندور', xp: 11200, level: 22, streak: 30, rank: 2 },
    { name: 'مصطفى كمال الدين', xp: 10800, level: 21, streak: 12, rank: 3 },
    { name: 'إيمان علي رضوان', xp: 9500, level: 19, streak: 8, rank: 4 },
    { name: 'محمد حامد شريف', xp: 8200, level: 16, streak: 20, rank: 5 },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-main py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-6 ns-animate--fade-in-up">
           <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/20 text-brand-gold font-black uppercase tracking-widest text-[10px]">
              <Trophy size={14} fill="currentColor" className="animate-pulse" /> قاعة المشاهير
           </div>
           <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
             فرسان <span className="text-brand-gold">نيرسي</span>
           </h1>
           <p className="text-brand-muted text-lg font-medium max-w-2xl mx-auto">
             المنافسة مش بس على الدرجات، المنافسة على الالتزام والاستمرار. كل محاضرة بتسمعها بتقربك من القمة.
           </p>
        </div>

        {/* Podium Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 items-end">
          {/* Second Place */}
          <div className="bg-brand-card/40 border border-white/5 p-8 rounded-[3rem] text-center space-y-4 order-2 md:order-1 h-64 flex flex-col justify-center relative ns-animate--fade-in-up" style={{animationDelay: '0.2s'}}>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-400 rounded-2xl flex items-center justify-center text-brand-main shadow-lg">
                <Medal size={24} />
             </div>
             <p className="text-white font-black text-lg">{topStudents[1].name.split(' ')[0]}</p>
             <p className="text-brand-gold font-black text-2xl">{topStudents[1].xp} XP</p>
          </div>

          {/* First Place */}
          <div className="bg-brand-card border-2 border-brand-gold p-10 rounded-[4rem] text-center space-y-6 order-1 md:order-2 h-80 flex flex-col justify-center relative shadow-glow ns-animate--fade-in-up" style={{animationDelay: '0.1s'}}>
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-gold rounded-3xl flex items-center justify-center text-brand-main shadow-glow animate-bounce-slow">
                <Crown size={44} />
             </div>
             <p className="text-white font-black text-2xl">{topStudents[0].name}</p>
             <div className="space-y-1">
                <p className="text-brand-gold font-black text-4xl">{topStudents[0].xp}</p>
                <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest">نقطة خبرة</p>
             </div>
          </div>

          {/* Third Place */}
          <div className="bg-brand-card/40 border border-white/5 p-8 rounded-[3rem] text-center space-y-4 order-3 md:order-3 h-56 flex flex-col justify-center relative ns-animate--fade-in-up" style={{animationDelay: '0.3s'}}>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-700 rounded-2xl flex items-center justify-center text-brand-main shadow-lg">
                <Medal size={24} />
             </div>
             <p className="text-white font-black text-lg">{topStudents[2].name.split(' ')[0]}</p>
             <p className="text-brand-gold font-black text-2xl">{topStudents[2].xp} XP</p>
          </div>
        </div>

        {/* Full List */}
        <div className="bg-brand-card rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl ns-animate--fade-in-up">
           <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                 <Star className="text-brand-gold" size={20} /> بقية المتصدرين
              </h3>
              <span className="text-[10px] text-brand-muted font-black uppercase tracking-widest">تحديث مباشر</span>
           </div>
           
           <div className="divide-y divide-white/5">
              {topStudents.slice(3).map((s, idx) => (
                <div key={idx} className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                   <div className="flex items-center gap-6">
                      <div className="text-brand-muted font-black text-xl w-8 italic">#{s.rank}</div>
                      <div>
                         <p className="text-white font-black text-lg group-hover:text-brand-gold transition-colors">{s.name}</p>
                         <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">المستوى {s.level}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-center hidden sm:block">
                         <p className="text-orange-500 font-black text-sm flex items-center gap-1">
                           {s.streak} <Flame size={14} fill="currentColor" />
                         </p>
                         <p className="text-[8px] text-brand-muted font-bold uppercase">متواصل</p>
                      </div>
                      <div className="bg-brand-gold/10 px-6 py-2 rounded-xl border border-brand-gold/20 text-brand-gold font-black text-lg">
                        {s.xp} XP
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Your Personal Rank Card */}
        <div className="bg-brand-gold text-brand-main p-8 md:p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-glow ns-animate--fade-in-up">
           <div className="flex items-center gap-6 text-center md:text-right">
              <div className="w-20 h-20 bg-brand-main text-brand-gold rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-inner">
                {user.xp ? '142' : '--'}
              </div>
              <div>
                <h4 className="text-2xl font-black">ترتيبك بين جميع الطلاب</h4>
                <p className="text-brand-main/70 font-bold uppercase text-xs tracking-widest">أنت الآن في أعلى 15% من الطلاب هذا الشهر</p>
              </div>
           </div>
           <button className="bg-brand-main text-brand-gold px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all">
              <Sparkles size={24} /> كيف أحصل على نقاط؟
           </button>
        </div>
      </div>
    </div>
  );
};
