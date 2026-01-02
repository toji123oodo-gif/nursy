
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  X, ChevronLeft, Sparkles, Target, ArrowDown
} from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  path?: string;
}

export const NursyGuideBot: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightStyles, setSpotlightStyles] = useState<React.CSSProperties>({});
  const [botPosition, setBotPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const location = useLocation();
  const navigate = useNavigate();

  const tourSteps: TourStep[] = [
    {
      targetId: 'nav-logo',
      title: "أهلاً بيك في نيرسي!",
      message: "أنا المساعد بتاعك وهعرفك كل خرم إبرة في الموقع عشان متتوهش. ده اللوجو بتاعنا، منه تقدر ترجع للرئيسية في أي وقت.",
      position: 'bottom',
      path: '/'
    },
    {
      targetId: 'subject-filters',
      title: "فلتر المواد",
      message: "هنا بقى السر! دوس على المادة اللي عايز تذاكرها، وهنطلعلك كل الكورسات المتاحة ليها فوراً.",
      position: 'bottom',
      path: '/'
    },
    {
      targetId: 'nav-wallet',
      title: "المحفظة والاشتراك",
      message: "أهم حتة! هنا هتعرف إزاي تشترك وتفتح المحاضرات المقفولة سواء بـ (فودافون كاش) أو (أكواد السناتر).",
      position: 'bottom',
      path: '/'
    },
    {
      targetId: 'nav-exams',
      title: "جدول امتحاناتك",
      message: "مش هنسيبك تتفاجئ بالامتحانات.. هنا جدول مواعيدك بالدقيقة والمكان عشان تلم المنهج قبلها.",
      position: 'bottom',
      path: '/'
    },
    {
      targetId: 'nav-profile',
      title: "بروفايلك الشخصي",
      message: "هنا هتلاقي درجاتك في الاختبارات، ونسبة إنجازك في كل مادة.. يعني مرايتك في المذاكرة.",
      position: 'bottom',
      path: '/'
    }
  ];

  const updateSpotlight = () => {
    const step = tourSteps[currentStep];
    const element = document.getElementById(step.targetId);

    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = 10;

      setSpotlightStyles({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius: '1rem'
      });

      let bTop = rect.bottom + 20;
      let bLeft = rect.left + rect.width / 2 - 150;

      if (step.position === 'top') bTop = rect.top - 250;
      
      setBotPosition({ 
        top: Math.min(bTop, window.innerHeight - 350), 
        left: Math.max(20, Math.min(bLeft, window.innerWidth - 340)) 
      });
      
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (isActive) {
      const step = tourSteps[currentStep];
      if (step.path && location.pathname !== step.path) {
        navigate(step.path);
      } else {
        // تأخير بسيط للتأكد من رندر الصفحة
        const timer = setTimeout(updateSpotlight, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isActive, currentStep, location.pathname]);

  useEffect(() => {
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [isActive, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsActive(false);
      localStorage.setItem('nursy_tour_done', 'true');
    }
  };

  if (!isActive) {
    return (
      <button 
        onClick={() => { setIsActive(true); setCurrentStep(0); }}
        className="fixed bottom-6 right-6 z-[2000] group flex items-center gap-4"
      >
        <div className="bg-brand-gold text-brand-main px-6 py-3 rounded-2xl font-black text-xs shadow-glow opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          مش عارف تعمل إيه؟ دوس هنا!
        </div>
        <div className="w-16 h-16 bg-brand-card border-2 border-brand-gold rounded-3xl flex items-center justify-center shadow-glow animate-float">
           <div className="flex flex-col items-center gap-1">
              <div className="flex gap-2">
                 <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                 <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
              </div>
              <div className="w-6 h-1 bg-brand-gold/30 rounded-full"></div>
           </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[3000] overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 bg-brand-main/85 backdrop-blur-sm transition-all duration-500"
        style={{
          clipPath: spotlightStyles.top !== undefined ? `polygon(
            0% 0%, 
            0% 100%, 
            ${spotlightStyles.left}px 100%, 
            ${spotlightStyles.left}px ${spotlightStyles.top}px, 
            ${(spotlightStyles.left as number) + (spotlightStyles.width as number)}px ${spotlightStyles.top}px, 
            ${(spotlightStyles.left as number) + (spotlightStyles.width as number)}px ${(spotlightStyles.top as number) + (spotlightStyles.height as number)}px, 
            ${spotlightStyles.left}px ${(spotlightStyles.top as number) + (spotlightStyles.height as number)}px, 
            ${spotlightStyles.left}px 100%, 
            100% 100%, 
            100% 0%
          )` : 'none'
        }}
      ></div>

      <div 
        className="absolute border-2 border-brand-gold shadow-glow transition-all duration-500 pointer-events-none animate-pulse"
        style={spotlightStyles}
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-brand-gold font-black text-[10px] whitespace-nowrap bg-brand-main/80 px-4 py-1.5 rounded-full border border-brand-gold/30">
          بص هنا يا دكتور
        </div>
      </div>

      <div 
        className="absolute w-72 md:w-80 transition-all duration-700 pointer-events-auto"
        style={{ top: botPosition.top, left: botPosition.left }}
      >
         <div className="bg-brand-card border border-brand-gold/30 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-brand-gold p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <Sparkles size={14} className="text-brand-main animate-pulse" />
                 <span className="text-brand-main font-black text-[10px]">مساعد نيرسي الذكي</span>
              </div>
              <button onClick={() => setIsActive(false)} className="text-brand-main/50 hover:text-brand-main">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
               <h4 className="text-white font-black text-lg leading-tight">{tourSteps[currentStep].title}</h4>
               <p className="text-brand-muted text-xs leading-relaxed font-bold italic">
                 "{tourSteps[currentStep].message}"
               </p>
               
               <div className="pt-2 flex justify-between items-center">
                  <div className="flex gap-1">
                     {tourSteps.map((_, i) => (
                       <div key={i} className={`h-1 rounded-full transition-all ${i === currentStep ? 'w-4 bg-brand-gold' : 'w-1 bg-white/10'}`}></div>
                     ))}
                  </div>
                  <button 
                    onClick={handleNext}
                    className="bg-brand-gold text-brand-main px-4 py-2 rounded-xl font-black text-[10px] hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {currentStep < tourSteps.length - 1 ? 'ماشي.. كمل' : 'تمام يا وحش'} 
                    <ChevronLeft size={14} />
                  </button>
               </div>
            </div>
         </div>
         
         <div className="mt-4 flex justify-center animate-float">
            <div className="w-14 h-14 bg-brand-card border-2 border-brand-gold rounded-2xl flex items-center justify-center shadow-glow">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full"></div>
                  </div>
                  <div className="w-4 h-0.5 bg-brand-gold/40 rounded-full"></div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
