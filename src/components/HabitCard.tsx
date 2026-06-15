import React, { memo, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

import { Habit, RollingWindow, ThemeColors, WindowSize } from '@/types/habit';
import { DAYS_OF_WEEK, getDatesInWindow, getLocalDateStr } from '@/utils/dates';

function getFrequencyLabel(freq: number): string {
  if (freq === 7) return 'Diario';
  if (freq === 1) return '1 vez/semana';
  return `${freq} veces/semana`;
}

function getCellStyle(days: WindowSize) {
  // 7 días: 7 celdas en 1 fila · 14 días: 7 por fila en 2 filas · 30 días: ~10 por fila
  if (days === 7) return { width: '13%' as const, paddingVertical: 7, dayFontSize: 9, numFontSize: 13 };
  if (days === 14) return { width: '13%' as const, paddingVertical: 6, dayFontSize: 8, numFontSize: 11 };
  return { width: '9%' as const, paddingVertical: 4, dayFontSize: 7, numFontSize: 10 };
}

function getBarColor(pct: number): string {
  if (pct >= 80) return '#10b981';
  if (pct >= 50) return '#3b82f6';
  if (pct >= 30) return '#f59e0b';
  return '#ef4444';
}

// Animated day cell — spring on toggle
interface DayCellProps {
  date: Date;
  dateStr: string;
  isCompleted: boolean;
  isGrace: boolean;
  cellStyle: ReturnType<typeof getCellStyle>;
  cellFilledBg: string;
  graceBg: string;
  colors: ThemeColors;
  onPress: () => void;
  onLongPress: () => void;
}

function DayCell({
  date, dateStr, isCompleted, isGrace, cellStyle, cellFilledBg, graceBg, colors, onPress, onLongPress,
}: DayCellProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isToday = dateStr === getLocalDateStr(new Date());

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.78,
        useNativeDriver: true,
        speed: 50,
        bounciness: 2,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 14,
      }),
    ]).start();
    onPress();
  };

  // Celdas vacías: fondo gris visible sobre la tarjeta blanca
  const emptyBg = colors.isLight ? '#f1f5f9' : colors.border;
  const bg = isCompleted ? cellFilledBg : isGrace ? graceBg : emptyBg;

  // Hoy sin completar: borde de color primario
  const borderWidth = isToday && !isCompleted && !isGrace ? 1.5 : 0.5;
  const borderC = isCompleted
    ? cellFilledBg
    : isGrace
      ? '#f59e0b'
      : isToday
        ? colors.primary
        : colors.isLight ? '#e2e8f0' : colors.border;

  const dayColor = isCompleted
    ? 'rgba(255,255,255,0.7)'
    : isGrace
      ? 'rgba(255,255,255,0.7)'
      : isToday
        ? colors.primary
        : colors.light;
  const numColor = isCompleted
    ? '#fff'
    : isGrace
      ? '#fff'
      : isToday
        ? colors.primary
        : colors.text;

  return (
    <TouchableOpacity
      style={{ width: cellStyle.width }}
      onPress={handlePress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.75}
    >
      <Animated.View
        style={{
          paddingVertical: cellStyle.paddingVertical,
          borderRadius: 8,
          alignItems: 'center',
          backgroundColor: bg,
          borderWidth,
          borderColor: borderC,
          marginBottom: 4,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text style={{ fontSize: cellStyle.dayFontSize, color: dayColor, marginBottom: 1 }}>
          {DAYS_OF_WEEK[date.getDay()]}
        </Text>
        <Text style={{ fontSize: cellStyle.numFontSize, fontWeight: '600', color: numColor }}>
          {date.getDate()}
        </Text>
        {isCompleted && (
          <Text style={{ fontSize: cellStyle.dayFontSize, marginTop: 1, color: 'rgba(255,255,255,0.8)' }}>
            ✓
          </Text>
        )}
        {isGrace && !isCompleted && (
          <Text style={{ fontSize: cellStyle.dayFontSize, marginTop: 1 }}>⭐</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

interface HabitCardProps {
  habit: Habit;
  windowSize: WindowSize;
  streak: number;
  rolling: RollingWindow;
  colors: ThemeColors;
  onToggleDay: (habitId: string, dateStr: string) => void;
  onGraceDay: (habitId: string, dateStr: string) => void;
  onDelete: (id: string, name: string) => void;
  onNotification?: (id: string) => void;
}

export const HabitCard = memo(function HabitCard({
  habit,
  windowSize,
  streak,
  rolling,
  colors,
  onToggleDay,
  onGraceDay,
  onDelete,
  onNotification,
}: HabitCardProps) {
  const dates = getDatesInWindow(windowSize, habit.createdAt);
  const cellStyle = getCellStyle(windowSize);
  const barColor = getBarColor(rolling.percentage);

  const cellFilledBg = colors.isLight ? colors.primary : colors.accent;
  const graceBg = '#d97706'; // amber-600
  const streakBadgeBg = colors.isLight ? '#fef3c7' : '#2a1a08';
  const streakBadgeText = colors.isLight ? '#92400e' : colors.accent;
  const notifActive = !!habit.notificationTime;

  return (
    <View style={{
      borderRadius: 14, padding: 16,
      backgroundColor: colors.card,
      borderWidth: 0.5, borderColor: colors.border,
      marginBottom: 2,
    }}>
      {/* Header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, flex: 1 }} numberOfLines={1}>
            {habit.name}
          </Text>
          {streak > 0 && (
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: streakBadgeBg }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: streakBadgeText }}>{streak}🔥</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: barColor }}>{rolling.percentage}%</Text>
          {onNotification && (
            <TouchableOpacity
              onPress={() => onNotification(habit.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ fontSize: 15, color: notifActive ? colors.accent : colors.light }}>
                {notifActive ? '🔔' : '🔕'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => onDelete(habit.id, habit.name)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ fontSize: 16, color: colors.light }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Frequency + grace hint */}
      <Text style={{ fontSize: 11, color: colors.light, marginBottom: 10 }}>
        {getFrequencyLabel(habit.frequency)} · {rolling.completed} de {rolling.total} esperados
        {habit.graceDates.length > 0 ? ` · ${habit.graceDates.length} gracia` : ''}
      </Text>

      {/* Thin progress bar */}
      <View style={{ height: 3, backgroundColor: colors.border, borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
        <View style={{
          height: '100%',
          width: `${rolling.percentage}%`,
          backgroundColor: barColor,
          borderRadius: 2,
        }} />
      </View>

      {/* Day grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
        {dates.map((date) => {
          const dateStr = getLocalDateStr(date);
          const isCompleted = habit.completions.some((c) => c.date === dateStr);
          const isGrace = habit.graceDates.includes(dateStr);
          return (
            <DayCell
              key={dateStr}
              date={date}
              dateStr={dateStr}
              isCompleted={isCompleted}
              isGrace={isGrace}
              cellStyle={cellStyle}
              cellFilledBg={cellFilledBg}
              graceBg={graceBg}
              colors={colors}
              onPress={() => onToggleDay(habit.id, dateStr)}
              onLongPress={() => {
                if (!isCompleted) onGraceDay(habit.id, dateStr);
              }}
            />
          );
        })}
      </View>

      {/* Grace day hint */}
      <Text style={{ fontSize: 10, color: colors.light, marginTop: 6, opacity: 0.7 }}>
        Mantén presionado un día para marcarlo como día de gracia ⭐
      </Text>
    </View>
  );
});
