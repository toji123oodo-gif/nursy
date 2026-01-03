
import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progress, size = 120 }) => {
  const stroke = 8;
  const radius = (size / 2) - (stroke * 2);
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 transition-all duration-1000" width={size} height={size}>
        <circle className="text-white/5" strokeWidth={stroke} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle className="text-brand-gold transition-all duration-1000 ease-out" strokeWidth={stroke} strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} filter="url(#glow-profile)" />
        <defs>
          <filter id="glow-profile"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{progress}%</span>
        <span className="text-[8px] text-brand-gold font-black uppercase tracking-widest mt-1">إنجازك</span>
      </div>
    </div>
  );
};
