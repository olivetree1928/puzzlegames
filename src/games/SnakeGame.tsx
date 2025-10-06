import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface SnakeGameProps {
  onBack: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const INITIAL_SPEED = 150;

export const SnakeGame = ({ onBack }: SnakeGameProps) => {
  const { language } = useLanguage();
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const checkCollision = (head: Position): boolean => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (checkCollision(head)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation('backToHome', language)}
          </button>

          <div className="text-2xl font-bold text-slate-800">
            {getTranslation('score', language)}: {score}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-4 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-slate-700">{getTranslation('speed', language)}:</label>
              <select
                value={gameSpeed}
                onChange={(e) => setGameSpeed(Number(e.target.value))}
                className="px-2 py-1 border rounded bg-white"
              >
                <option value="200">🐌 {getTranslation('slow', language)}</option>
                <option value="150">🚶 {getTranslation('normal', language)}</option>
                <option value="100">🏃 {getTranslation('fast', language)}</option>
                <option value="50">⚡ {getTranslation('superFast', language)}</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <div
              className="relative bg-slate-900 rounded-lg overflow-hidden"
              style={{
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE
              }}
            >
              {/* 背景格子 */}
              <div className="absolute inset-0" 
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                }}
              />
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`absolute ${index === 0 ? 'bg-green-600' : 'bg-green-500'} rounded-sm`}
                  style={{
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2
                  }}
                >
                  {index === 0 && (
                    <>
                      {/* 眼镜框 */}
                      <div className="absolute w-full h-full flex items-center justify-center">
                        <div className="relative w-3/4 h-1/2">
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[45%] h-[80%] border border-slate-800 rounded-full bg-white opacity-80" />
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[45%] h-[80%] border border-slate-800 rounded-full bg-white opacity-80" />
                          <div className="absolute left-[45%] top-1/2 transform -translate-y-1/2 w-[10%] h-[20%] bg-slate-800" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* 苹果食物 */}
              <div
                className="absolute"
                style={{
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2
                }}
              >
                <div className="relative w-full h-full">
                  {/* 苹果主体 */}
                  <div className="absolute inset-0 bg-red-500 rounded-full" />
                  {/* 苹果叶子 */}
                  <div className="absolute w-1/3 h-1/3 -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="absolute w-full h-full bg-green-600" style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }} />
                  </div>
                </div>
              </div>

              {gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-4">
                      {getTranslation('gameOver', language)}
                    </div>
                    <div className="text-2xl text-white mb-6">
                      {getTranslation('score', language)}: {score}
                    </div>
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {getTranslation('restart', language)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 移动设备控制器 */}
          <div className="md:hidden mt-8">
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
              {/* 上按钮 */}
              <div className="col-start-2">
                <button
                  className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg active:bg-blue-600 flex items-center justify-center"
                  onClick={() => direction !== 'DOWN' && setDirection('UP')}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
              {/* 左按钮 */}
              <div className="col-start-1 row-start-2">
                <button
                  className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg active:bg-blue-600 flex items-center justify-center"
                  onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              {/* 暂停按钮 */}
              <div className="col-start-2 row-start-2">
                <button
                  className="w-16 h-16 bg-gray-500 rounded-lg shadow-lg active:bg-gray-600 flex items-center justify-center"
                  onClick={() => setIsPaused(p => !p)}
                >
                  {isPaused ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* 右按钮 */}
              <div className="col-start-3 row-start-2">
                <button
                  className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg active:bg-blue-600 flex items-center justify-center"
                  onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {/* 下按钮 */}
              <div className="col-start-2 row-start-3">
                <button
                  className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg active:bg-blue-600 flex items-center justify-center"
                  onClick={() => direction !== 'UP' && setDirection('DOWN')}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 桌面端控制说明 */}
          <div className="hidden md:block text-center text-slate-600 mt-6">
            <p className="mb-2">{getTranslation('useArrowKeys', language)}</p>
            <p>Press SPACE to {isPaused ? getTranslation('resume', language) : getTranslation('pause', language)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
