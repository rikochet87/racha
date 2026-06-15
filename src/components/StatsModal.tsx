import React, { useMemo } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Habit, ThemeColors } from '@/types/habit';
import { getLocalDateStr, getToday } from '@/utils/dates';

function getBarColor(pct: number): string {
  if (pct >= 80) return '#10b981';
  if (pct >= 50) return '#3b82f6';
  if (pct >= 30) return '#f59e0b';
  return '#ef4444';
}

function getStreak(habit: Habit): number {
  const today = getToday();
  const todayStr = getLocalDateStr(today);
  const todayDone =
    habit.completions.some((c) => c.date === todayStr) ||
    habit.graceDates.includes(todayStr);

  const checkDate = new Date(today);
  if (!todayDone) checkDate.setDate(checkDate.getDate() - 1);

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
}

function getMonthCompletions(habit: Habit): Set<string> {
  const today = getToday();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const set = new Set<string>();
  habit.completions.forEach((c) => {
    const d = new Date(c.date + 'T00:00:00');
    if (d >= monthStart && d <= today) set.add(c.date);
  });
  habit.graceDates.forEach((d) => {
    const gd = new Date(d + 'T00:00:00');
    if (gd >= monthStart && gd <= today) set.add(d);
  });
  return set;
}

// Mini monthly calendar for a single habit
function MiniCalendar({ habit, colors }: { habit: Habit; colors: ThemeColors }) {
  const today = getToday();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const completedSet = getMonthCompletions(habit);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const cellFilledBg = colors.isLight ? colors.primary : colors.accent;
  const graceBg = '#d97706';

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 8 }}>
      {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((d) => (
        <View key={d} style={{ width: '13%', alignItems: 'center', marginBottom: 2 }}>
          <Text style={{ fontSize: 9, color: colors.light, fontWeight: '600' }}>{d}</Text>
        </View>
      ))}
      {cells.map((day, i) => {
        if (day === null) {
          return <View key={`empty-${i}`} style={{ width: '13%' }} />;
        }
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const dateStr = `${year}-${mm}-${dd}`;
        const isDone = habit.completions.some((c) => c.date === dateStr);
        const isGrace = habit.graceDates.includes(dateStr);
        const isToday = dateStr === getLocalDateStr(today);
        const bg = isDone ? cellFilledBg : isGrace ? graceBg : 'transparent';
        return (
          <View
            key={dateStr}
            style={{
              width: '13%',
              aspectRatio: 1,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: bg,
              borderWidth: isToday && !isDone && !isGrace ? 1 : 0,
              borderColor: colors.accent,
              marginBottom: 3,
            }}
          >
            <Text style={{
              fontSize: 9,
              fontWeight: isDone || isGrace ? '700' : '400',
              color: isDone || isGrace ? '#fff' : colors.text,
            }}>
              {day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

interface StatsModalProps {
  visible: boolean;
  habits: Habit[];
  colors: ThemeColors;
  onClose: () => void;
}

export function StatsModal({ visible, habits, colors, onClose }: StatsModalProps) {
  const today = getToday();

  const weekStats = useMemo(() => {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    let total = 0;
    let completed = 0;
    habits.forEach((h) => {
      h.completions.forEach((c) => {
        const d = new Date(c.date + 'T00:00:00');
        if (d >= weekStart && d <= today) completed++;
      });
      // expected = frequency/7 * 7 = frequency
      total += h.frequency;
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, pct };
  }, [habits, today]);

  const monthStats = useMemo(() => {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    let completed = 0;
    habits.forEach((h) => {
      h.completions.forEach((c) => {
        const d = new Date(c.date + 'T00:00:00');
        if (d >= monthStart && d <= today) completed++;
      });
    });
    const daysElapsed = today.getDate();
    const expected = Math.round(
      habits.reduce((s, h) => s + (h.frequency / 7) * daysElapsed, 0),
    );
    const pct = expected > 0 ? Math.round((completed / expected) * 100) : 0;
    return { completed, expected, pct };
  }, [habits, today]);

  const MONTH_NAMES = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <View style={{
            maxHeight: '88%',
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            backgroundColor: colors.card,
            paddingTop: 24, paddingBottom: 40,
          }}>
            {/* Handle */}
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 18 }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 18 }}>
                Estadísticas
              </Text>

              {/* Weekly / Monthly summary row */}
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Esta semana', val: `${weekStats.pct}%`, sub: `${weekStats.completed}/${weekStats.total} esperados`, color: getBarColor(weekStats.pct) },
                  { label: MONTH_NAMES[today.getMonth()], val: `${monthStats.pct}%`, sub: `${monthStats.completed}/${monthStats.expected} esperados`, color: getBarColor(monthStats.pct) },
                ].map((item) => (
                  <View key={item.label} style={{
                    flex: 1, borderRadius: 14, padding: 14,
                    backgroundColor: colors.bg,
                    borderWidth: 0.5, borderColor: colors.border,
                  }}>
                    <Text style={{ fontSize: 11, color: colors.light, marginBottom: 6 }}>{item.label}</Text>
                    <Text style={{ fontSize: 26, fontWeight: '800', color: item.color }}>{item.val}</Text>
                    <Text style={{ fontSize: 11, color: colors.light, marginTop: 4 }}>{item.sub}</Text>
                  </View>
                ))}
              </View>

              {/* Per-habit breakdown */}
              {habits.map((habit) => {
                const streak = getStreak(habit);
                const monthDone = getMonthCompletions(habit).size;
                const pct30 = (() => {
                  const start = new Date(today);
                  start.setDate(today.getDate() - 29);
                  start.setHours(0, 0, 0, 0);
                  const done = habit.completions.filter((c) => {
                    const d = new Date(c.date + 'T00:00:00');
                    return d >= start && d <= today;
                  }).length;
                  const exp = Math.round((habit.frequency / 7) * 30);
                  return exp > 0 ? Math.min(100, Math.round((done / exp) * 100)) : 0;
                })();
                const barC = getBarColor(pct30);
                return (
                  <View key={habit.id} style={{
                    borderRadius: 14, padding: 14, marginBottom: 12,
                    backgroundColor: colors.bg,
                    borderWidth: 0.5, borderColor: colors.border,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, flex: 1 }} numberOfLines={1}>
                        {habit.name}
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: barC, marginLeft: 8 }}>{pct30}%</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: colors.light, marginBottom: 10 }}>
                      Racha: {streak}🔥 · Este mes: {monthDone} días · Total: {habit.completions.length} días
                    </Text>
                    {/* 30-day bar */}
                    <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
                      <View style={{ height: '100%', width: `${pct30}%`, backgroundColor: barC, borderRadius: 2 }} />
                    </View>
                    {/* Mini calendar */}
                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.light, marginBottom: 4 }}>
                      {MONTH_NAMES[today.getMonth()]}
                    </Text>
                    <MiniCalendar habit={habit} colors={colors} />
                  </View>
                );
              })}

              {habits.length === 0 && (
                <Text style={{ color: colors.light, textAlign: 'center', marginTop: 24, fontSize: 14 }}>
                  Agrega hábitos para ver estadísticas
                </Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
