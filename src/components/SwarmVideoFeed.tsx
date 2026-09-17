import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';

interface SwarmVideoFeedProps {
  className?: string;
  autoPlay?: boolean;
}

export const SwarmVideoFeed: React.FC<SwarmVideoFeedProps> = ({ 
  className = '', 
  autoPlay = true 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className={`relative w-full rounded-lg overflow-hidden border border-cyan-500/40 bg-black shadow-[0_0_35px_rgba(0,245,255,0.15)] group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src="./flies_2.mp4"
        autoPlay={autoPlay}
        loop
        muted={isMuted}
        playsInline
        className="w-full h-auto object-cover max-h-[560px] cursor-pointer"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Cyberpunk Vignette & Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#02050f]/80 via-transparent to-[#02050f]/30" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.08) 3px, rgba(0, 245, 255, 0.08) 4px)'
        }}
      />

      {/* Top HUD Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#030712]/90 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,245,255,0.4)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5ff]" />
          <span className="font-['Orbitron'] text-[10px] tracking-widest text-cyan-300 font-bold">
            LIVE BIO-CONNECTOME FEED // 60 FPS
          </span>
        </div>
      </div>

      {/* Interactive Controls Overlay (bottom-right) */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={togglePlay}
          className="p-1.5 rounded bg-slate-950/80 border border-cyan-500/40 text-cyan-400 hover:text-white hover:border-cyan-300 transition-all shadow-md"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleMute}
          className="p-1.5 rounded bg-slate-950/80 border border-cyan-500/40 text-cyan-400 hover:text-white hover:border-cyan-300 transition-all shadow-md"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded bg-slate-950/80 border border-cyan-500/40 text-cyan-400 hover:text-white hover:border-cyan-300 transition-all shadow-md"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Cyberpunk corner accents */}
      <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
    </div>
  );
};
