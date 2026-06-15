import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { Completion, Habit, RollingWindow, WindowSize } from '@/types/habit';
import { getExpectedDays, getLocalDateStr, getToday } from '@/utils/dates';

const STORAGE_KEY = '@racha_habits';

async function persistHabits(habits: Habit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('[useHabits] Failed to save:', e);
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed: Habit[] = JSON.parse(raw);
          setHabits(
            parsed.map((h) => ({
              ...h,
              frequency: h.frequency ?? 7,
              graceDates: h.graceDates ?? [],
            })),
          );
        }
      })
      .catch((e) => console.error('[useHabits] Failed to load:', e))
      .finally(() => setLoading(false));
  }, []);

  const addHabit = useCallback((name: string, frequency: number, category?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      completions: [],
      frequency,
      graceDates: [],
      category,
    };
    setHabits((prev) => {
      const next = [...prev, newHabit];
      void persistHabits(next);
      return next;
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => {
      const next = prev.filter((h) => h.id !== id);
      void persistHabits(next);
      return next;
    });
  }, []);

  const toggleDay = useCallback((habitId: string, dateStr: string) => {
    setHabits((prev) => {
      const next = prev.map((h) => {
        if (h.id !== habitId) return h;
        const alreadyDone = h.completions.some((c) => c.date === dateStr);
        const completions: Completion[] = alreadyDone
          ? h.completions.filter((c) => c.date !== dateStr)
          : [...h.completions, { date: dateStr }];
        return { ...h, completions };
      });
      void persistHabits(next);
      return next;
    });
  }, []);

  const addGraceDay = useCallback((habitId: string, dateStr: string) => {
    setHabits((prev) => {
      const next = prev.map((h) => {
        if (h.id !== habitId) return h;
        if (h.graceDates.includes(dateStr)) return h;
        const dateObj = new Date(dateStr + 'T00:00:00');
        const weekStart = new Date(dateObj);
        weekStart.setDate(dateObj.getDate() - 6);
        const gracesThisWeek = h.graceDates.filter((d) => {
          const gd = new Date(d + 'T00:00:00');
          return gd >= weekStart && gd <= dateObj;
        });
        if (gracesThisWeek.length >= 1) return h;
        return { ...h, graceDates: [...h.graceDates, dateStr] };
      });
      void persistHabits(next);
      return next;
    });
  }, []);

  // Notifications: stored locally but scheduling requires a new build with
  // expo-notifications native module compiled in.
  const setNotification = useCallback(async (habitId: string, time: string | null) => {
    setHabits((prev) => {
      const next = prev.map((h) =>
        h.id === habitId
          ? { ...h, notificationTime: time ?? undefined, notificationId: undefined }
          : h,
      );
      void persistHabits(next);
      return next;
    });
  }, []);

  const getStreak = useCallback((habit: Habit): number => {
    const today = getToday();
    const todayStr = getLocalDateStr(today);
    const todayDone =
      habit.completions.some((c) => c.date === todayStr) ||
      habit.graceDates.includes(todayStr);

    const checkDate = new Date(today);
    if (!todayDone) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    let streak = 0;
    while (true) {
      const dateStr = getLocalDateStr(checkDate);
      const done =
        habit.completions.some((c) => c.date === dateStr) ||
        habit.graceDates.includes(dateStr);
      if (!done) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  }, []);

  const getRollingWindow = useCallback((habit: Habit, days: WindowSize): RollingWindow => {
    const today = getToday();
    const windowStart = new Date(today);
    windowStart.setDate(today.getDate() - days + 1);
    windowStart.setHours(0, 0, 0, 0);

    const completed = habit.completions.filter((c) => {
      const d = new Date(c.date + 'T00:00:00');
      return d >= windowStart && d <= today;
    }).length;

    const total = getExpectedDays(days, habit.frequency);
    const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    return { completed, total, percentage };
  }, []);

  const getStats = useCallback(
    (windowSize: WindowSize) => {
      const todayStr = getLocalDateStr(getToday());
      const todayCompleted = habits.filter((h) =>
        h.completions.some((c) => c.date === todayStr),
      ).length;

      const maxStreak =
        habits.length > 0 ? Math.max(...habits.map((h) => getStreak(h))) : 0;

      let totalCompleted = 0;
      let totalExpected = 0;
      habits.forEach((h) => {
        const r = getRollingWindow(h, windowSize);
        totalCompleted += r.completed;
        totalExpected += r.total;
      });
      const overallPercentage =
        totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;

      return { todayCompleted, maxStreak, overallPercentage };
    },
    [habits, getStreak, getRollingWindow],
  );

  return {
    habits,
    loading,
    addHabit,
    deleteHabit,
    toggleDay,
    addGraceDay,
    setNotification,
    getStreak,
    getRollingWindow,
    getStats,
  };
}
