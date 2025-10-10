'use client';

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FastForward,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoControlsProps {
  onPlayPause: () => void;
  onMute: () => void;
  onSpeedChange: (speed: number) => void;
  onProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFullScreen: () => void;
  playerState: {
    isPlaying: boolean;
    progress: number;
    speed: number;
    isMuted: boolean;
    isFullScreen: boolean;
    duration: number;
  };
  title: string;
}

const formatTime = (time: number) => {
  if (isNaN(time) || time === 0) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


export default function VideoControls({
  onPlayPause,
  onMute,
  onSpeedChange,
  onProgressChange,
  onToggleFullScreen,
  playerState,
  title,
}: VideoControlsProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-white font-bold text-lg">{title}</div>
        <div className="flex flex-col gap-2">
            <input
                type="range"
                min="0"
                max="100"
                value={playerState.progress}
                onChange={onProgressChange}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                    <button onClick={onPlayPause}>
                        {playerState.isPlaying ? <Pause /> : <Play />}
                    </button>
                    <button onClick={onMute}>
                        {playerState.isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                    <div className="text-sm">
                        {formatTime((playerState.progress / 100) * playerState.duration)} / {formatTime(playerState.duration)}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1">
                                <FastForward />
                                <span className="text-sm">{playerState.speed}x</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {[0.5, 1, 1.5, 2].map((speed) => (
                                <DropdownMenuItem key={speed} onClick={() => onSpeedChange(speed)}>
                                    {speed}x
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button onClick={onToggleFullScreen}>
                        {playerState.isFullScreen ? <Minimize /> : <Maximize />}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
