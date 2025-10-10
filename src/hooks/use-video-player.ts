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
        if(playerState.isPlaying) {
            videoRef.current.play().catch(e => console.error("Video play failed", e));
        } else {
            videoRef.current.pause();
        }
    }
  }, [playerState.isPlaying, videoRef]);

  const handleOnTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setPlayerState((prevState) => ({
        ...prevState,
        progress,
        duration: videoRef.current?.duration || 0,
      }));
    }
  };

  const handleVideoProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const manualChange = Number(event.target.value);
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
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
        const newMutedState = !playerState.isMuted;
        videoRef.current.muted = newMutedState;
        setPlayerState({
            ...playerState,
            isMuted: newMutedState,
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
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullScreen = !!document.fullscreenElement;
      setPlayerState(prev => ({...prev, isFullScreen }));
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
