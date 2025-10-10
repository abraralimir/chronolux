'use client';

import { useState, useEffect, RefObject } from 'react';

export const useVideoPlayer = (
  videoRef: RefObject<HTMLVideoElement>,
  containerRef: RefObject<HTMLDivElement>
) => {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
    isFullScreen: false,
    duration: 0,
  });

  const togglePlay = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  useEffect(() => {
    if (videoRef.current) {
      playerState.isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [playerState.isPlaying, videoRef]);

  const handleOnTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setPlayerState({
        ...playerState,
        progress,
        duration: videoRef.current.duration,
      });
    }
  };

  const handleVideoProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const manualChange = Number(event.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration / 100) * manualChange;
      setPlayerState({
        ...playerState,
        progress: manualChange,
      });
    }
  };

  const handleVideoSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlayerState({
        ...playerState,
        speed,
      });
    }
  };

  const toggleMute = () => {
    if(videoRef.current){
        videoRef.current.muted = !playerState.isMuted;
        setPlayerState({
            ...playerState,
            isMuted: !playerState.isMuted,
        });
    }
  };

  const toggleFullScreen = () => {
    const container = containerRef.current;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        setPlayerState(prev => ({ ...prev, isFullScreen: true }));
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        setPlayerState(prev => ({ ...prev, isFullScreen: false }));
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setPlayerState(prev => ({...prev, isFullScreen: !!document.fullscreenElement}));
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, []);

  return {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    toggleFullScreen,
  };
};
