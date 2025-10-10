'use client';

import { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize, Pause, Play, Plane } from 'lucide-react';
import Link from 'next/link';
import Clock from '@/components/clock';
import BatteryIndicator from '@/components/battery-indicator';
import CalendarDisplay from '@/components/calendar-display';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { generateLuxuryTagline } from '@/ai/flows/generate-luxury-tagline';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const playlist = [
  {
    src: '/Glenn Miller - In the Mood (Audio).mp3',
    title: 'In the Mood',
    artist: 'Glenn Miller',
    artworkId: 'glenn-miller',
  },
  {
    src: '/1 A Taste Of Honey - Herb Alpert The Tijuana Brass.mp3',
    title: 'A Taste Of Honey',
    artist: 'Herb Alpert & The Tijuana Brass',
    artworkId: 'herb-alpert',
  },
  {
    src: '/-  - Frank Sinatra - Come Fly With Me(1).mp3.mp3',
    title: 'Come Fly With Me',
    artist: 'Frank Sinatra',
    artworkId: 'frank-sinatra',
  },
];

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tagline, setTagline] = useState('Defining moments in time.');
  const [quote] = useState('The future is not something we enter. The future is something we create.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchTagline = async () => {
      try {
        const result = await generateLuxuryTagline({});
        if (result?.tagline) {
          setTagline(result.tagline);
        }
      } catch (error) {
        console.error('Failed to generate tagline:', error);
      }
    };
    
    fetchTagline();
    const interval = setInterval(fetchTagline, 60000); // Fetch every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handleFullscreenChange = () => {
    if (typeof document !== 'undefined') {
      setIsFullscreen(!!document.fullscreenElement);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (hasInteracted && audio) {
        if (isPlaying) {
            audio.play().catch(error => {
              console.error("Audio play failed:", error);
              if (error.name !== 'AbortError') {
                setIsPlaying(false);
              }
            });
        } else {
            audio.pause();
        }
    }
  }, [isPlaying, hasInteracted]);

  useEffect(() => {
    const audio = audioRef.current;
    const track = playlist[currentTrack];
    const artwork = PlaceHolderImages.find(img => img.id === track.artworkId);

    if (audio) {
      audio.src = track.src;
      if (isPlaying && hasInteracted) {
        audio.load();
        audio.play().catch(e => console.error("Failed to play next track:", e));
      }
    }
    
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'ChronoLux',
        artwork: artwork ? [{ src: artwork.imageUrl, sizes: '512x512', type: 'image/jpeg' }] : []
      });
    }
  }, [currentTrack, isPlaying, hasInteracted]);


  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!hasInteracted) setHasInteracted(true);

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleAudio = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsPlaying(prev => !prev);
  };

  const handleTrackEnded = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-headline">
      <Header />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div className="relative aspect-square h-[75vmin] w-[75vmin] max-h-[75vh] max-w-[75vw]">
          <Clock tagline={tagline} />
          <CalendarDisplay />
          <BatteryIndicator />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAudio}
                className="absolute top-4 left-4 text-gray-400 hover:text-white"
              >
                {isPlaying ? <Pause /> : <Play />}
                <span className="sr-only">Toggle Audio</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPlaying ? 'Pause' : 'Play'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
                <Link href="/inflight">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-4 left-4 text-gray-400 hover:text-white"
                        >
                        <Plane />
                        <span className="sr-only">Inflight Mode</span>
                    </Button>
                </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inflight Mode</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                {isFullscreen ? <Minimize /> : <Maximize />}
                <span className="sr-only">Toggle Fullscreen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Fullscreen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <audio 
          ref={audioRef} 
          onEnded={handleTrackEnded} 
          className="hidden"
          preload="auto"
        />
      </main>
      <Footer quote={quote} />
    </div>
  );
}
