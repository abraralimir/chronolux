
'use client';

import { useState, useEffect } from 'react';
import {
  Home,
  Tv,
  Gamepad2,
  ArrowLeft,
  PlaneTakeoff,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SnakeGame from '@/components/snake-game';
import MemoryGame from '@/components/memory-game';
import DigitalClockFooter from '@/components/digital-clock-footer';
import FlightProgress from '@/components/flight-progress';
import VideoPlayer from '@/components/video-player';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Game = 'snake' | 'memory' | null;
type Video = {
    id: string;
    title: string;
    src: string;
}

const GameSelection = ({ onSelectGame }: { onSelectGame: (game: Game) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
            className="cursor-pointer hover:shadow-primary/50 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-lg border-white/20"
            onClick={() => onSelectGame('snake')}
        >
            <CardHeader>
                <CardTitle>Snake</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">The classic arcade game.</p>
            </CardContent>
        </Card>
        <Card
            className="cursor-pointer hover:shadow-primary/50 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-lg border-white/20"
            onClick={() => onSelectGame('memory')}
        >
            <CardHeader>
                <CardTitle>Memory Game</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Match the pairs.</p>
            </CardContent>
        </Card>
    </div>
);


const GamesView = () => {
    const [selectedGame, setSelectedGame] = useState<Game>(null);

    const renderGame = () => {
        switch(selectedGame) {
            case 'snake':
                return <SnakeGame />;
            case 'memory':
                return <MemoryGame />;
            default:
                return <GameSelection onSelectGame={setSelectedGame} />;
        }
    }

    return (
        <div className="relative w-full max-w-md mx-auto p-4 sm:p-0">
            {selectedGame && (
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedGame(null)}
                    className="absolute -top-12 left-0 text-gray-400 hover:text-white"
                    >
                    <ArrowLeft />
                    <span className="sr-only">Back to Games</span>
                </Button>
            )}
           {renderGame()}
        </div>
    )
}

const EntertainmentView = () => {
  const [selectedMovie, setSelectedMovie] = useState<Video | null>(null);

  // Hardcoded video data
  const movies: Video[] = [
    {
      id: 'karan-aujla-video',
      title: 'For A Reason - Karan Aujla',
      src: '/For A Reason (Official Video) Karan Aujla _ Tania  _ Ikky _ Latest Punjabi Songs 2025-Cdds7YtiwFxFjVLvMBBxP0wiENRxsZ.mp4',
    },
    {
        id: 'shinchan-cartoon',
        title: 'Shinchan Cartoon',
        src: '/videoplayback (1).mp4',
    }
  ];

  if (selectedMovie) {
    return (
      <div className="w-full max-w-4xl">
        <VideoPlayer src={selectedMovie.src} title={selectedMovie.title} />
         <Button
            variant="ghost"
            onClick={() => setSelectedMovie(null)}
            className="mt-4 text-gray-400 hover:text-white"
            >
            <ArrowLeft className="mr-2" />
            Back to Entertainment
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl justify-center">
      {movies.map((movie) => (
        <Card
            key={movie.id}
            className="cursor-pointer group relative overflow-hidden bg-card/50 backdrop-blur-lg border-white/20 transition-all hover:shadow-primary/50 hover:shadow-lg hover:-translate-y-1"
            onClick={() => setSelectedMovie(movie)}
        >
             <Image
                src={`https://picsum.photos/seed/${movie.id}/400/225`}
                alt={movie.title}
                width={400}
                height={225}
                data-ai-hint={movie.id === 'karan-aujla-video' ? 'music video' : 'cartoon animation'}
                className="w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <CardHeader className="absolute bottom-0 left-0 w-full">
                <CardTitle className="text-white">{movie.title}</CardTitle>
            </CardHeader>
        </Card>
      ))}
    </div>
  )
}

const CategoryCard = ({ icon, title, description, onClick, disabled = false }: { icon: React.ReactNode, title: string, description: string, onClick: () => void, disabled?: boolean }) => (
    <Card
      className={cn(
        "bg-card/50 backdrop-blur-lg border-white/20 transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-primary/50 hover:shadow-lg hover:-translate-y-1"
        )}
      onClick={!disabled ? onClick : undefined}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-4 text-2xl">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
)

export default function InflightPage() {
  const [view, setView] = useState('categories');

  const renderContent = () => {
    switch (view) {
      case 'games':
        return <GamesView />;
      case 'entertainment':
        return <EntertainmentView />;
      case 'flight-progress':
        return <FlightProgress />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard
                icon={<Tv className="h-8 w-8 text-primary" />}
                title="Entertainment"
                description="Watch movies and TV shows."
                onClick={() => setView('entertainment')}
            />
            <CategoryCard
                icon={<Gamepad2 className="h-8 w-8 text-primary" />}
                title="Games"
                description="Play fun games to pass the time."
                onClick={() => setView('games')}
            />
            <CategoryCard
                icon={<PlaneTakeoff className="h-8 w-8 text-primary" />}
                title="Flight Progress"
                description="Track your flight's progress."
                onClick={() => setView('flight-progress')}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-headline"
        style={{
            backgroundImage: `url("https://picsum.photos/seed/flight-bg/1920/1080")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
        {view !== 'categories' && (
           <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('categories')}
              className="absolute top-4 left-4 text-gray-400 hover:text-white z-10"
              >
              <ArrowLeft />
              <span className="sr-only">Back</span>
          </Button>
        )}

        {renderContent()}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 left-4 text-gray-400 hover:text-white z-10"
                >
                  <Home />
                  <span className="sr-only">Online Mode</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Online Mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </main>
      <DigitalClockFooter />
    </div>
  );
}
