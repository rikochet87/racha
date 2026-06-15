import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { THEME_COLORS_PREVIEW, THEME_NAMES, THEMES } from '@/constants/themes';
import { Theme, ThemeColors } from '@/types/habit';

interface ThemeModalProps {
  visible: boolean;
  currentTheme: Theme;
  colors: ThemeColors;
  onSelect: (t: Theme) => void;
  onClose: () => void;
}

const THEME_KEYS = Object.keys(THEMES) as Theme[];

const THEME_DESC: Record<Theme, string> = {
  light: 'Fondo blanco · texto oscuro',
  dark: 'Fondo oscuro · acento naranja',
  rose: 'Fondo rosa · acento fucsia',
};

function ThemePreviewCircle({ theme }: { theme: Theme }) {
  const [left, right] = THEME_COLORS_PREVIEW[theme];
  return (
    <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', flexDirection: 'row', marginRight: 14 }}>
      <View style={{ flex: 1, backgroundColor: left }} />
      <View style={{ flex: 1, backgroundColor: right }} />
    </View>
  );
}

export function ThemeModal({ visible, currentTheme, colors, onSelect, onClose }: ThemeModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <View style={{
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40,
            backgroundColor: colors.card,
          }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 18 }}>
              Apariencia
            </Text>

            {THEME_KEYS.map((key) => {
              const isActive = currentTheme === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    borderRadius: 14, padding: 14, marginBottom: 10,
                    borderWidth: isActive ? 1.5 : 0.5,
                    borderColor: isActive ? colors.accent : colors.border,
                    backgroundColor: isActive
                      ? (colors.isLight ? `${colors.accent}12` : `${colors.accent}18`)
                      : colors.bg,
                  }}
                  onPress={() => { onSelect(key); onClose(); }}
                >
                  <ThemePreviewCircle theme={key} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                      {THEME_NAMES[key]}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.light, marginTop: 2 }}>
                      {THEME_DESC[key]}
                    </Text>
                  </View>
                  <View style={{
                    width: 22, height: 22, borderRadius: 11,
                    borderWidth: isActive ? 0 : 1.5,
                    borderColor: colors.border,
                    backgroundColor: isActive ? colors.accent : 'transparent',
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    {isActive && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{'v'}</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
