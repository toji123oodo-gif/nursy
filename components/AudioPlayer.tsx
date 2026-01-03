
import React, { useState, useRef } from 'react';
import { Play, Pause, Headphones, Zap } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  title: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
  };

  return (
    <div className="bg-brand-card/50 backdrop-blur-2xl rounded-[4rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden group">
      <audio ref={audioRef} src={url} onTimeUpdate={onTimeUpdate} />
      
      {/* Waveform Animation Mockup */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="flex items-end gap-2 h-32">
             {[...Array(20)].map((_, i) => (
               <div key={i} className={`w-2 bg-brand-gold rounded-full transition-all duration-500 ${isPlaying ? 'animate-bounce' : 'h-4'}`} style={{ animationDelay: `${i * 0.1}s`, height: `${20 + Math.random() * 80}%` }}></div>
             ))}
          </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] bg-brand-main p-1 border border-brand-gold/20 shadow-premium mb-10 flex items-center justify-center">
           <div className="w-full h-full rounded-[3.2rem] bg-gradient-to-br from-brand-card to-brand-main flex items-center justify-center overflow-hidden">
              <Headphones size={80} className={`text-brand-gold transition-all duration-700 ${isPlaying ? 'scale-125' : 'scale-100'}`} />
           </div>
        </div>
        
        <div className="text-center mb-10">
           <h3 className="text-2xl md:text-5xl font-black text-white tracking-tighter mb-4 line-clamp-1">{title}</h3>
           <p className="text-brand-gold text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 justify-center">
             <Zap size={14} /> جاري الاستماع الآن
           </p>
        </div>

        <div className="w-full max-w-2xl space-y-4 mb-10">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
             <div className="h-full ns-surface--gold-gradient ns-shadow--premium transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-brand-muted font-black tracking-widest">
             <span>00:00</span>
             <span>المحاضرة كاملة</span>
          </div>
        </div>

        <button onClick={togglePlay} className="w-24 h-24 md:w-32 md:h-32 ns-surface--gold-gradient text-brand-main rounded-full flex items-center justify-center ns-shadow--premium hover:scale-110 active:scale-95 transition-all group/btn">
           {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="translate-x-2" fill="currentColor" />}
        </button>
      </div>
    </div>
  );
};
