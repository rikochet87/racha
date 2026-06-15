import React from 'react';
import { Text, View } from 'react-native';

import { ThemeColors, WindowSize } from '@/types/habit';

interface StatsPanelProps {
  totalHabits: number;
  todayCompleted: number;
  maxStreak: number;
  percentage: number;
  windowSize: WindowSize;
  colors: ThemeColors;
}

function getBarColor(pct: number): string {
  if (pct >= 80) return '#10b981';
  if (pct >= 50) return '#3b82f6';
  if (pct >= 30) return '#f59e0b';
  return '#ef4444';
}

export function StatsPanel({
  totalHabits,
  todayCompleted,
  maxStreak,
  percentage,
  windowSize,
  colors,
}: StatsPanelProps) {
  const barColor = getBarColor(percentage);
  // Hero siempre oscuro: en light usa primary (#0f172a), en dark usa #2a2a2a
  const heroBg = colors.isLight ? colors.primary : '#2a2a2a';

  return (
    <>
      {/* Hero card */}
      <View style={{
        borderRadius: 16, padding: 22, marginBottom: 10,
        backgroundColor: heroBg,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
              Mejor racha
            </Text>
            <Text style={{ color: '#fff', fontSize: 36, fontWeight: '600', lineHeight: 40 }}>
              {maxStreak}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 3 }}>
              dias consecutivos
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
              Hoy
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
              <Text style={{ color: '#fff', fontSize: 36, fontWeight: '600', lineHeight: 40 }}>
                {todayCompleted}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18, fontWeight: '500' }}>
                /{totalHabits}
              </Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 3 }}>
              completados
            </Text>
          </View>
        </View>
      </View>

      {/* 2-col metric cards */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        <View style={{
          flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14,
          borderWidth: 0.5, borderColor: colors.border,
        }}>
          <Text style={{ color: colors.light, fontSize: 10, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
            Habitos
          </Text>
          <Text style={{ color: colors.text, fontSize: 26, fontWeight: '600' }}>
            {totalHabits}
          </Text>
        </View>
        <View style={{
          flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14,
          borderWidth: 0.5, borderColor: colors.border,
        }}>
          <Text style={{ color: colors.light, fontSize: 10, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
            Cumplimiento
          </Text>
          <Text style={{ color: barColor, fontSize: 26, fontWeight: '600' }}>
            {percentage}%
          </Text>
          <Text style={{ color: colors.light, fontSize: 10, marginTop: 2 }}>
            ultimos {windowSize} dias
          </Text>
        </View>
      </View>
    </>
  );
}
