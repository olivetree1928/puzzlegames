import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface WordGuessGameProps {
  onBack: () => void;
}

const WORDS = [
  'PUZZLE', 'GAMES', 'BRAIN', 'LOGIC', 'SMART', 'THINK', 'SOLVE', 'PLAY',
  'CHESS', 'BLOCK', 'BOARD', 'CARDS', 'MAZE', 'PATH', 'WIN'
];

export const WordGuessGame = ({ onBack }: WordGuessGameProps) => {
  const { language } = useLanguage();
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const maxGuesses = 6;

  const initGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length === word.length) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);

        if (currentGuess === word) {
          setWon(true);
          setGameOver(true);
        } else if (newGuesses.length >= maxGuesses) {
          setGameOver(true);
        }

        setCurrentGuess('');
      }
    } else if (key === 'BACK') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < word.length && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const getLetterStatus = (letter: string, index: number, guess: string) => {
    if (guess[index] === word[index]) return 'correct';
    if (word.includes(letter)) return 'present';
    return 'absent';
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8">
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
            onClick={initGame}
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {getTranslation('restart', language)}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Word Guess</h2>
            <p className="text-center text-slate-600">Guess the {word.length}-letter word</p>
          </div>

          <div className="flex flex-col gap-2 mb-8 max-w-md mx-auto">
            {Array.from({ length: maxGuesses }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {Array.from({ length: word.length }).map((_, colIndex) => {
                  const guess = guesses[rowIndex];
                  const isCurrentRow = rowIndex === guesses.length;
                  const letter = guess ? guess[colIndex] : isCurrentRow ? currentGuess[colIndex] : '';
                  const status = guess ? getLetterStatus(guess[colIndex], colIndex, guess) : '';

                  return (
                    <div
                      key={colIndex}
                      className={`w-14 h-14 border-2 rounded-lg flex items-center justify-center text-2xl font-bold
                        ${status === 'correct' ? 'bg-green-500 border-green-600 text-white' :
                          status === 'present' ? 'bg-yellow-500 border-yellow-600 text-white' :
                          status === 'absent' ? 'bg-slate-400 border-slate-500 text-white' :
                          letter ? 'border-slate-400' : 'border-slate-300'}
                      `}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {gameOver && (
            <div className="text-center mb-8">
              <div className={`text-3xl font-bold mb-2 ${won ? 'text-green-600' : 'text-red-600'}`}>
                {won ? 'Congratulations!' : getTranslation('gameOver', language)}
              </div>
              {!won && <div className="text-xl text-slate-700">The word was: {word}</div>}
            </div>
          )}

          <div className="flex flex-col gap-2 max-w-2xl mx-auto">
            {keyboard.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {row.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`${key === 'ENTER' || key === 'BACK' ? 'px-4' : 'w-10'} h-12 bg-slate-300 hover:bg-slate-400 rounded font-semibold text-sm transition-all`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
