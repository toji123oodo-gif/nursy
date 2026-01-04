
import React, { useState } from 'react';
import { RotateCcw, HelpCircle, CheckCircle2, Lightbulb } from 'lucide-react';

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
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="w-full max-w-xl mx-auto h-[450px] perspective-1000 group">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-all overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/10 rounded-bl-[100px] -mr-8 -mt-8 z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-tr-[80px] -ml-6 -mb-6 z-0"></div>

          <div className="relative z-10 w-full flex flex-col items-center h-full justify-between py-4">
             <div className="w-full flex justify-between items-start">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border border-gray-200 dark:border-[#444] px-2 py-1 rounded-md">Term</span>
                {card.hint && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }}
                      className="p-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                      title="Show Hint"
                    >
                       <Lightbulb size={18} fill={showHint ? "currentColor" : "none"} />
                    </button>
                )}
             </div>

             <div className="flex-1 flex flex-col items-center justify-center">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight drop-shadow-sm">
                    {card.front}
                </h3>
                {showHint && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl text-xs text-yellow-700 dark:text-yellow-400 font-medium animate-in fade-in slide-in-from-top-2">
                        💡 Hint: {card.hint}
                    </div>
                )}
             </div>

             <p className="text-gray-400 text-xs font-medium flex items-center gap-2 animate-pulse">
                Click card to flip <RotateCcw size={12}/>
             </p>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#1a1a1a] to-black text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl border border-[#333]">
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F38020] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

          <div className="relative z-10 w-full flex flex-col items-center h-full justify-between py-4">
             <div className="w-full flex justify-end">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest border border-white/10 px-2 py-1 rounded-md">Definition</span>
             </div>

             <div className="flex-1 flex items-center justify-center w-full">
                <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-gray-100">
                    {card.back}
                </h3>
             </div>
             
             <div className="flex gap-3 w-full mt-4" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => onRate('hard')}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-red-400 font-bold py-3.5 rounded-xl transition-all text-xs backdrop-blur-sm"
                >
                  Needs Review
                </button>
                <button 
                  onClick={() => onRate('easy')}
                  className="flex-1 bg-[#F38020] hover:bg-[#d66e16] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> Got it
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
