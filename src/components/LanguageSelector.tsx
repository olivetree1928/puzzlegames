import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
        <Languages className="w-5 h-5 text-slate-700" />
        <span className="text-sm font-medium text-slate-700">
          {languages.find(l => l.code === language)?.flag}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              language === lang.code ? 'bg-blue-50' : ''
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm font-medium text-slate-700">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
