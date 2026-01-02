
import React, { useState } from 'react';
import { Quiz, Question } from '../types';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, RefreshCw, Trophy, HelpCircle } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentStep];

  const handleSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: optionIndex });
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) correctCount++;
    });
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResult(true);
    onComplete(calculateScore());
  };

  if (showResult) {
    const score = calculateScore();
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-8 animate-scale-up">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-glow ${score >= 50 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          <Trophy size={64} />
        </div>
        <div>
          <h3 className="text-4xl font-black text-white mb-2">نتيجة الاختبار</h3>
          <p className="text-6xl font-black text-brand-gold">{score}%</p>
        </div>
        <div className="w-full max-w-md space-y-4">
          <button onClick={onClose} className="w-full bg-brand-gold text-brand-main font-black py-5 rounded-2xl shadow-glow">العودة للدرس</button>
          <button onClick={() => { setShowResult(false); setIsSubmitted(false); setSelectedAnswers({}); setCurrentStep(0); }} className="w-full bg-white/5 text-white font-bold py-5 rounded-2xl border border-white/10">إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black text-brand-muted uppercase tracking-widest">
          <span>السؤال {currentStep + 1} من {quiz.questions.length}</span>
          <span>{Math.round(((currentStep + 1) / quiz.questions.length) * 100)}% اكتمل</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-brand-gold transition-all duration-500" style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-6">
        <h3 className="text-xl md:text-2xl font-black text-white leading-relaxed">{currentQuestion.text}</h3>
        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-right p-5 rounded-2xl border-2 transition-all flex items-center justify-between group
                ${selectedAnswers[currentStep] === idx 
                  ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' 
                  : 'bg-white/5 border-transparent text-brand-muted hover:border-white/10 hover:text-white'
                }`}
            >
              <span className="font-bold">{option}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedAnswers[currentStep] === idx ? 'border-brand-gold bg-brand-gold text-brand-main' : 'border-white/10'}`}>
                {selectedAnswers[currentStep] === idx && <CheckCircle2 size={14} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-6">
        <button 
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="flex-1 bg-white/5 text-white font-bold py-4 rounded-xl border border-white/10 disabled:opacity-20 flex items-center justify-center gap-2"
        >
          <ArrowRight size={18} /> السابق
        </button>
        {currentStep === quiz.questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={selectedAnswers[currentStep] === undefined}
            className="flex-[2] bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow disabled:opacity-50"
          >
            إنهاء الاختبار
          </button>
        ) : (
          <button 
            onClick={() => setCurrentStep(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            disabled={selectedAnswers[currentStep] === undefined}
            className="flex-[2] bg-brand-gold text-brand-main font-black py-4 rounded-xl shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            التالي <ArrowLeft size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
