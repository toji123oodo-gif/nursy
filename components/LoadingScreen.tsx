
import React, { useEffect, useState } from 'react';
import { GraduationCap, Sparkles, ShieldCheck, Zap, Activity } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const loadingMessages = [
    "جاري تهيئة المنصة التعليمية...",
    "تجهيز المحاضرات والملفات...",
    "تفعيل بروتوكول حماية المحتوى...",
    "مرحباً بك في عالم نيرسي..."
  ];

  useEffect(() => {
    // Total duration: 3000ms (3 seconds)
    // Update every 30ms to reach 100% (100 updates)
    const duration = 3000;
    const intervalTime = 30;
    const increment = 1;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    // Rotate messages every 750ms (3000 / 4 messages)
    const messageInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 750);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-brand-main flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Ambient Background Drops */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-gold/10 blur-[150px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[130px] rounded-full animate-float pointer-events-none" style={{ animationDelay: '1s' }}></div>
      
      {/* Center Content Container */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* Advanced Icon Display */}
        <div className="relative mb-12 animate-scale-up">
          <div className="absolute inset-[-20px] bg-brand-gold/20 blur-3xl animate-pulse rounded-full"></div>
          
          <div className="relative z-10 bg-gradient-to-br from-brand-gold via-yellow-400 to-yellow-600 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] ring-4 ring-white/10 group">
            <GraduationCap className="text-brand-main h-20 w-20 transform group-hover:rotate-12 transition-transform duration-500" strokeWidth={2.5} />
            
            {/* Tiny Floating Particles around Icon */}
            <div className="absolute -top-2 -right-2 bg-brand-main border border-brand-gold/40 p-2.5 rounded-xl text-brand-gold shadow-glow animate-bounce-slow">
              <Sparkles size={22} />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-brand-main border border-brand-gold/20 p-2 rounded-lg text-brand-gold animate-float opacity-50">
              <Activity size={16} />
            </div>
          </div>
        </div>

        {/* Brand Text & Typography */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-white tracking-tighter mb-3 flex items-center justify-center gap-1">
            Nursy<span className="text-brand-gold animate-pulse">.</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-white/10"></div>
             <p className="text-brand-muted font-black text-[11px] uppercase tracking-[0.5em] opacity-80">
               Nursing Excellence
             </p>
             <div className="h-px w-8 bg-white/10"></div>
          </div>
        </div>

        {/* Deluxe Progress Bar */}
        <div className="relative w-72 mb-8">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div 
                    className="h-full bg-gradient-to-r from-brand-gold via-yellow-300 to-brand-gold transition-all duration-75 ease-linear relative"
                    style={{ width: `${progress}%` }}
                >
                    {/* Shimmer overlay for the progress fill */}
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_100%)] animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]"></div>
                </div>
            </div>
            
            {/* Percentage Badge */}
            <div 
                className="absolute -top-10 transition-all duration-75 ease-linear"
                style={{ left: `calc(${progress}% - 20px)` }}
            >
                <div className="bg-brand-card border border-brand-gold/30 px-3 py-1 rounded-lg shadow-xl">
                    <span className="text-[10px] font-mono font-black text-brand-gold">{progress}%</span>
                </div>
            </div>
        </div>
        
        {/* Animated Status Text */}
        <div className="h-10 flex items-center justify-center overflow-hidden">
            <div key={statusIndex} className="animate-fade-in-up text-center">
                <span className="text-sm font-black text-white/90 tracking-wide bg-white/5 px-6 py-2 rounded-full border border-white/5 shadow-sm">
                   {loadingMessages[statusIndex]}
                </span>
            </div>
        </div>

        {/* Security Indicator */}
        <div className="mt-12 flex items-center gap-3 text-brand-muted/40 animate-fade-in" style={{ animationDelay: '1.5s' }}>
           <ShieldCheck size={14} />
           <span className="text-[9px] font-bold uppercase tracking-widest">Secured Learning Environment</span>
        </div>
      </div>

      {/* Footer Micro-branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center">
        <div className="flex items-center justify-center gap-4 opacity-20">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
            <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em]">
              Powered by Nursy Engine v4.0
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};
