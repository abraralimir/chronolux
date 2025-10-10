'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Volume1,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const scheduleControlsHide = useCallback(() => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
        if(isPlaying && !isSeeking) {
            setShowControls(false);
        }
    }, 3000);
  }, [isPlaying, isSeeking]);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        scheduleControlsHide();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [scheduleControlsHide]);

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else if (newVolume === 0 && !videoRef.current.muted) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const currentlyMuted = videoRef.current.muted;
      videoRef.current.muted = !currentlyMuted;
      setIsMuted(!currentlyMuted);
      if (currentlyMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = value[0];
      videoRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };
  
  const handlePointerDown = () => {
      setIsSeeking(true);
      if(controlsTimeout.current) clearTimeout(controlsTimeout.current);
  }
  
  const handlePointerUp = () => {
      setIsSeeking(false);
      scheduleControlsHide();
  }

  const handleFullscreenToggle = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
        playerRef.current.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleUserActivity = () => {
    setShowControls(true);
    scheduleControlsHide();
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const currentRef = playerRef.current;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === ' ' || e.key === 'k') {
            e.preventDefault();
            handlePlayPause();
        }
        if(e.key === 'f') {
            e.preventDefault();
            handleFullscreenToggle();
        }
        if(e.key === 'm') {
            e.preventDefault();
            handleMuteToggle();
        }
    }
    
    currentRef?.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        currentRef?.removeEventListener('keydown', handleKeyDown);
    }
  }, [handlePlayPause]);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;


  return (
    <div 
        ref={playerRef} 
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group focus:outline-none" 
        onMouseMove={handleUserActivity}
        onTouchStart={handleUserActivity}
        onMouseLeave={() => isPlaying && scheduleControlsHide()}
        tabIndex={0}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline // This is important for iOS
      />

      {/* Main Play/Pause Button */}
       <div className={cn("absolute inset-0 flex items-center justify-center transition-all duration-300 z-10", 
        showControls ? "opacity-100" : "opacity-0 pointer-events-none")}>
         <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white bg-black/30 backdrop-blur-sm rounded-full w-16 h-16 md:w-20 md:h-20 hover:bg-black/50 transition-colors">
            {isPlaying ? <Pause className="h-8 w-8 md:h-10 md:w-10" /> : <Play className="h-8 w-8 md:h-10 md:w-10 ml-1" />}
        </Button>
      </div>

      {/* Controls Overlay */}
      <div 
        className={cn(
            "absolute bottom-0 left-0 right-0 p-2 md:p-4 z-20 transition-all duration-300",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 md:p-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-2 md:gap-3">
                <span className="text-white text-xs font-mono w-12 text-center">{formatTime(progress)}</span>
                <Slider
                    value={[progress]}
                    max={duration}
                    step={1}
                    onValueChange={handleProgressChange}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    className="w-full cursor-pointer"
                />
                <span className="text-white text-xs font-mono w-12 text-center">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white hover:bg-white/20">
                        {isPlaying ? <Pause className="h-5 w-5 md:h-6 md:w-6" /> : <Play className="h-5 w-5 md:h-6 md:w-6" />}
                    </Button>

                    <div className="flex items-center gap-2 w-24 md:w-32 group/volume">
                        <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="text-white hover:bg-white/20">
                            <VolumeIcon className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                        <Slider
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.05}
                            onValueChange={handleVolumeChange}
                            className="w-full cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-opacity hidden sm:block"
                        />
                    </div>
                </div>

                <div className="flex-1 text-center hidden sm:block">
                     <span className="text-white text-sm font-semibold truncate px-4">{title}</span>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" onClick={handleFullscreenToggle} className="text-white hover:bg-white/20">
                        {isFullscreen ? <Minimize className="h-5 w-5 md:h-6 md:w-6" /> : <Maximize className="h-5 w-5 md:h-6 md:w-6" />}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
