
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  url: string;
  title: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate fake visualization bars
  const [bars] = useState(() => Array.from({ length: 24 }, () => Math.floor(Math.random() * 60) + 20));

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
       audio.removeEventListener('timeupdate', updateProgress);
       audio.removeEventListener('ended', () => setIsPlaying(false));
    }
  }, []);

  return (
    <div className="flex items-center gap-4 w-full bg-[#1A1A1A] dark:bg-black p-4 rounded-lg border border-[#333]">
      <audio ref={audioRef} src={url} />
      
      <button 
        onClick={togglePlay} 
        className="w-10 h-10 bg-[#F38020] text-white rounded-full flex items-center justify-center hover:bg-[#c7620e] transition-all shrink-0 shadow-lg shadow-orange-900/20"
      >
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white truncate">{title}</span>
          <span className="text-[10px] text-gray-400 font-mono">AUDIO</span>
        </div>
        
        {/* Fake Visualizer */}
        <div className="flex items-center gap-1 h-8 cursor-pointer relative group" onClick={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           const x = e.clientX - rect.left;
           const percent = x / rect.width;
           if(audioRef.current) audioRef.current.currentTime = percent * audioRef.current.duration;
        }}>
           {bars.map((h, i) => {
              const active = (i / bars.length) * 100 < progress;
              return (
                 <div 
                   key={i} 
                   className={`flex-1 rounded-full transition-all duration-200 ${active ? 'bg-[#F38020]' : 'bg-[#333] group-hover:bg-[#444]'}`}
                   style={{ height: active && isPlaying ? `${Math.max(h, Math.random()*100)}%` : `${h}%` }}
                 ></div>
              )
           })}
        </div>
      </div>
    </div>
  );
};
