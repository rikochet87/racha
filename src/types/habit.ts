export type Theme = 'light' | 'dark' | 'rose';
export type WindowSize = 7 | 14 | 30;
export interface Completion { date: string; }
export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  completions: Completion[];
  frequency: number;
  graceDates: string[];
  notificationId?: string;
  notificationTime?: string; // "HH:MM"
  category?: string;
}
export interface RollingWindow { completed: number; total: number; percentage: number; }
export interface ThemeColors {
  isLight: boolean;
  gradient: [string, string];
  primary: string;
  accent: string;
  accentAlt: string;
  bg: string;
  card: string;
  text: string;
  light: string;
  border: string;
}
