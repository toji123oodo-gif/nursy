
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  Settings, SkipBack, SkipForward, Loader2, AlertCircle, RefreshCw
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
  const [error, setError] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // 1. YouTube Detection Logic
  const youtubeId = useMemo(() => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [url]);

  // 2. Return YouTube Iframe if applicable
  if (youtubeId) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <iframe 
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // --- NATIVE PLAYER LOGIC ---

  // Force video reload when URL changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
      setIsLoading(true);
      setError(false);
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
    if (videoRef.current && !error) {
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

  const handleReady = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = (e: any) => {
    console.error("Video Error Details:", videoRef.current?.error, e);
    setIsLoading(false);
    setError(true);
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
        onLoadedData={handleReady}
        onCanPlay={handleReady}
        onCanPlayThrough={handleReady}
        onError={handleError}
        onClick={togglePlay}
        playsInline
        muted={isMuted}
        preload="metadata"
        crossOrigin="anonymous" 
      />

      {/* Loading Overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <Loader2 size={48} className="text-brand-orange animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-white">
          <AlertCircle size={48} className="text-red-500 mb-2" />
          <p className="font-bold">فشل تشغيل الفيديو</p>
          <p className="text-xs text-gray-400 mt-1">تأكد من صحة الرابط أو نوع الملف</p>
          <button 
            onClick={() => {
                if(videoRef.current) { 
                    videoRef.current.load(); 
                    setError(false); 
                    setIsLoading(true); 
                }
            }}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-bold"
          >
            <RefreshCw size={16} /> إعادة المحاولة
          </button>
        </div>
      )}

      {/* Custom Controls Overlay */}
      {!error && (
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
      )}
    </div>
  );
};
