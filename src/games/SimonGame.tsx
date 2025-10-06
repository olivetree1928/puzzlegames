import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface SimonGameProps {
  onBack: () => void;
}

const COLORS = [
  { id: 0, color: '#22c55e', activeColor: '#86efac', name: 'green' },
  { id: 1, color: '#ef4444', activeColor: '#fca5a5', name: 'red' },
  { id: 2, color: '#eab308', activeColor: '#fde047', name: 'yellow' },
  { id: 3, color: '#3b82f6', activeColor: '#93c5fd', name: 'blue' }
];

export const SimonGame = ({ onBack }: SimonGameProps) => {
  const { language } = useLanguage();
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);

  const playSound = (colorId: number) => {
    const frequencies = [329.63, 261.63, 293.66, 349.23];
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[colorId];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    for (const colorId of seq) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(colorId);
      playSound(colorId);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    setIsShowingSequence(false);
  };

  const startGame = () => {
    const firstColor = Math.floor(Math.random() * 4);
    setSequence([firstColor]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    showSequence([firstColor]);
  };

  const handleColorClick = (colorId: number) => {
    if (!isPlaying || isShowingSequence || gameOver) return;

    setActiveButton(colorId);
    playSound(colorId);
    setTimeout(() => setActiveButton(null), 200);

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    if (colorId !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(sequence.length);
      setPlayerSequence([]);

      setTimeout(() => {
        const nextColor = Math.floor(Math.random() * 4);
        const newSequence = [...sequence, nextColor];
        setSequence(newSequence);
        showSequence(newSequence);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-100 p-8">
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
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-2 gap-4 w-96 h-96">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorClick(color.id)}
                  disabled={!isPlaying || isShowingSequence}
                  className="rounded-lg transition-all shadow-lg hover:scale-105 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: activeButton === color.id ? color.activeColor : color.color,
                    opacity: activeButton === color.id ? 1 : 0.8
                  }}
                />
              ))}
            </div>
          </div>

          {!isPlaying && !gameOver && (
            <div className="flex justify-center mb-6">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-violet-600 text-white font-semibold text-xl rounded-lg hover:bg-violet-700 transition-all flex items-center gap-3 shadow-lg"
              >
                <Play className="w-6 h-6" />
                Start Game
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-red-600 mb-4">
                {getTranslation('gameOver', language)}
              </div>
              <div className="text-xl text-slate-700 mb-6">
                Final {getTranslation('score', language)}: {score}
              </div>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-all flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                {getTranslation('restart', language)}
              </button>
            </div>
          )}

          <div className="text-center text-slate-600">
            <p>Watch the sequence and repeat it</p>
            <p>The sequence gets longer each round!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
