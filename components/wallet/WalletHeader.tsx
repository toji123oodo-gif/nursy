
import React from 'react';
import { Crown, Clock, Zap, AlertCircle } from 'lucide-react';

interface Props {
  isPro: boolean;
  daysLeft: number;
  expiryDate?: string;
}

export const WalletHeader: React.FC<Props> = ({ isPro, daysLeft, expiryDate }) => {
  return (
    <div className="bg-brand-card rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden ns-animate--fade-in-up">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] animate-pulse"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <div className="space-y-6 text-center md:text-right">
          <div className="inline-flex items-center gap-3 bg-brand-gold/10 px-6 py-2 rounded-full border border-brand-gold/20 text-brand-gold font-black uppercase tracking-widest text-[10px]">
            <Crown size={14} fill="currentColor" /> حالة الحساب الحالية
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
            إشتراك <span className="text-brand-gold">{isPro ? 'البريميوم' : 'مجاني'}</span>
          </h2>
          <p className="text-brand-muted text-lg font-medium max-w-md">
            {isPro 
              ? `اشتراكك ينتهي في ${new Date(expiryDate!).toLocaleDateString('ar-EG')}. استمتع بكل المزايا.` 
              : 'قم بتفعيل العضوية الذهبية لتتمكن من الوصول لكافة المحاضرات والمذكرات.'}
          </p>
        </div>

        <div className="bg-brand-main/40 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] flex flex-col items-center justify-center min-w-[280px] shadow-inner group">
           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${isPro ? 'bg-green-500/20 text-green-500 shadow-glow-green' : 'bg-brand-gold/20 text-brand-gold shadow-glow'}`}>
              {isPro ? <Zap size={40} fill="currentColor" /> : <AlertCircle size={40} />}
           </div>
           <p className="text-white font-black text-4xl mb-2">{isPro ? daysLeft : 0}</p>
           <p className="text-brand-muted text-[10px] font-black uppercase tracking-[0.2em]">يوماً متبقياً</p>
        </div>
      </div>
    </div>
  );
};
