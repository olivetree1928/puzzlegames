import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface MazeGameProps {
  onBack: () => void;
}

const MAZE_SIZE = 15;
const CELL_SIZE = 30;

type Maze = number[][];

const generateMaze = (): Maze => {
  const maze: Maze = Array(MAZE_SIZE).fill(null).map(() => Array(MAZE_SIZE).fill(1));

  const carve = (x: number, y: number) => {
    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5);

    maze[y][x] = 0;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx > 0 && nx < MAZE_SIZE - 1 && ny > 0 && ny < MAZE_SIZE - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  };

  carve(1, 1);
  maze[1][1] = 0;
  maze[MAZE_SIZE - 2][MAZE_SIZE - 2] = 0;

  return maze;
};

export const MazeGame = ({ onBack }: MazeGameProps) => {
  const { language } = useLanguage();
  const [maze, setMaze] = useState<Maze>(generateMaze());
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const resetGame = () => {
    setMaze(generateMaze());
    setPlayerPos({ x: 1, y: 1 });
    setMoves(0);
    setWon(false);
  };

  const movePlayer = (dx: number, dy: number) => {
    if (won) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE && maze[newY][newX] === 0) {
      setPlayerPos({ x: newX, y: newY });
      setMoves(m => m + 1);

      if (newX === MAZE_SIZE - 2 && newY === MAZE_SIZE - 2) {
        setWon(true);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, won]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation('backToHome', language)}
          </button>

          <div className="text-lg font-bold text-slate-800">Moves: {moves}</div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="inline-block bg-slate-900 p-1 rounded-lg">
              {maze.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      className="transition-all"
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: cell === 1 ? '#1e293b' : '#f8fafc'
                      }}
                    >
                      {playerPos.x === x && playerPos.y === y && (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🎯
                        </div>
                      )}
                      {x === MAZE_SIZE - 2 && y === MAZE_SIZE - 2 && !(playerPos.x === x && playerPos.y === y) && (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🏁
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {won && (
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600 mb-4">
                Congratulations! You escaped in {moves} moves!
              </div>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {getTranslation('restart', language)}
            </button>
          </div>

          <div className="text-center text-slate-600">
            <p>Use arrow keys to navigate through the maze</p>
            <p>Reach the flag to win!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
