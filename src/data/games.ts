import { Game } from '../types';

export const games: Game[] = [
  {
    id: 'snake',
    name: 'Snake',
    nameTranslations: {
      en: 'Snake',
      zh: '贪吃蛇',
      es: 'Serpiente',
      fr: 'Serpent',
      de: 'Schlange',
      ja: 'スネーク'
    },
    description: 'Classic snake game - eat food and grow longer',
    descriptionTranslations: {
      en: 'Classic snake game - eat food and grow longer',
      zh: '经典贪吃蛇游戏 - 吃食物变长',
      es: 'Juego clásico de serpiente - come y crece',
      fr: 'Jeu de serpent classique - mangez et grandissez',
      de: 'Klassisches Schlangenspiel - essen und wachsen',
      ja: 'クラシックスネークゲーム - 食べて成長'
    },
    category: 'classic',
    icon: '🐍',
    difficulty: 'easy',
    players: '1'
  },
  {
    id: 'tetris',
    name: 'Tetris',
    nameTranslations: {
      en: 'Tetris',
      zh: '俄罗斯方块',
      es: 'Tetris',
      fr: 'Tetris',
      de: 'Tetris',
      ja: 'テトリス'
    },
    description: 'Arrange falling blocks to clear lines',
    descriptionTranslations: {
      en: 'Arrange falling blocks to clear lines',
      zh: '排列下落的方块以消除行',
      es: 'Organiza bloques cayendo para limpiar líneas',
      fr: 'Organisez les blocs qui tombent pour effacer les lignes',
      de: 'Ordnen Sie fallende Blöcke an, um Linien zu löschen',
      ja: '落ちるブロックを配置してラインを消す'
    },
    category: 'classic',
    icon: '🎮',
    difficulty: 'medium',
    players: '1'
  },
  {
    id: '2048',
    name: '2048',
    nameTranslations: {
      en: '2048',
      zh: '2048',
      es: '2048',
      fr: '2048',
      de: '2048',
      ja: '2048'
    },
    description: 'Combine tiles to reach 2048',
    descriptionTranslations: {
      en: 'Combine tiles to reach 2048',
      zh: '合并方块达到2048',
      es: 'Combina fichas para alcanzar 2048',
      fr: 'Combinez des tuiles pour atteindre 2048',
      de: 'Kombiniere Kacheln, um 2048 zu erreichen',
      ja: 'タイルを組み合わせて2048に到達'
    },
    category: 'puzzle',
    icon: '🔢',
    difficulty: 'medium',
    players: '1'
  },
  {
    id: 'memory',
    name: 'Memory Match',
    nameTranslations: {
      en: 'Memory Match',
      zh: '记忆配对',
      es: 'Memoria',
      fr: 'Jeu de Mémoire',
      de: 'Memory-Spiel',
      ja: '記憶ゲーム'
    },
    description: 'Find matching pairs of cards',
    descriptionTranslations: {
      en: 'Find matching pairs of cards',
      zh: '找到匹配的卡片对',
      es: 'Encuentra parejas de cartas iguales',
      fr: 'Trouvez des paires de cartes identiques',
      de: 'Finden Sie passende Kartenpaare',
      ja: '一致するカードのペアを見つける'
    },
    category: 'memory',
    icon: '🧠',
    difficulty: 'easy',
    players: '1'
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    nameTranslations: {
      en: 'Sudoku',
      zh: '数独',
      es: 'Sudoku',
      fr: 'Sudoku',
      de: 'Sudoku',
      ja: '数独'
    },
    description: 'Fill the grid with numbers 1-9',
    descriptionTranslations: {
      en: 'Fill the grid with numbers 1-9',
      zh: '用1-9的数字填满网格',
      es: 'Llena la cuadrícula con números del 1 al 9',
      fr: 'Remplissez la grille avec les chiffres 1-9',
      de: 'Füllen Sie das Raster mit den Zahlen 1-9',
      ja: '1-9の数字でグリッドを埋める'
    },
    category: 'logic',
    icon: '🔢',
    difficulty: 'hard',
    players: '1'
  },
  {
    id: 'maze',
    name: 'Maze Runner',
    nameTranslations: {
      en: 'Maze Runner',
      zh: '迷宫探险',
      es: 'Laberinto',
      fr: 'Labyrinthe',
      de: 'Labyrinth',
      ja: '迷路'
    },
    description: 'Navigate through complex mazes',
    descriptionTranslations: {
      en: 'Navigate through complex mazes',
      zh: '穿越复杂的迷宫',
      es: 'Navega por laberintos complejos',
      fr: 'Naviguez dans des labyrinthes complexes',
      de: 'Navigieren Sie durch komplexe Labyrinthe',
      ja: '複雑な迷路を進む'
    },
    category: 'puzzle',
    icon: '🌀',
    difficulty: 'medium',
    players: '1'
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    nameTranslations: {
      en: 'Minesweeper',
      zh: '扫雷',
      es: 'Buscaminas',
      fr: 'Démineur',
      de: 'Minesweeper',
      ja: 'マインスイーパー'
    },
    description: 'Clear the board without hitting mines',
    descriptionTranslations: {
      en: 'Clear the board without hitting mines',
      zh: '清除棋盘上的所有地雷',
      es: 'Limpia el tablero sin tocar minas',
      fr: 'Nettoyez le plateau sans toucher les mines',
      de: 'Räumen Sie das Brett, ohne Minen zu treffen',
      ja: '地雷を踏まずにボードをクリア'
    },
    category: 'logic',
    icon: '💣',
    difficulty: 'medium',
    players: '1'
  },
  {
    id: 'tictactoe',
    name: 'Tic-Tac-Toe',
    nameTranslations: {
      en: 'Tic-Tac-Toe',
      zh: '井字棋',
      es: 'Tres en Raya',
      fr: 'Morpion',
      de: 'Tic-Tac-Toe',
      ja: '三目並べ'
    },
    description: 'Play against AI in classic tic-tac-toe',
    descriptionTranslations: {
      en: 'Play against AI in classic tic-tac-toe',
      zh: '与AI对战经典井字棋',
      es: 'Juega contra IA en tres en raya clásico',
      fr: 'Jouez contre l\'IA au morpion classique',
      de: 'Spielen Sie gegen KI im klassischen Tic-Tac-Toe',
      ja: 'AIと対戦する三目並べ'
    },
    category: 'classic',
    icon: '❌',
    difficulty: 'easy',
    players: '1'
  },
  {
    id: 'simon',
    name: 'Simon Says',
    nameTranslations: {
      en: 'Simon Says',
      zh: '西蒙说',
      es: 'Simon Dice',
      fr: 'Jacques a Dit',
      de: 'Simon sagt',
      ja: 'サイモン'
    },
    description: 'Remember and repeat color sequences',
    descriptionTranslations: {
      en: 'Remember and repeat color sequences',
      zh: '记住并重复颜色序列',
      es: 'Recuerda y repite secuencias de colores',
      fr: 'Mémorisez et répétez les séquences de couleurs',
      de: 'Merken und wiederholen Sie Farbsequenzen',
      ja: '色のシーケンスを覚えて繰り返す'
    },
    category: 'memory',
    icon: '🎨',
    difficulty: 'medium',
    players: '1'
  },
  {
    id: 'wordguess',
    name: 'Word Guess',
    nameTranslations: {
      en: 'Word Guess',
      zh: '猜单词',
      es: 'Adivina la Palabra',
      fr: 'Devinez le Mot',
      de: 'Wort Raten',
      ja: '単語当て'
    },
    description: 'Guess the hidden word in 6 tries',
    descriptionTranslations: {
      en: 'Guess the hidden word in 6 tries',
      zh: '在6次尝试中猜出隐藏的单词',
      es: 'Adivina la palabra oculta en 6 intentos',
      fr: 'Devinez le mot caché en 6 essais',
      de: 'Erraten Sie das versteckte Wort in 6 Versuchen',
      ja: '6回の試行で隠された単語を当てる'
    },
    category: 'puzzle',
    icon: '📝',
    difficulty: 'medium',
    players: '1'
  },
  {
    id: 'numberpuzzle',
    name: '15 Puzzle',
    nameTranslations: {
      en: '15 Puzzle',
      zh: '15拼图',
      es: 'Puzzle de 15',
      fr: 'Puzzle 15',
      de: '15-Puzzle',
      ja: '15パズル'
    },
    description: 'Slide tiles to arrange numbers in order',
    descriptionTranslations: {
      en: 'Slide tiles to arrange numbers in order',
      zh: '滑动瓷砖按顺序排列数字',
      es: 'Desliza las fichas para ordenar los números',
      fr: 'Faites glisser les tuiles pour ranger les numéros',
      de: 'Schieben Sie Kacheln, um Zahlen zu ordnen',
      ja: 'タイルをスライドして数字を並べる'
    },
    category: 'puzzle',
    icon: '🔢',
    difficulty: 'medium',
    players: '1'
  }
];
