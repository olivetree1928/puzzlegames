import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface Game2048Props {
  onBack: () => void;
}

const SIZE = 4;
const CELL_SIZE = 100;

type Board = number[][];

const createEmptyBoard = (): Board => Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));

const addRandomTile = (board: Board): Board => {
  const emptyCells: [number, number][] = [];
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) emptyCells.push([y, x]);
    });
  });

  if (emptyCells.length > 0) {
    const [y, x] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }
  return board;
};

const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
  };
  return colors[value] || '#3c3a32';
};

export const Game2048 = ({ onBack }: Game2048Props) => {
  const { language } = useLanguage();
  const [board, setBoard] = useState<Board>(() => {
    const initial = createEmptyBoard();
    return addRandomTile(addRandomTile(initial));
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    let newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const slide = (row: number[]): number[] => {
      const filtered = row.filter(cell => cell !== 0);
      const merged: number[] = [];

      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < SIZE) {
        merged.push(0);
      }

      return merged;
    };

    if (direction === 'left') {
      newBoard = newBoard.map(row => {
        const newRow = slide(row);
        if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
        return newRow;
      });
    } else if (direction === 'right') {
      newBoard = newBoard.map(row => {
        const reversed = slide([...row].reverse());
        const newRow = reversed.reverse();
        if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
        return newRow;
      });
    } else if (direction === 'up') {
      for (let x = 0; x < SIZE; x++) {
        const column = newBoard.map(row => row[x]);
        const newColumn = slide(column);
        if (JSON.stringify(column) !== JSON.stringify(newColumn)) moved = true;
        newColumn.forEach((val, y) => {
          newBoard[y][x] = val;
        });
      }
    } else if (direction === 'down') {
      for (let x = 0; x < SIZE; x++) {
        const column = newBoard.map(row => row[x]);
        const reversed = slide([...column].reverse());
        const newColumn = reversed.reverse();
        if (JSON.stringify(column) !== JSON.stringify(newColumn)) moved = true;
        newColumn.forEach((val, y) => {
          newBoard[y][x] = val;
        });
      }
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
    }
  }, [board, score]);

  const resetGame = () => {
    const initial = createEmptyBoard();
    setBoard(addRandomTile(addRandomTile(initial)));
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, gameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
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
              className="relative bg-slate-700 rounded-lg p-2 gap-2 grid grid-cols-4"
              style={{ width: SIZE * CELL_SIZE + 24, height: SIZE * CELL_SIZE + 24 }}
            >
              {board.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="rounded-lg flex items-center justify-center font-bold shadow-md transition-all"
                    style={{
                      width: CELL_SIZE - 8,
                      height: CELL_SIZE - 8,
                      backgroundColor: cell ? getTileColor(cell) : '#cdc1b4',
                      color: cell > 4 ? '#f9f6f2' : '#776e65',
                      fontSize: cell >= 1024 ? '32px' : cell >= 128 ? '40px' : '48px'
                    }}
                  >
                    {cell !== 0 && cell}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {getTranslation('restart', language)}
            </button>
          </div>

          <div className="text-center text-slate-600">
            <p>Use arrow keys to move tiles</p>
            <p>Combine tiles to reach 2048!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
