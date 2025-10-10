'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCw, Star, Heart, Sun, Moon, Cloud, Zap, Anchor, Award, Ghost, Diamond, GitFork, Grab, Group } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [
    <Star key="star" />, <Heart key="heart" />, <Sun key="sun" />, <Moon key="moon" />, 
    <Cloud key="cloud" />, <Zap key="zap" />, <Anchor key="anchor" />, <Award key="award" />,
    <Ghost key="ghost" />, <Diamond key="diamond" />, <GitFork key="git-fork" />, <Grab key="grab" />
];

const generateCards = (numPairs: number = 8) => {
    const selectedIcons = icons.slice(0, numPairs);
    const duplicatedIcons = [...selectedIcons, ...selectedIcons];
    const shuffledIcons = duplicatedIcons
        .map(icon => ({ icon, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ icon }) => icon);

    return shuffledIcons.map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
    }));
};

type CardType = {
    id: number;
    icon: React.ReactNode;
    isFlipped: boolean;
    isMatched: boolean;
};

export default function MemoryGame() {
    const [cards, setCards] = useState<CardType[]>(generateCards());
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstIndex, secondIndex] = flippedCards;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            // Using icon key to compare
            if ((firstCard.icon as React.ReactElement).key === (secondCard.icon as React.ReactElement).key) {
                // Matched
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.id === firstCard.id || card.id === secondCard.id
                            ? { ...card, isMatched: true }
                            : card
                    )
                );
                setFlippedCards([]);
            } else {
                // Not a match
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === firstCard.id || card.id === secondCard.id
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedCards([]);
                }, 1000);
            }
            setMoves(m => m + 1);
        }
    }, [flippedCards, cards]);

    useEffect(() => {
        const allMatched = cards.every(card => card.isMatched);
        if (allMatched && cards.length > 0) {
            setGameOver(true);
        }
    }, [cards]);

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || cards[index].isFlipped) {
            return;
        }

        setCards(prevCards =>
            prevCards.map(card =>
                card.id === index ? { ...card, isFlipped: true } : card
            )
        );

        setFlippedCards(prev => [...prev, index]);
    };
    
    const resetGame = () => {
        setCards(generateCards());
        setFlippedCards([]);
        setMoves(0);
        setGameOver(false);
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Memory Game</CardTitle>
                <div className="text-lg font-bold text-primary">Moves: {moves}</div>
            </CardHeader>
            <CardContent className="relative">
                <div className="grid grid-cols-4 gap-2 aspect-square">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={cn(
                                'w-full h-full rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-500',
                                card.isFlipped || card.isMatched ? 'bg-secondary' : 'bg-primary/20 hover:bg-primary/40',
                                card.isFlipped && !card.isMatched && 'transform-gpu [transform:rotateY(180deg)]'
                            )}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className={cn('text-primary transition-opacity duration-300', (card.isFlipped || card.isMatched) ? 'opacity-100' : 'opacity-0')}>
                                {React.cloneElement(card.icon as React.ReactElement, { className: "h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" })}
                            </div>
                        </div>
                    ))}
                </div>
                {gameOver && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                        <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2">You Win!</h3>
                        <p className="text-white mb-4">Total Moves: {moves}</p>

                        <Button onClick={resetGame} variant="secondary">
                            <RotateCw className="mr-2 h-4 w-4" />
                            Play Again
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
