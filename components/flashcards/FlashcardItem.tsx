
import React, { useState } from 'react';
import { RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  card: {
    front: string;
    back: string;
    hint?: string;
  };
  onRate: (rating: 'easy' | 'hard') => void;
}

export const FlashcardItem: React.FC<Props> = ({ card, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto h-[400px] perspective-1000 group">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-brand-card border-2 border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-brand-gold/30 transition-all">
          <div className="absolute top-8 right-8 text-brand-gold/20"><HelpCircle size={40} /></div>
          <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6">المصطلح الطبي</span>
          <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">{card.front}</h3>
          <p className="mt-10 text-brand-muted text-xs font-bold animate-pulse">إضغط لعرض الترجمة والشرح</p>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-brand-gold rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-glow">
          <div className="absolute top-8 right-8 text-brand-main/20"><RotateCcw size={40} /></div>
          <span className="text-brand-main/60 text-[10px] font-black uppercase tracking-[0.4em] mb-6">الشرح والترجمة</span>
          <h3 className="text-3xl md:text-4xl font-black text-brand-main leading-tight mb-8">{card.back}</h3>
          
          <div className="flex gap-4 w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => onRate('hard')}
              className="flex-1 bg-brand-main/10 border border-brand-main/20 text-brand-main font-black py-4 rounded-2xl hover:bg-brand-main/20 transition-all text-xs"
            >
              لسه محتاج مراجعة
            </button>
            <button 
              onClick={() => onRate('easy')}
              className="flex-1 bg-brand-main text-brand-gold font-black py-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> عرفتها خلاص
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
