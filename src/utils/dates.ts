import { WindowSize } from '@/types/habit';

export const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'] as const;

export function getLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDatesInWindow(days: WindowSize, createdAtStr: string): Date[] {
  const today = getToday();
  const [y, mo, d] = createdAtStr.split('T')[0].split('-').map(Number);
  const createdAt = new Date(y, mo - 1, d);
  createdAt.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    if (date >= createdAt) dates.push(date);
  }
  return dates;
}

export function getExpectedDays(windowDays: WindowSize, frequency: number): number {
  return Math.round((windowDays / 7) * frequency);
}
