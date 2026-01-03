
import React from 'react';
import { Trophy, Flame, Target, ChevronLeft, Sparkles } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

interface Props {
  xp: number;
  rank: number;
  streak: number;
}

export const LeaderboardWidget: React.FC<Props> = ({ xp, rank, streak }) => {
  return (
    <div className="ns-card p-8 bg-gradient-to-br from-brand-card to-brand-main border-brand-gold/20 shadow-glow/5 relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center">
            <Trophy size={20} />
          </div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest">ترتيبك الحالي</h4>
        </div>
        <Link to="/leaderboard" className="text-[10px] text-brand-gold font-black flex items-center gap-1 hover:translate-x-[-4px] transition-transform uppercase">
          كل المتصدرين <ChevronLeft size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
           <p className="text-[9px] text-brand-muted font-black uppercase mb-1">الترتيب</p>
           <p className="text-2xl font-black text-white">#{rank}</p>
        </div>
        <div className="text-center p-4 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
           <p className="text-[9px] text-brand-gold font-black uppercase mb-1">النقاط</p>
           <p className="text-2xl font-black text-brand-gold">{xp}</p>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
           <p className="text-[9px] text-brand-muted font-black uppercase mb-1">أيام</p>
           <p className="text-2xl font-black text-orange-500 flex items-center justify-center gap-1">
             {streak} <Flame size={16} fill="currentColor" />
           </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
         <div className="flex justify-between items-center text-[9px] font-black text-brand-muted uppercase tracking-widest mb-3">
           <span>المستوى {Math.floor(xp / 500) + 1}</span>
           <span>باقي {(500 - (xp % 500))} XP للمستوى التالي</span>
         </div>
         <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-brand-gold shadow-glow transition-all duration-1000" 
              style={{ width: `${(xp % 500) / 5}%` }}
            ></div>
         </div>
      </div>
    </div>
  );
};
