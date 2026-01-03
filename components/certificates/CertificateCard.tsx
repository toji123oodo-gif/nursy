
import React from 'react';
import { Award, Download, Lock, CheckCircle, Share2, Sparkles } from 'lucide-react';

interface Props {
  courseTitle: string;
  isUnlocked: boolean;
  completionDate?: string;
  onPreview: () => void;
}

export const CertificateCard: React.FC<Props> = ({ courseTitle, isUnlocked, completionDate, onPreview }) => {
  return (
    <div className={`relative group rounded-[3rem] p-8 border-2 transition-all duration-700 overflow-hidden ${
      isUnlocked 
      ? 'bg-brand-card border-brand-gold/30 shadow-glow hover:scale-[1.02]' 
      : 'bg-brand-card/40 border-white/5 opacity-60 grayscale'
    }`}>
      {isUnlocked && (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/10 blur-3xl rounded-full group-hover:bg-brand-gold/20 transition-all"></div>
      )}
      
      <div className="flex flex-col h-full space-y-6 relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          isUnlocked ? 'bg-brand-gold text-brand-main shadow-glow' : 'bg-white/5 text-brand-muted'
        }`}>
          {isUnlocked ? <Award size={32} /> : <Lock size={32} />}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-black text-white mb-2 leading-tight">{courseTitle}</h3>
          <p className="text-[10px] text-brand-muted font-black uppercase tracking-widest">
            {isUnlocked ? `تم الإنجاز في ${completionDate}` : 'أكمل الكورس بنسبة 100% للحصول عليها'}
          </p>
        </div>

        {isUnlocked ? (
          <div className="flex gap-3">
            <button 
              onClick={onPreview}
              className="flex-1 bg-brand-gold text-brand-main font-black py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow hover:brightness-110 transition-all"
            >
              <Sparkles size={14} /> عرض الشهادة
            </button>
            <button className="p-4 bg-white/5 text-brand-gold rounded-xl hover:bg-brand-gold hover:text-brand-main transition-all border border-white/5">
              <Download size={18} />
            </button>
          </div>
        ) : (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-brand-gold/20 w-1/3"></div>
          </div>
        )}
      </div>
    </div>
  );
};
