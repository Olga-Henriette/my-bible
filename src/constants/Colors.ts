const palette = {
  brown900: '#2C1810',
  brown700: '#5C3317',
  brown500: '#8B4513',
  brown300: '#C4956A',
  brown100: '#E8D5B7',

  cream100: '#FFFEF7',
  cream200: '#FDF8EC',
  cream300: '#F5F0E8',
  cream400: '#EDE5D0',

  // Accent
  gold: '#D4A853',
  goldLight: '#F0D080',
  highlight: '#FFF176',

  // Neutres
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray300: '#CCCCCC',
  gray500: '#888888',
  gray700: '#444444',
  gray900: '#1A1A1A',

  // Sémantiques
  error: '#C0392B',
  success: '#27AE60',
};

export const Colors = {
  light: {
    // Fonds
    background: palette.cream300,
    surface: palette.cream200,
    card: palette.cream100,

    // Textes
    text: palette.brown900,
    textSecondary: palette.brown500,
    textMuted: palette.gray500,

    // UI
    primary: palette.brown500,
    primaryLight: palette.brown300,
    border: palette.cream400,
    separator: palette.brown100,

    // Tab bar
    tabBarBackground: palette.brown900,
    tabBarActive: palette.gold,
    tabBarInactive: palette.brown300,

    // Verset
    verseNumber: palette.brown300,
    verseText: palette.brown900,
    verseHighlight: palette.highlight,
    verseBookmark: '#FFF9C4',

    // Icônes
    icon: palette.brown500,
    iconActive: palette.gold,
  },

  dark: {
    background: palette.gray900,
    surface: '#2A2A2A',
    card: '#333333',

    text: '#F0E6D3',
    textSecondary: palette.brown300,
    textMuted: palette.gray300,

    primary: palette.gold,
    primaryLight: palette.brown300,
    border: '#3A3A3A',
    separator: '#3A3A3A',

    tabBarBackground: '#1A1510',
    tabBarActive: palette.gold,
    tabBarInactive: palette.brown300,

    verseNumber: palette.brown300,
    verseText: '#F0E6D3',
    verseHighlight: '#5C4A00',
    verseBookmark: '#3A3000',

    icon: palette.brown300,
    iconActive: palette.gold,
  },

  sepia: {
    background: '#F4ECD8',
    surface: '#EDE0C4',
    card: '#FAF3E0',

    text: '#3B2A1A',
    textSecondary: '#7B5A3A',
    textMuted: '#9A7A5A',

    primary: palette.brown500,
    primaryLight: palette.brown300,
    border: '#D4C4A0',
    separator: '#D4C4A0',

    tabBarBackground: '#3B2A1A',
    tabBarActive: palette.gold,
    tabBarInactive: '#C4A882',

    verseNumber: '#C4A882',
    verseText: '#3B2A1A',
    verseHighlight: '#EDD87A',
    verseBookmark: '#EEE0A0',

    icon: '#7B5A3A',
    iconActive: palette.gold,
  },
};

export type ThemeColors = typeof Colors.light;
export type Theme = keyof typeof Colors;