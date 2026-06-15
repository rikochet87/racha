import React from 'react';
import { Text, View } from 'react-native';

import { ThemeColors } from '@/types/habit';

interface EmptyStateProps {
  colors: ThemeColors;
}

export function EmptyState({ colors }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 50 }}>
      <Text style={{ fontSize: 56, marginBottom: 16 }}>📝</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6, color: colors.text }}>
        Sin hábitos aún
      </Text>
      <Text style={{ fontSize: 13, textAlign: 'center', color: colors.light }}>
        Tocá el botón de abajo para agregar uno
      </Text>
    </View>
  );
}
