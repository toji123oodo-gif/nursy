
import React, { useState, useMemo } from 'react';
import { Brain, ArrowRight, ArrowLeft, Trophy, Sparkles, Flame, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FlashcardItem } from '../components/flashcards/FlashcardItem';

export const Flashcards: React.FC = () => {
  const { user, updateUserData } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Mock Flashcards Data - In real app, these would come from the Course/Lesson
  const deck = [
    { id: '1', front: 'Anatomy', back: 'علم التشريح: هو العلم الذي يدرس بنية أعضاء الجسم المختلفة.' },
    { id: '2', front: 'Physiology', back: 'علم وظائف الأعضاء: يدرس كيفية عمل أعضاء الجسم وأجهزته.' },
    { id: '3', front: 'Tachycardia', back: 'تسارع ضربات القلب: زيادة عدد النبضات عن 100 نبضة في الدقيقة.' },
    { id: '4', front: 'Hypertension', back: 'ارتفاع ضغط الدم: حالة يكون فيها ضغط الدم باستمرار أعلى من المعدل الطبيعي.' },
    { id: '5', front: 'Cyanosis', back: 'الزرقة: تغير لون الجلد للأزرق نتيجة نقص الأكسجين في الدم.' },
  ];

  const progress = Math.round((currentIndex / deck.length) * 100);

  const handleRate = (rating: 'easy' | 'hard') => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      if (user) updateUserData({ xp: (user.xp || 0) + 100 });
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-brand-main flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-brand-card rounded-[3.5rem] p-12 text-center border border-brand-gold/20 shadow-glow animate-scale-up">
           <div className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
              <Trophy size={48} className="text-brand-main" />
           </div>
           <h2 className="text-4xl font-black text-white mb-4">وحش المراجعة!</h2>
           <p className="text-brand-muted text-lg mb-8 font-medium">أنهيت مراجعة 5 مصطلحات هامة اليوم. حصلت على <span className="text-brand-gold">+100 XP</span></p>
           <button 
            onClick={() => { setIsFinished(false); setCurrentIndex(0); }}
            className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl text-xl shadow-glow hover:scale-105 transition-all"
           >
            مراجعة مرة أخرى
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-main py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 ns-animate--fade-in-up">
           <div className="text-center md:text-right">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter">الكروت الذكية <span className="text-brand-gold">Flashcards</span></h1>
              <p className="text-brand-muted text-sm font-bold">أذكى وسيلة لحفظ المصطلحات الطبية الصعبة.</p>
           </div>
           <div className="flex items-center gap-4 bg-brand-card border border-white/5 px-6 py-3 rounded-2xl">
              <Flame size={20} className="text-orange-500 animate-pulse" />
              <div className="text-right">
                 <p className="text-[9px] text-brand-muted font-black uppercase">إنجاز اليوم</p>
                 <p className="text-white font-black text-sm">{currentIndex} / {deck.length}</p>
              </div>
           </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
           <div className="h-full bg-brand-gold shadow-glow transition-all duration-700" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Card Area */}
        <div className="ns-animate--fade-in-up" style={{ animationDelay: '0.2s' }}>
          <FlashcardItem card={deck[currentIndex]} onRate={handleRate} />
        </div>

        {/* Tips */}
        <div className="bg-brand-card/30 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 ns-animate--fade-in-up" style={{ animationDelay: '0.4s' }}>
           <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center shrink-0">
             <Info size={24} />
           </div>
           <p className="text-brand-muted text-[11px] font-bold leading-relaxed">
             <span className="text-white">نصيحة نيرسي:</span> لا تحاول حفظ الكارت بالكلمة، افهم المعنى العام وحاول استحضاره في عقلك قبل قلب الكارت. التكرار المتباعد هو سر التفوق.
           </p>
        </div>
      </div>
    </div>
  );
};
