import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface TetrisGameProps {
  onBack: () => void;
}

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 25;

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]]
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

type Board = number[][];

const createEmptyBoard = (): Board => Array(ROWS).fill(null).map(() => Array(COLS).fill(0));

export const TetrisGame = ({ onBack }: TetrisGameProps) => {
  const { language } = useLanguage();
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(SHAPES[0]);
  const [currentColor, setCurrentColor] = useState(0);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generateNewPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    setCurrentPiece(SHAPES[shapeIndex]);
    setCurrentColor(shapeIndex);
    setPosition({ x: 4, y: 0 });
  }, []);

  const checkCollision = useCallback((piece: number[][], pos: { x: number; y: number }): boolean => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && board[newY][newX]) return true;
        }
      }
    }
    return false;
  }, [board]);

  const rotatePiece = (piece: number[][]): number[][] => {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    return rotated;
  };

  const mergePiece = useCallback(() => {
    const newBoard = board.map(row => [...row]);
    currentPiece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            newBoard[boardY][boardX] = currentColor + 1;
          }
        }
      });
    });

    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++;
      }
    }

    setScore(s => s + linesCleared * 100);
    setBoard(newBoard);
    generateNewPiece();
  }, [board, currentPiece, currentColor, position, generateNewPiece]);

  const moveDown = useCallback(() => {
    if (gameOver || isPaused) return;

    const newPos = { ...position, y: position.y + 1 };
    if (checkCollision(currentPiece, newPos)) {
      if (position.y <= 0) {
        setGameOver(true);
      } else {
        mergePiece();
      }
    } else {
      setPosition(newPos);
    }
  }, [position, currentPiece, checkCollision, mergePiece, gameOver, isPaused]);

  const moveHorizontal = (dir: number) => {
    const newPos = { ...position, x: position.x + dir };
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
    }
  };

  const rotate = () => {
    const rotated = rotatePiece(currentPiece);
    if (!checkCollision(rotated, position)) {
      setCurrentPiece(rotated);
    }
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateNewPiece();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, moveDown]);

  useEffect(() => {
    const interval = setInterval(moveDown, 500);
    return () => clearInterval(interval);
  }, [moveDown]);

  useEffect(() => {
    generateNewPiece();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
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
          <div className="flex justify-center mb-6">
            <div
              className="relative bg-slate-900 rounded-lg"
              style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}
            >
              {board.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="absolute border border-slate-800"
                    style={{
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: cell ? COLORS[cell - 1] : 'transparent'
                    }}
                  />
                ))
              )}

              {currentPiece.map((row, y) =>
                row.map((cell, x) =>
                  cell ? (
                    <div
                      key={`current-${y}-${x}`}
                      className="absolute"
                      style={{
                        left: (position.x + x) * CELL_SIZE,
                        top: (position.y + y) * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: COLORS[currentColor],
                        border: '2px solid rgba(255,255,255,0.3)'
                      }}
                    />
                  ) : null
                )
              )}

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
                      className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {getTranslation('restart', language)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-slate-600">
            <p className="mb-2">Arrow keys: Move and Rotate</p>
            <p>Press SPACE to {isPaused ? getTranslation('resume', language) : getTranslation('pause', language)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
