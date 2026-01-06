
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { FlashcardItem } from './FlashcardItem';
import { Flashcard } from '../../types';

interface Props {
  cards: Flashcard[];
  onComplete?: (score: { easy: number; hard: number }) => void;
  onExit?: () => void;
}

export const FlashcardDeck: React.FC<Props> = ({ cards, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ easy: 0, hard: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRate = (rating: 'easy' | 'hard') => {
    const newScore = { ...score, [rating]: score[rating] + 1 };
    setScore(newScore);
    
    if (currentIndex < cards.length - 1) {
        setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    } else {
        setIsCompleted(true);
        if (onComplete) onComplete(newScore);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore({ easy: 0, hard: 0 });
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-300">
         <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/10 border-4 border-white dark:border-[#2C2C2C]">
            <Award size={48} className="text-green-600 dark:text-green-400" />
         </div>
         <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">جلسة مكتملة!</h2>
         <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">راجعت {cards.length} مصطلحات</p>
         
         <div className="flex gap-4 w-full max-w-sm">
            <button 
              onClick={onExit} 
              className="flex-1 btn-secondary py-3 text-sm font-bold"
            >
              إنهاء
            </button>
            <button 
              onClick={handleRetry} 
              className="flex-1 btn-primary py-3 text-sm font-bold shadow-lg shadow-orange-500/20"
            >
              مراجعة مرة أخرى
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 py-4">
       {/* Header */}
       <div className="flex items-center justify-between px-2">
          <div className="text-right">
             <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                بطاقة {currentIndex + 1} من {cards.length}
             </h2>
             <p className="text-xs text-gray-500">وضع المراجعة</p>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="h-1.5 bg-gray-200 dark:bg-[#333] rounded-full overflow-hidden w-full">
          <div 
            className="h-full bg-[#F38020] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(243,128,32,0.5)]" 
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          ></div>
       </div>

       {/* Flashcard Component */}
       <div className="relative">
           {cards[currentIndex] && (
               <FlashcardItem 
                    key={cards[currentIndex].id} // Key ensures remount on change for animation reset
                    card={cards[currentIndex]} 
                    onRate={handleRate}
               />
           )}
       </div>

       {/* Manual Controls */}
       <div className="flex justify-center items-center gap-6 opacity-50 hover:opacity-100 transition-opacity">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2C2C2C] disabled:opacity-30 transition-colors"
          >
             <ChevronLeft size={24} className="dark:text-white"/>
          </button>
          <span className="text-xs font-mono text-gray-400">NAVIGATE</span>
          <button 
            disabled={currentIndex === cards.length - 1}
            onClick={() => setCurrentIndex(p => Math.min(cards.length - 1, p + 1))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2C2C2C] disabled:opacity-30 transition-colors"
          >
             <ChevronRight size={24} className="dark:text-white"/>
          </button>
       </div>
    </div>
  );
};
