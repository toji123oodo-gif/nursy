
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Check, X, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';

export const Flashcards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Mock Data
  const deck = [
    { id: '1', front: 'Tachycardia', back: 'Heart rate > 100 bpm' },
    { id: '2', front: 'Bradycardia', back: 'Heart rate < 60 bpm' },
    { id: '3', front: 'Hypertension', back: 'High blood pressure consistently > 130/80' },
  ];

  const handleNext = () => {
     setIsFlipped(false);
     setTimeout(() => setCurrentIndex(prev => (prev + 1) % deck.length), 200);
  };

  const handlePrev = () => {
     setIsFlipped(false);
     setTimeout(() => setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length), 200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
       <div className="text-center">
          <h1 className="text-xl font-bold text-main">Medical Terminology Deck</h1>
          <p className="text-xs text-muted mt-1">{currentIndex + 1} / {deck.length} cards</p>
       </div>

       {/* Progress Bar */}
       <div className="h-1 bg-gray-200 dark:bg-[#333] rounded-full overflow-hidden">
          <div className="h-full bg-[#F38020] transition-all duration-300" style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}></div>
       </div>

       {/* Flashcard Area */}
       <div className="perspective-1000 h-80 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
             
             {/* Front */}
             <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333] rounded-lg shadow-sm flex flex-col items-center justify-center p-8 hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Term</span>
                <h2 className="text-4xl font-bold text-main">{deck[currentIndex].front}</h2>
                <p className="absolute bottom-4 text-xs text-muted">Click to flip</p>
             </div>

             {/* Back */}
             <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FAFAFA] dark:bg-[#252525] border border-[#E5E5E5] dark:border-[#333] rounded-lg shadow-sm flex flex-col items-center justify-center p-8">
                <span className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Definition</span>
                <h2 className="text-2xl font-medium text-main text-center leading-relaxed">{deck[currentIndex].back}</h2>
             </div>

          </div>
       </div>

       {/* Controls */}
       <div className="flex justify-center items-center gap-6">
          <button onClick={handlePrev} className="p-3 rounded-full border border-[#E5E5E5] dark:border-[#333] text-main hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
             <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-6 py-2 rounded-[4px] border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium">
                <X size={16} /> Hard
             </button>
             <button className="flex items-center gap-2 px-6 py-2 rounded-[4px] border border-green-200 text-green-600 hover:bg-green-50 text-sm font-medium">
                <Check size={16} /> Easy
             </button>
          </div>

          <button onClick={handleNext} className="p-3 rounded-full border border-[#E5E5E5] dark:border-[#333] text-main hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors">
             <ChevronRight size={20} />
          </button>
       </div>
    </div>
  );
};
