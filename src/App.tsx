import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { CategoryFilter } from './components/CategoryFilter';
import { GameCard } from './components/GameCard';
import { SnakeGame } from './games/SnakeGame';
import { TetrisGame } from './games/TetrisGame';
import { Game2048 } from './games/Game2048';
import { MemoryGame } from './games/MemoryGame';
import { SudokuGame } from './games/SudokuGame';
import { MazeGame } from './games/MazeGame';
import { MinesweeperGame } from './games/MinesweeperGame';
import { TicTacToeGame } from './games/TicTacToeGame';
import { SimonGame } from './games/SimonGame';
import { WordGuessGame } from './games/WordGuessGame';
import { NumberPuzzleGame } from './games/NumberPuzzleGame';
import { games } from './data/games';
import { useLanguage } from './context/LanguageContext';
import { getTranslation } from './i18n/translations';
import { Gamepad2 } from 'lucide-react';

const categories = ['allGames', 'classic', 'puzzle', 'logic', 'memory'];

function GamePortal() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('allGames');
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const filteredGames = selectedCategory === 'allGames'
    ? games
    : games.filter(game => game.category === selectedCategory);

  if (currentGame === 'snake') return <SnakeGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'tetris') return <TetrisGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === '2048') return <Game2048 onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'memory') return <MemoryGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'sudoku') return <SudokuGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'maze') return <MazeGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'minesweeper') return <MinesweeperGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'tictactoe') return <TicTacToeGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'simon') return <SimonGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'wordguess') return <WordGuessGame onBack={() => setCurrentGame(null)} />;
  if (currentGame === 'numberpuzzle') return <NumberPuzzleGame onBack={() => setCurrentGame(null)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Gamepad2 className="w-12 h-12 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                {getTranslation('title', language)}
              </h1>
              <p className="text-lg text-slate-600 mt-1">
                {getTranslation('subtitle', language)}
              </p>
            </div>
          </div>
          <LanguageSelector />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={setCurrentGame}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center text-slate-500 text-xl mt-12">
            No games found in this category
          </div>
        )}
      </div>
      <footer className="bg-slate-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Games Portal - All rights reserved</p>
          <p className="text-slate-400 mt-2">A collection of classic and modern browser games</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <GamePortal />
    </LanguageProvider>
  );
}

export default App;
