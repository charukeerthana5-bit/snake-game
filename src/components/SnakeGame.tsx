import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT, type Point, type Direction } from '../constants';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  accentColor: string;
}

export default function SnakeGame({ onScoreUpdate, accentColor }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
        case ' ': setIsPaused((prev) => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };
        const currentDir = nextDirection;
        setDirection(currentDir);

        switch (currentDir) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setFood(generateFood(newSnake));
          setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isGameOver, isPaused, food, speed, nextDirection, score, onScoreUpdate, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = i * (canvas.width / GRID_SIZE);
      ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(canvas.width, pos); ctx.stroke();
    }

    // Draw Food
    const cellSize = canvas.width / GRID_SIZE;
    ctx.fillStyle = '#ff4444';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff4444';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? accentColor : `${accentColor}cc`;
      ctx.shadowBlur = i === 0 ? 20 : 10;
      ctx.shadowColor = accentColor;
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food, accentColor]);

  return (
    <div className="relative group">
      {/* Game Container */}
      <div 
        className="relative bg-slate-900 rounded-xl overflow-hidden border-2 transition-colors duration-500"
        style={{ borderColor: `${accentColor}44`, boxShadow: `0 0 40px ${accentColor}11` }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block w-full aspect-square md:w-[400px] screen-tear"
        />

        {/* Overlay Screens */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-none p-8 border-4 border-[#ff00ff]"
            >
              {isGameOver ? (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-[#ff00ff]" />
                  <h2 className="text-2xl font-pixel text-[#00ffff] mb-2 glitch-text">SEGMENT_FAILURE</h2>
                  <p className="text-white mb-6 font-pixel text-[10px]">LOG_SCORE: {score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00ffff] text-black font-pixel text-[10px] cyan-magenta-border hover:bg-[#ff00ff] hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    RE_INIT
                  </button>
                </motion.div>
              ) : (
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-[#00ffff]" />
                  <h2 className="text-xl font-pixel text-white mb-4 glitch-text">HALTED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-2 border-2 border-[#00ffff] text-[#00ffff] font-pixel text-[10px] hover:bg-[#00ffff] hover:text-black transition-colors"
                  >
                    RESUME_LINK
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Hint */}
      <div className="mt-4 flex justify-between items-end font-pixel text-[8px]">
        <div className="space-y-2">
          <p className="text-[#ff00ff] uppercase tracking-widest">INPUT_VECTORS</p>
          <div className="flex gap-2">
            {['↑', '←', '↓', '→'].map((k) => (
              <span key={k} className="w-8 h-8 flex items-center justify-center border-2 border-[#00ffff] text-[#00ffff]">
                {k}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#ff00ff] uppercase tracking-widest">MHZ_STABILITY</p>
          <p className="text-white">FRQ: {(INITIAL_SPEED - speed).toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
}
