'use client';

import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // This effect can be used for any future enhancements if needed.
    // For now, we are relying on native controls.
  }, []);

  return (
    <div 
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group focus:outline-none" 
    >
      <video
        ref={videoRef}
        src={src}
        title={title}
        className="w-full h-full"
        controls // This is the key change: enables native browser controls
        playsInline // Ensures video plays inline on iOS instead of forcing fullscreen
        preload="metadata" // Helps the browser load video metadata quickly
      />
    </div>
  );
}
