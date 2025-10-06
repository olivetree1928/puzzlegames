import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface NumberPuzzleGameProps {
  onBack: () => void;
}

const SIZE = 4;
const TILE_COUNT = SIZE * SIZE - 1;

const createSolvedPuzzle = (): number[] => {
  return [...Array(TILE_COUNT).keys()].map(i => i + 1).concat([0]);
};

const shufflePuzzle = (puzzle: number[]): number[] => {
  const shuffled = [...puzzle];
  for (let i = 0; i < 1000; i++) {
    const emptyIndex = shuffled.indexOf(0);
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / SIZE);
    const col = emptyIndex % SIZE;

    if (row > 0) moves.push(emptyIndex - SIZE);
    if (row < SIZE - 1) moves.push(emptyIndex + SIZE);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < SIZE - 1) moves.push(emptyIndex + 1);

    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
  }
  return shuffled;
};

export const NumberPuzzleGame = ({ onBack }: NumberPuzzleGameProps) => {
  const { language } = useLanguage();
  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const initGame = () => {
    setPuzzle(shufflePuzzle(createSolvedPuzzle()));
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const canMove = (index: number): boolean => {
    const emptyIndex = puzzle.indexOf(0);
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;

    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  const handleTileClick = (index: number) => {
    if (!canMove(index) || won) return;

    const emptyIndex = puzzle.indexOf(0);
    const newPuzzle = [...puzzle];
    [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
    setPuzzle(newPuzzle);
    setMoves(moves + 1);

    const solved = newPuzzle.slice(0, -1).every((num, i) => num === i + 1);
    if (solved) setWon(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation('backToHome', language)}
          </button>

          <div className="text-xl font-bold text-slate-800">
            Moves: {moves}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="inline-block bg-slate-700 p-2 rounded-lg" style={{ width: SIZE * 100 + 8 }}>
              <div className="grid grid-cols-4 gap-2">
                {puzzle.map((num, index) => (
                  <button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    disabled={num === 0}
                    className={`w-24 h-24 rounded-lg font-bold text-3xl transition-all
                      ${num === 0 ? 'bg-slate-700 cursor-default' :
                        canMove(index) ? 'bg-rose-500 hover:bg-rose-600 text-white cursor-pointer shadow-lg' :
                        'bg-rose-300 text-white cursor-not-allowed'}
                    `}
                  >
                    {num || ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {won && (
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600 mb-4">
                Congratulations!
              </div>
              <div className="text-xl text-slate-700">
                Solved in {moves} moves!
              </div>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <button
              onClick={initGame}
              className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {getTranslation('restart', language)}
            </button>
          </div>

          <div className="text-center text-slate-600">
            <p>Click tiles adjacent to the empty space to move them</p>
            <p>Arrange numbers 1-15 in order</p>
          </div>
        </div>
      </div>
    </div>
  );
};
