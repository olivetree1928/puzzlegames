import { Play } from 'lucide-react';
import { Game } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

export const GameCard = ({ game, onPlay }: GameCardProps) => {
  const { language } = useLanguage();

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
          {game.icon}
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {game.nameTranslations[language]}
        </h3>

        <p className="text-sm text-slate-600 mb-4 h-12">
          {game.descriptionTranslations[language]}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[game.difficulty]}`}>
            {getTranslation(game.difficulty, language)}
          </span>
        </div>

        <button
          onClick={() => onPlay(game.id)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Play className="w-5 h-5" />
          {getTranslation('playNow', language)}
        </button>
      </div>
    </div>
  );
};
