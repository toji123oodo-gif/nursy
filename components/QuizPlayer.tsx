
import React, { useState } from 'react';
import { Quiz } from '../types';
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, HelpCircle, 
  Timer, Brain, Award, RotateCcw 
} from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quiz.questions[currentStep];

  const handleSelect = (optionIndex: number) => {
    if (showResult) return;
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
    setShowResult(true);
    onComplete(calculateScore());
  };

  if (showResult) {
    const score = calculateScore();
    const passed = score >= (quiz.passingScore || 50);
    
    return (
      <div className="fixed inset-0 z-[1000] bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100 dark:border-[#333] relative overflow-hidden">
           
           {/* Background Glow */}
           <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${passed ? 'bg-green-500' : 'bg-red-500'}`}></div>

           <div className="relative z-10">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white dark:border-[#2C2C2C] ${passed ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                  {passed ? <Award size={40} /> : <RotateCcw size={36} />}
               </div>
               
               <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                   {passed ? 'مبروك! اجتزت الاختبار' : 'للأسف، لم توفق'}
               </h2>
               
               <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                   حصلت على <span className={`font-bold text-lg ${passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{score}%</span>
               </p>
               
               <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 btn-secondary py-3 text-sm font-bold">
                    إغلاق
                  </button>
                  <button 
                    onClick={() => {setShowResult(false); setSelectedAnswers({}); setCurrentStep(0);}} 
                    className="flex-1 btn-primary py-3 text-sm font-bold shadow-lg shadow-orange-500/20"
                  >
                    إعادة المحاولة
                  </button>
               </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F9FAFB] dark:bg-[#0a0a0a] flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="h-20 border-b border-gray-200 dark:border-[#333] flex items-center justify-between px-4 md:px-8 bg-white dark:bg-[#1E1E1E] shadow-sm z-10">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/10 rounded-xl flex items-center justify-center text-[#F38020]">
                 <Brain size={20} />
             </div>
             <div>
                 <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{quiz.title}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono hidden sm:block">ID: {quiz.id.split('-')[1]}</p>
             </div>
         </div>
         
         <div className="flex items-center gap-4">
             {quiz.timeLimit && (
                 <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-[#2C2C2C] px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                     <Timer size={14} className="text-[#F38020]"/> {quiz.timeLimit} دقيقة
                 </div>
             )}
             <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                 <X size={24}/>
             </button>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-200 dark:bg-[#333] w-full">
         <div 
            className="h-full bg-[#F38020] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(243,128,32,0.5)]" 
            style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
         ></div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 overflow-y-auto w-full">
         <div className="w-full max-w-3xl animate-in slide-in-from-bottom-4 fade-in duration-300">
             
             {/* Question Card */}
             <div className="mb-8">
                 <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">
                     سؤال {currentStep + 1} من {quiz.questions.length}
                 </span>
                 <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-relaxed md:leading-relaxed">
                    {currentQuestion.text}
                 </h3>
             </div>

             {/* Options Grid */}
             <div className="grid gap-4">
                {currentQuestion.options.map((opt, idx) => {
                   const isSelected = selectedAnswers[currentStep] === idx;
                   return (
                       <button
                         key={idx}
                         onClick={() => handleSelect(idx)}
                         className={`w-full p-5 md:p-6 rounded-2xl border-2 text-right transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${
                            isSelected 
                            ? 'border-[#F38020] bg-orange-50 dark:bg-orange-900/20 text-[#F38020]' 
                            : 'border-gray-100 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#555] bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md'
                         }`}
                       >
                          <div className="flex items-center gap-4 relative z-10">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                                  isSelected 
                                  ? 'border-[#F38020] bg-[#F38020] text-white' 
                                  : 'border-gray-300 dark:border-gray-600 text-gray-400 group-hover:border-gray-400'
                              }`}>
                                  {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="text-sm md:text-base font-semibold">{opt}</span>
                          </div>
                          
                          {isSelected && (
                              <CheckCircle2 size={24} className="text-[#F38020] animate-in zoom-in spin-in-90 duration-200" fill="currentColor" color="white" />
                          )}
                       </button>
                   );
                })}
             </div>
         </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-[#333] bg-white dark:bg-[#1E1E1E] flex justify-between items-center z-10">
         <button 
           disabled={currentStep === 0}
           onClick={() => setCurrentStep(p => p - 1)}
           className="px-6 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
         >
           <ChevronRight size={20} className="rotate-180 md:rotate-0" /> السابق
         </button>
         
         <div className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest">
            Nursy Educational Platform
         </div>

         {currentStep === quiz.questions.length - 1 ? (
            <button 
                onClick={handleSubmit} 
                className="px-8 py-3 bg-[#F38020] hover:bg-[#d66e16] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95 flex items-center gap-2"
                disabled={selectedAnswers[currentStep] === undefined}
            >
                إنهاء الاختبار <CheckCircle2 size={18} />
            </button>
         ) : (
            <button 
                onClick={() => setCurrentStep(p => p + 1)} 
                className="px-8 py-3 bg-[#1a1a1a] dark:bg-white text-white dark:text-black hover:opacity-90 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95 flex items-center gap-2"
                disabled={selectedAnswers[currentStep] === undefined}
            >
                التالي <ChevronLeft size={20} className="rotate-180 md:rotate-0" />
            </button>
         )}
      </div>
    </div>
  );
};
