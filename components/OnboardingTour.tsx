
import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Sparkles, GraduationCap, 
  Wallet, Key, PlayCircle, ShieldCheck, CheckCircle2, 
  Smartphone, MessageCircle, Brain, BookOpen, Flame, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingTour: React.FC = () => {
  const { user } = useApp();
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user && !user.quizGrades && !user.completedLessons?.length && !user.subscriptionTier.includes('pro')) {
       const hasSeenTour = localStorage.getItem(`tour_done_${user.id}`);
       if (!hasSeenTour) {
         const timer = setTimeout(() => setIsVisible(true), 1000);
         return () => clearTimeout(timer);
       }
    }
  }, [user]);

  const steps = [
    {
      title: "أهلاً بك في عائلة نيرسي!",
      desc: "مبروك! أنت الآن جزء من أكبر تجمع لطلاب التمريض في مصر. رحلتك نحو الامتياز تبدأ من هذه اللحظة.",
      icon: <GraduationCap size={64} className="text-brand-gold" />,
      tag: "البداية القوية",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "منهجك بين يديك",
      desc: "هتلاقي كل المواد الأكاديمية (تشريح، فسيولوجي، تمريض بالغين..) متقسمة ومنظمة. ابدأ بالمحاضرات المجانية وجرب جودة الشرح بنفسك.",
      icon: <BookOpen size={64} className="text-brand-gold" />,
      tag: "المحتوى الأكاديمي",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "تفعيل اشتراك الـ PRO",
      desc: "عشان تفتح كل المحاضرات وتحمل الملازم، فعل حسابك عبر (فودافون كاش) أو (انستا باي) بلمسة واحدة من صفحة المحفظة.",
      icon: <Wallet size={64} className="text-brand-gold" />,
      tag: "عالم المميزات",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "مذاكرة ذكية وآمنة",
      desc: "استمتع باختبارات ذكية بعد كل درس، ومتابعة دقيقة لمستواك، مع نظام حماية يحافظ على خصوصية حسابك وتفوقك.",
      icon: <ShieldCheck size={64} className="text-brand-gold" />,
      tag: "الذكاء التعليمي",
      image: "https://images.unsplash.com/photo-15887025902cf-25a81205387c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const handleComplete = () => {
    if (user) localStorage.setItem(`tour_done_${user.id}`, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-[#020817]/95 backdrop-blur-3xl animate-fade-in"></div>
      
      <div className="relative w-full max-w-5xl bg-[#0d1b32] border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[650px] animate-scale-up">
        
        {/* Visual Side */}
        <div className="md:w-5/12 relative overflow-hidden hidden md:block border-l border-white/5">
           <img src={steps[step].image} className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-[2000ms]" alt="onboarding" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b32] via-transparent to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d1b32]"></div>
           
           <div className="absolute bottom-12 right-10 left-10">
              <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-brand-gold/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-glow animate-float">
                      {steps[step].icon}
                  </div>
                  <div className="px-6 py-2 bg-brand-gold text-brand-main rounded-full font-black text-[10px] uppercase tracking-widest shadow-glow">
                      {steps[step].tag}
                  </div>
              </div>
           </div>
        </div>

        {/* Content Side */}
        <div className="flex-1 p-10 md:p-20 flex flex-col justify-between bg-gradient-to-br from-[#0d1b32] to-[#0a1526]">
           <div className="flex justify-between items-center">
              <div className="flex gap-2">
                 {steps.map((_, i) => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === step ? 'w-12 bg-brand-gold shadow-glow' : 'w-3 bg-white/10'}`}></div>
                 ))}
              </div>
              <button onClick={handleComplete} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-muted hover:text-white transition-all border border-white/5">
                <X size={24}/>
              </button>
           </div>

           <div className="flex-1 flex flex-col justify-center space-y-10 py-10 animate-fade-in-up">
              <div className="md:hidden flex justify-center mb-4">
                 <div className="p-6 bg-brand-gold/10 rounded-[2rem] text-brand-gold border border-brand-gold/20">
                    {steps[step].icon}
                 </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter text-center md:text-right drop-shadow-lg">
                {steps[step].title}
              </h2>
              <p className="text-brand-muted text-xl md:text-2xl leading-relaxed text-center md:text-right font-medium max-w-2xl">
                {steps[step].desc}
              </p>
           </div>

           <div className="flex gap-6">
              {step < steps.length - 1 ? (
                <button 
                  onClick={() => setStep(prev => prev + 1)}
                  className="flex-1 bg-brand-gold text-brand-main font-black py-6 rounded-[2.2rem] shadow-glow hover:scale-[1.03] transition-all text-2xl flex items-center justify-center gap-4 group"
                >
                   الخطوة التالية <ChevronLeft size={28} className="group-hover:-translate-x-2 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={handleComplete}
                  className="flex-1 bg-brand-gold text-brand-main font-black py-6 rounded-[2.2rem] shadow-glow hover:scale-[1.03] transition-all text-2xl flex items-center justify-center gap-4"
                >
                   ابدأ رحلة النجاح <Star size={28} fill="currentColor" />
                </button>
              )}
              
              {step > 0 && (
                <button 
                  onClick={() => setStep(prev => prev - 1)}
                  className="px-10 bg-white/5 text-white font-black py-6 rounded-[2.2rem] border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  <ChevronRight size={28} />
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
