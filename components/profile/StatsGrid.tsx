
import React from 'react';
import { Target, TrendingUp, Flame, ShieldCheck, Award } from 'lucide-react';
import { ProgressRing } from '../ProgressRing';

interface Props {
  progress: number;
}

export const StatsGrid: React.FC<Props> = ({ progress }) => {
  const activityData = [45, 80, 55, 95, 70, 90, 100];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Activity Chart */}
      <div className="lg:col-span-8">
        <div className="ns-card p-10 md:p-14 shadow-2xl h-full relative overflow-hidden">
          <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
             <TrendingUp className="text-brand-gold" /> نشاط المذاكرة الأسبوعي
          </h3>
          <div className="flex items-end justify-between gap-3 h-48 md:h-64 pt-6 px-2">
            {activityData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full max-w-[40px] relative flex flex-col justify-end h-full">
                  <div className="w-full bg-brand-gold/10 rounded-2xl relative overflow-hidden transition-all duration-700 hover:bg-brand-gold/20 cursor-pointer" style={{ height: `${val}%` }}>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-brand-gold/40 to-transparent"></div>
                  </div>
                </div>
                <span className="text-[10px] text-brand-muted font-black uppercase">{['S', 'S', 'M', 'T', 'W', 'T', 'F'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges / Quick Stats */}
      <div className="lg:col-span-4 space-y-8">
         <div className="ns-card p-10 flex flex-col items-center bg-brand-gold/5 border-brand-gold/20">
            <ProgressRing progress={progress} size={150} />
            <div className="text-center mt-6">
                <p className="text-white font-black text-xl flex items-center gap-2 justify-center">الوحش الأكاديمي <Flame size={20} className="text-orange-500 animate-pulse"/></p>
                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mt-1">Academy Streak: 12 Days</p>
            </div>
         </div>
         
         <div className="ns-card p-8 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
               <ShieldCheck className="text-brand-gold mb-2" size={24} />
               <p className="text-white font-black text-xs">طالب موثق</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
               <Target className="text-brand-gold mb-2" size={24} />
               <p className="text-white font-black text-xs">قناص الدرجات</p>
            </div>
         </div>
      </div>
    </div>
  );
};
