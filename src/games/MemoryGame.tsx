import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface MemoryGameProps {
  onBack: () => void;
}

const ICONS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻'];
const GRID_SIZE = 4;

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame = ({ onBack }: MemoryGameProps) => {
  const { language } = useLanguage();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initializeGame = () => {
    const gameIcons = [...ICONS, ...ICONS];
    const shuffled = gameIcons
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(id)) return;
    if (cards[id].isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;

      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[first].isMatched = true;
          updatedCards[second].isMatched = true;
          setCards(updatedCards);
          setMatches(m => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[first].isFlipped = false;
          updatedCards[second].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation('backToHome', language)}
          </button>

          <div className="flex gap-6">
            <div className="text-lg font-bold text-slate-800">Moves: {moves}</div>
            <div className="text-lg font-bold text-slate-800">Matches: {matches}/{ICONS.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || card.isFlipped}
                className={`aspect-square rounded-xl text-6xl flex items-center justify-center transition-all transform ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white shadow-lg'
                    : 'bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-md'
                } ${card.isMatched ? 'opacity-50' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.icon : '?'}
              </button>
            ))}
          </div>

          {matches === ICONS.length && (
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600 mb-4">
                Congratulations! You won in {moves} moves!
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {getTranslation('restart', language)}
            </button>
          </div>

          <div className="text-center text-slate-600 mt-6">
            <p>Click cards to flip them and find matching pairs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
