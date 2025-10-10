'use client';

import { useState, useEffect, RefObject, useCallback } from 'react';

export const useVideoPlayer = (
  videoRef: RefObject<HTMLVideoElement>,
  containerRef: RefObject<HTMLDivElement>
) => {
  const [playerState, setPlayerState] = useState({
    isPlaying: true, // Start as playing due to autoPlay
    progress: 0,
    speed: 1,
    isMuted: true, // Start as muted
    isFullScreen: false,
    duration: 0,
  });

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const newIsPlaying = !video.paused;
       if (newIsPlaying) {
          await video.play();
       } else {
          video.pause();
       }
       setPlayerState(prevState => ({ ...prevState, isPlaying: newIsPlaying }));
    } catch (error) {
      console.error("Video play/pause failed", error);
    }
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.muted = playerState.isMuted;
    }
  }, [playerState.isMuted, videoRef]);

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
  
  const handleVideoEnded = () => {
    setPlayerState(prevState => ({ ...prevState, isPlaying: false }));
  }

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
    setPlayerState(prevState => ({...prevState, isMuted: !prevState.isMuted }));
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

    const video = videoRef.current;
    if (video) {
        video.addEventListener('ended', handleVideoEnded);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
       if (video) {
        video.removeEventListener('ended', handleVideoEnded);
       }
    }
  }, [videoRef]);

  // Sync state with video element properties
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncState = () => {
        setPlayerState(prev => ({
            ...prev,
            isPlaying: !video.paused,
            isMuted: video.muted
        }));
    }

    video.addEventListener('play', syncState);
    video.addEventListener('pause', syncState);
    video.addEventListener('volumechange', syncState);

    // Initial sync
    syncState();

    return () => {
        video.removeEventListener('play', syncState);
        video.removeEventListener('pause', syncState);
        video.removeEventListener('volumechange', syncState);
    }

  }, [videoRef]);

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
