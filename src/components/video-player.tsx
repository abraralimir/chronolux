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
  const [isInteracted, setIsInteracted] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const hideControls = () => {
    if (playerState.isPlaying) {
      setShowControls(false);
    }
  };

  const handleInteraction = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(hideControls, 3000);
  }, [playerState.isPlaying]);

  const handlePlayPause = () => {
    if (!isInteracted) setIsInteracted(true);
    togglePlay();
    handleInteraction();
  };

  useEffect(() => {
    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleInteraction);
      container.addEventListener('touchstart', handleInteraction);
      container.addEventListener('click', handlePlayPause);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleInteraction);
        container.removeEventListener('touchstart', handleInteraction);
        container.removeEventListener('click', handlePlayPause);
      }
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [handleInteraction, handlePlayPause]);

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group focus:outline-none"
      data-fullscreen={playerState.isFullScreen}
    >
      <video
        ref={videoRef}
        src={src}
        title={title}
        className="w-full h-full"
        onTimeUpdate={handleOnTimeUpdate}
        onClick={handlePlayPause}
        playsInline // Essential for mobile browsers
        preload="metadata"
      />
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls || !playerState.isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <VideoControls
          onPlayPause={handlePlayPause}
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
