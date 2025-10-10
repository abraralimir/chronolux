'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useVideoPlayer } from '@/hooks/use-video-player';
import VideoControls from '@/components/video-controls';

interface VideoPlayerProps {
  src: string;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    toggleFullScreen,
  } = useVideoPlayer(videoRef, videoContainerRef);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const hideControls = useCallback(() => {
    if (playerState.isPlaying) {
      setShowControls(false);
    }
  }, [playerState.isPlaying]);

  const handleInteraction = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(hideControls, 3000);
  }, [hideControls]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // We only toggle play/pause if the click is on the container itself,
    // not on the controls overlay.
    if ((e.target as HTMLElement).isEqualNode(videoContainerRef.current) || (e.target as HTMLElement).classList.contains('w-full')) {
       togglePlay();
    }
    handleInteraction();
  };

  useEffect(() => {
    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleInteraction);
      container.addEventListener('touchstart', handleInteraction);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleInteraction);
        container.removeEventListener('touchstart', handleInteraction);
      }
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [handleInteraction]);

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group focus:outline-none cursor-pointer"
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        src={src}
        title={title}
        className="w-full h-full object-contain"
        onTimeUpdate={handleOnTimeUpdate}
        onLoadedMetadata={() => handleOnTimeUpdate()} // Set initial duration
        onEnded={togglePlay} // Pause when ended
        playsInline // Crucial for iOS Safari
        preload="metadata"
      />
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls || !playerState.isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        // Prevent click event from bubbling up from controls to the container
        onClick={(e) => e.stopPropagation()}
      >
        <VideoControls
          onPlayPause={togglePlay}
          onMute={toggleMute}
          onSpeedChange={handleVideoSpeed}
          onProgressChange={handleVideoProgress}
          onToggleFullScreen={toggleFullScreen}
          playerState={playerState}
          title={title}
        />
      </div>
    </div>
  );
}
