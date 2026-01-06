
import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { Flashcard } from '../../types';

interface Props {
  card: Flashcard;
  onRate: (rating: 'easy' | 'hard') => void;
}

export const FlashcardItem: React.FC<Props> = ({ card, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto h-[400px] perspective-1000 group">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face (Question) */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden">
          {/* Subtle Texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
          
          {/* Corner Decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-orange-50/0 dark:from-orange-900/20 dark:to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="relative z-10 w-full h-full flex flex-col p-8">
             <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-[#2C2C2C] px-3 py-1 rounded-full">
                   السؤال / المصطلح
                </span>
                {card.hint && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }}
                      className="p-2 text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded-full transition-colors relative z-20"
                      title="عرض تلميح"
                    >
                       <Lightbulb size={18} fill={showHint ? "currentColor" : "none"} />
                    </button>
                )}
             </div>

             <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                    {card.front}
                </h3>
                {showHint && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl text-sm text-yellow-700 dark:text-yellow-400 font-medium animate-in fade-in slide-in-from-top-2 max-w-sm">
                        💡 تلميح: {card.hint}
                    </div>
                )}
             </div>

             <div className="text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 animate-pulse">
                   اضغط للقلب <RotateCcw size={12}/>
                </p>
             </div>
          </div>
        </div>

        {/* Back Face (Answer) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl shadow-2xl overflow-hidden border border-[#333]">
          {/* Dark Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#232323] to-[#0a0a0a]"></div>
          {/* Orange Glow */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F38020] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

          <div className="relative z-10 w-full h-full flex flex-col p-8 text-white">
             <div className="flex justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full">
                   الإجابة / التعريف
                </span>
             </div>

             <div className="flex-1 flex items-center justify-center text-center">
                <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-gray-100">
                    {card.back}
                </h3>
             </div>
             
             {/* Rating Buttons - Stop Propagation to prevent flipping back immediately */}
             <div className="grid grid-cols-2 gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => onRate('hard')}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-red-400 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <XCircle size={18} /> مراجعة
                </button>
                <button 
                  onClick={() => onRate('easy')}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#F38020] hover:bg-[#d66e16] text-white font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 size={18} /> أتقنته
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
