import { useState } from 'react';
import { ArrowLeft, RotateCcw, Flag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface MinesweeperGameProps {
  onBack: () => void;
}

const GRID_SIZE = 10;
const MINES_COUNT = 15;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type Board = Cell[][];

const createBoard = (): Board => {
  const board: Board = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < MINES_COUNT) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!board[y][x].isMine) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!board[y][x].isMine) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE && board[ny][nx].isMine) {
              count++;
            }
          }
        }
        board[y][x].neighborMines = count;
      }
    }
  }

  return board;
};

export const MinesweeperGame = ({ onBack }: MinesweeperGameProps) => {
  const { language } = useLanguage();
  const [board, setBoard] = useState<Board>(createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const revealCell = (x: number, y: number) => {
    if (gameOver || won || board[y][x].isFlagged || board[y][x].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[y][x].isMine) {
      newBoard.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const reveal = (x: number, y: number) => {
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
      if (newBoard[y][x].isRevealed || newBoard[y][x].isFlagged || newBoard[y][x].isMine) return;

      newBoard[y][x].isRevealed = true;

      if (newBoard[y][x].neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            reveal(x + dx, y + dy);
          }
        }
      }
    };

    reveal(x, y);
    setBoard(newBoard);

    const allSafeCellsRevealed = newBoard.every(row =>
      row.every(cell => cell.isMine || cell.isRevealed)
    );
    if (allSafeCellsRevealed) setWon(true);
  };

  const toggleFlag = (x: number, y: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || won || board[y][x].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[y][x].isFlagged = !newBoard[y][x].isFlagged;
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
  };

  const numberColors = ['', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2', '#000', '#666'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-8">
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
            onClick={resetGame}
            className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {getTranslation('restart', language)}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="inline-block bg-slate-200 p-2 rounded-lg">
              {board.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <button
                      key={`${y}-${x}`}
                      onClick={() => revealCell(x, y)}
                      onContextMenu={(e) => toggleFlag(x, y, e)}
                      className={`w-8 h-8 border border-slate-300 font-bold text-sm flex items-center justify-center transition-all
                        ${cell.isRevealed
                          ? cell.isMine
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-50'
                          : 'bg-slate-400 hover:bg-slate-500'
                        }
                      `}
                      style={{
                        color: cell.isRevealed && !cell.isMine ? numberColors[cell.neighborMines] : undefined
                      }}
                    >
                      {cell.isFlagged ? <Flag className="w-4 h-4 text-red-600" /> :
                       cell.isRevealed ? (cell.isMine ? '💣' : cell.neighborMines || '') : ''}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {gameOver && (
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-red-600">
                {getTranslation('gameOver', language)}
              </div>
            </div>
          )}

          {won && (
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600">
                You Won!
              </div>
            </div>
          )}

          <div className="text-center text-slate-600">
            <p>Left click to reveal, right click to flag</p>
          </div>
        </div>
      </div>
    </div>
  );
};
