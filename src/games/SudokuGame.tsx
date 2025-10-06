import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface SudokuGameProps {
  onBack: () => void;
}

type Board = (number | null)[][];

const generateSudoku = (): { puzzle: Board; solution: Board } => {
  const base = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  const solution = base.map(row => [...row]);
  const puzzle = solution.map(row => row.map(() => null as number | null));

  const cellsToFill = 30;
  const positions = Array.from({ length: 81 }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, cellsToFill);

  positions.forEach(pos => {
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    puzzle[row][col] = solution[row][col];
  });

  return { puzzle, solution };
};

export const SudokuGame = ({ onBack }: SudokuGameProps) => {
  const { language } = useLanguage();
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [board, setBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const initializeGame = () => {
    const { puzzle, solution: sol } = generateSudoku();
    setInitialBoard(puzzle.map(row => [...row]));
    setBoard(puzzle);
    setSolution(sol);
    setSelectedCell(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row]?.[col] !== null) return;
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialBoard[row][col] !== null) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
  };

  const handleClear = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (initialBoard[row][col] !== null) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = null;
    setBoard(newBoard);
  };

  const checkWin = () => {
    return board.every((row, i) =>
      row.every((cell, j) => cell === solution[i][j])
    );
  };

  const isWon = checkWin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation('backToHome', language)}
          </button>

          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {getTranslation('restart', language)}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="inline-block bg-slate-900 p-2 rounded-lg">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`w-12 h-12 flex items-center justify-center font-bold text-lg transition-all
                        ${initialBoard[rowIndex][colIndex] !== null ? 'bg-slate-200 text-slate-900' : 'bg-white hover:bg-blue-50'}
                        ${selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex ? 'ring-2 ring-blue-500' : ''}
                        ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-slate-900' : 'border-r border-slate-300'}
                        ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-slate-900' : 'border-b border-slate-300'}
                        ${cell && cell !== solution[rowIndex][colIndex] ? 'text-red-500' : ''}
                      `}
                    >
                      {cell || ''}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-md"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all shadow-md"
            >
              ✕
            </button>
          </div>

          {isWon && (
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600">
                Congratulations! You solved it!
              </div>
            </div>
          )}

          <div className="text-center text-slate-600">
            <p>Click a cell and select a number to fill it</p>
          </div>
        </div>
      </div>
    </div>
  );
};
