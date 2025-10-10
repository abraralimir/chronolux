'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 200; // ms

const getRandomCoordinate = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving up
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [direction]
  );

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomCoordinate());
    setDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        // Wall collision
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameOver(true);
            return prevSnake;
          }
        }
        
        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          let newFoodPosition = getRandomCoordinate();
          // Ensure new food is not on the snake
          while (newSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) {
            newFoodPosition = getRandomCoordinate();
          }
          setFood(newFoodPosition);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver]);


  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isHead = snake[0].x === x && snake[0].y === y;

        board.push(
          <div
            key={`${x}-${y}`}
            className={`w-full h-full ${
              isHead ? 'bg-primary' : isSnake ? 'bg-primary/70' : isFood ? 'bg-red-500' : 'bg-secondary'
            } rounded-sm`}
          />
        );
      }
    }
    return board;
  };
  
  const handleDirectionChange = (newDirection: {x: number, y: number}) => {
    if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
      setDirection(newDirection);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Snake Game</CardTitle>
        <div className="text-lg font-bold text-primary">Score: {score}</div>
      </CardHeader>
      <CardContent className="relative">
        <div
          className="grid gap-px bg-border aspect-square"
          style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
        >
          {renderBoard()}
        </div>
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <h3 className="text-4xl font-bold text-white mb-4">Game Over</h3>
            <Button onClick={resetGame} variant="secondary">
              <RotateCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        )}
        <div className="flex justify-center items-center mt-4 md:hidden">
            <div className="grid grid-cols-3 gap-2">
                <div></div>
                <Button variant="outline" size="icon" onClick={() => handleDirectionChange({x: 0, y: -1})}><ArrowUp /></Button>
                <div></div>
                <Button variant="outline" size="icon" onClick={() => handleDirectionChange({x: -1, y: 0})}><ArrowLeft /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDirectionChange({x: 0, y: 1})}><ArrowDown /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDirectionChange({x: 1, y: 0})}><ArrowRight /></Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
