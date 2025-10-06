import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface TicTacToeGameProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

const checkWinner = (board: Board): Player => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const minimax = (board: Board, isMaximizing: boolean): number => {
  const winner = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (!board.includes(null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
};

const getBestMove = (board: Board): number => {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

export const TicTacToeGame = ({ onBack }: TicTacToeGameProps) => {
  const { language } = useLanguage();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    if (!newBoard.includes(null)) {
      setIsDraw(true);
      return;
    }

    setIsPlayerTurn(false);

    setTimeout(() => {
      const aiMove = getBestMove(newBoard);
      if (aiMove !== -1) {
        newBoard[aiMove] = 'O';
        setBoard(newBoard);

        const aiWinner = checkWinner(newBoard);
        if (aiWinner) {
          setWinner(aiWinner);
        } else if (!newBoard.includes(null)) {
          setIsDraw(true);
        }
      }
      setIsPlayerTurn(true);
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
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
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {getTranslation('restart', language)}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              {winner ? `${winner} Wins!` : isDraw ? "It's a Draw!" : `${isPlayerTurn ? 'Your' : 'AI'} Turn (${isPlayerTurn ? 'X' : 'O'})`}
            </h2>
          </div>

          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-2 bg-slate-700 p-2 rounded-lg">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="w-24 h-24 bg-white rounded-lg font-bold text-5xl flex items-center justify-center hover:bg-slate-50 transition-all"
                  style={{
                    color: cell === 'X' ? '#3b82f6' : '#ef4444'
                  }}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-slate-600">
            <p>Play against AI</p>
            <p>You are X, AI is O</p>
          </div>
        </div>
      </div>
    </div>
  );
};
