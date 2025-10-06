export interface Game {
  id: string;
  name: string;
  nameTranslations: Record<string, string>;
  description: string;
  descriptionTranslations: Record<string, string>;
  category: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  players: string;
}

export type Language = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja';

export interface Translations {
  [key: string]: Record<Language, string>;
}
