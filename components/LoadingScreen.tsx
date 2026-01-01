
import React, { useEffect, useState } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-brand-main flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse transition-all duration-1000"></div>

      <div className="relative flex flex-col items-center animate-scale-up">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-gold blur-2xl opacity-20 animate-heartbeat rounded-full"></div>
          <div className="relative z-10 bg-gradient-to-br from-brand-gold to-yellow-600 p-6 rounded-[2rem] shadow-glow transform transition-transform hover:scale-110">
            <GraduationCap className="text-brand-main h-16 w-16" strokeWidth={2.5} />
          </div>
          <div className="absolute -top-4 -right-4 bg-brand-main border border-brand-gold/30 p-2 rounded-xl text-brand-gold animate-float shadow-lg">
            <Sparkles size={20} />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
            Nursy<span className="text-brand-gold">.</span>
          </h1>
          <p className="text-brand-muted font-bold text-xs uppercase tracking-[0.4em] opacity-60">
            Premium Nursing Academy
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-brand-gold to-yellow-200 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest animate-pulse">
            جاري تهيئة المنصة التعليمية
          </span>
          <span className="text-[9px] text-brand-muted font-mono">
            {progress}% Loaded
          </span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 text-center">
        <p className="text-[10px] text-brand-muted/40 font-bold uppercase tracking-[0.2em]">
          Powered by Nursy Tech Solutions
        </p>
      </div>
    </div>
  );
};
