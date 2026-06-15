import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ThemeColors, WindowSize } from '@/types/habit';

const WINDOWS: WindowSize[] = [7, 14, 30];

interface WindowPickerProps {
  value: WindowSize;
  onChange: (w: WindowSize) => void;
  colors: ThemeColors;
}

export function WindowPicker({ value, onChange, colors }: WindowPickerProps) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
      {WINDOWS.map((size) => (
        <TouchableOpacity
          key={size}
          onPress={() => onChange(size)}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
            backgroundColor: value === size ? colors.primary : colors.card,
            borderWidth: 2,
            borderColor: value === size ? colors.primary : colors.border,
          }}
        >
          <Text style={{ fontWeight: '600', color: value === size ? '#fff' : colors.text, fontSize: 13 }}>
            {size} días
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
