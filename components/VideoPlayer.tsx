
import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  Settings, SkipBack, SkipForward, Loader2 
} from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Force video reload when URL changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
      setIsLoading(true);
    }
  }, [url]);

  // Auto-hide controls timer
  useEffect(() => {
    let timeout: number;
    if (isPlaying && showControls) {
      timeout = window.setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(e => console.warn("Autoplay blocked", e));
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(current);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (Number(e.target.value) * (videoRef.current?.duration || 0)) / 100;
    if (videoRef.current) videoRef.current.currentTime = time;
    setProgress(Number(e.target.value));
  };

  const toggleFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    } else if ((containerRef.current as any)?.webkitRequestFullscreen) {
      (containerRef.current as any).webkitRequestFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Real Video Element */}
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full cursor-pointer object-contain"
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onLoadStart={() => setIsLoading(true)}
        onLoadedData={() => setIsLoading(false)}
        onClick={togglePlay}
        playsInline
        muted={isMuted}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <Loader2 size={48} className="text-brand-orange animate-spin" />
        </div>
      )}

      {/* Custom Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Playback Progress */}
        <div className="mb-4 group/slider">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-orange hover:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={togglePlay} className="text-white hover:text-brand-orange transition-colors">
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-4">
               <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} className="text-white/80 hover:text-white">
                 <SkipBack size={20} />
               </button>
               <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} className="text-white/80 hover:text-white">
                 <SkipForward size={20} />
               </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <span className="text-white/60 text-xs font-mono hidden md:block">
                {videoRef.current ? Math.floor(videoRef.current.currentTime / 60) : 0}:
                {videoRef.current ? String(Math.floor(videoRef.current.currentTime % 60)).padStart(2, '0') : '00'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-white/80 hover:text-white">
              <Settings size={20} />
            </button>
            <button onClick={toggleFullscreen} className="text-white/80 hover:text-white">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
