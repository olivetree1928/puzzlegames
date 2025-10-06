import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {getTranslation(category, language)}
        </button>
      ))}
    </div>
  );
};
