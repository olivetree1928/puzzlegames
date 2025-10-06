import { Translations, Language } from '../types';

export const translations: Translations = {
  title: {
    en: 'Puzzle Games Portal',
    zh: '益智游戏门户',
    es: 'Portal de Juegos de Puzzle',
    fr: 'Portail de Jeux de Réflexion',
    de: 'Puzzle-Spiele-Portal',
    ja: 'パズルゲームポータル'
  },
  subtitle: {
    en: 'Play multiple free puzzle games',
    zh: '免费玩多款益智游戏',
    es: 'Juega múltiples juegos de puzzle gratis',
    fr: 'Jouez à plusieurs jeux gratuits',
    de: 'Spielen Sie mehrere kostenlose Puzzle-Spiele',
    ja: '複数の無料パズルゲームを楽しもう'
  },
  allGames: {
    en: 'All Games',
    zh: '全部游戏',
    es: 'Todos los Juegos',
    fr: 'Tous les Jeux',
    de: 'Alle Spiele',
    ja: '全てのゲーム'
  },
  classic: {
    en: 'Classic',
    zh: '经典',
    es: 'Clásico',
    fr: 'Classique',
    de: 'Klassisch',
    ja: 'クラシック'
  },
  puzzle: {
    en: 'Puzzle',
    zh: '拼图',
    es: 'Rompecabezas',
    fr: 'Puzzle',
    de: 'Puzzle',
    ja: 'パズル'
  },
  logic: {
    en: 'Logic',
    zh: '逻辑',
    es: 'Lógica',
    fr: 'Logique',
    de: 'Logik',
    ja: 'ロジック'
  },
  memory: {
    en: 'Memory',
    zh: '记忆',
    es: 'Memoria',
    fr: 'Mémoire',
    de: 'Gedächtnis',
    ja: 'メモリ'
  },
  backToHome: {
    en: 'Back to Home',
    zh: '返回首页',
    es: 'Volver al Inicio',
    fr: 'Retour à l\'Accueil',
    de: 'Zurück zur Startseite',
    ja: 'ホームに戻る'
  },
  playNow: {
    en: 'Play Now',
    zh: '立即游玩',
    es: 'Jugar Ahora',
    fr: 'Jouer Maintenant',
    de: 'Jetzt Spielen',
    ja: '今すぐプレイ'
  },
  difficulty: {
    en: 'Difficulty',
    zh: '难度',
    es: 'Dificultad',
    fr: 'Difficulté',
    de: 'Schwierigkeit',
    ja: '難易度'
  },
  easy: {
    en: 'Easy',
    zh: '简单',
    es: 'Fácil',
    fr: 'Facile',
    de: 'Einfach',
    ja: '簡単'
  },
  medium: {
    en: 'Medium',
    zh: '中等',
    es: 'Medio',
    fr: 'Moyen',
    de: 'Mittel',
    ja: '中級'
  },
  hard: {
    en: 'Hard',
    zh: '困难',
    es: 'Difícil',
    fr: 'Difficile',
    de: 'Schwer',
    ja: '難しい'
  },
  score: {
    en: 'Score',
    zh: '得分',
    es: 'Puntuación',
    fr: 'Score',
    de: 'Punktzahl',
    ja: 'スコア'
  },
  gameOver: {
    en: 'Game Over',
    zh: '游戏结束',
    es: 'Juego Terminado',
    fr: 'Jeu Terminé',
    de: 'Spiel Vorbei',
    ja: 'ゲームオーバー'
  },
  restart: {
    en: 'Restart',
    zh: '重新开始',
    es: 'Reiniciar',
    fr: 'Recommencer',
    de: 'Neustart',
    ja: '再スタート'
  },
  pause: {
    en: 'Pause',
    zh: '暂停',
    es: 'Pausa',
    fr: 'Pause',
    de: 'Pause',
    ja: '一時停止'
  },
  resume: {
    en: 'Resume',
    zh: '继续',
    es: 'Reanudar',
    fr: 'Reprendre',
    de: 'Fortsetzen',
    ja: '再開'
  }
};

export const getTranslation = (key: string, lang: Language): string => {
  return translations[key]?.[lang] || translations[key]?.en || key;
};
