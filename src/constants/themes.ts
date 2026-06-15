import { Theme, ThemeColors } from '@/types/habit';

export const THEMES: Record<Theme, ThemeColors> = {
  light: {
    isLight: true,
    gradient: ['#0f172a', '#1e293b'],
    primary: '#0f172a',
    accent: '#10b981',
    accentAlt: '#f59e0b',
    bg: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    light: '#94a3b8',
    border: '#e2e8f0',
  },
  dark: {
    isLight: false,
    gradient: ['#252525', '#1a1a1a'],
    primary: '#d4721a',
    accent: '#d4721a',
    accentAlt: '#e09b5a',
    bg: '#1a1a1a',
    card: '#252525',
    text: '#ececec',
    light: '#888888',
    border: '#333333',
  },
  rose: {
    isLight: true,
    gradient: ['#881337', '#9f1239'],
    primary: '#881337',
    accent: '#db2777',
    accentAlt: '#a855f7',
    bg: '#fdf2f8',
    card: '#ffffff',
    text: '#1a0a12',
    light: '#c084b8',
    border: '#fce7f3',
  },
};

export const THEME_NAMES: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  rose: 'Rosa',
};

export const THEME_COLORS_PREVIEW: Record<Theme, [string, string]> = {
  light: ['#ffffff', '#0f172a'],
  dark: ['#1a1a1a', '#d4721a'],
  rose: ['#fdf2f8', '#881337'],
};
