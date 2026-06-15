import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemeColors } from '@/types/habit';

function getFrequencyLabel(freq: number): string {
  if (freq === 7) return 'Diario';
  if (freq === 1) return '1 vez/semana';
  return `${freq} veces/semana`;
}

const SUGGESTIONS = [
  { label: 'Ejercicio', emoji: '🏃' },
  { label: 'Meditación', emoji: '🧘' },
  { label: 'Lectura', emoji: '📖' },
  { label: 'Hidratación', emoji: '💧' },
  { label: 'Sueño', emoji: '😴' },
  { label: 'Dieta', emoji: '🥗' },
  { label: 'Idiomas', emoji: '🌍' },
];

interface AddHabitFormProps {
  visible: boolean;
  colors: ThemeColors;
  onAdd: (name: string, frequency: number, category?: string) => void;
  onCancel: () => void;
}

export function AddHabitForm({ visible, colors, onAdd, onCancel }: AddHabitFormProps) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const bottomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(bottomAnim, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 200,
        useNativeDriver: false,
      }).start();
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [bottomAnim]);

  const handleSuggestion = (label: string) => {
    setName(label);
    setSelectedCategory(label);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), frequency, selectedCategory);
    reset();
  };

  const reset = () => {
    setName('');
    setFrequency(7);
    setSelectedCategory(undefined);
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    reset();
    onCancel();
  };

  const canAdd = name.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={handleCancel}
      />
      <Animated.View style={{ paddingBottom: bottomAnim, backgroundColor: colors.card }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 }}>
          {/* Handle */}
          <View style={{
            width: 36, height: 4, borderRadius: 2,
            backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14,
          }} />

          {/* Suggestion chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
            contentContainerStyle={{ gap: 8 }}
            keyboardShouldPersistTaps="handled"
          >
            {SUGGESTIONS.map((s) => {
              const active = selectedCategory === s.label;
              return (
                <TouchableOpacity
                  key={s.label}
                  onPress={() => handleSuggestion(s.label)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 20,
                    borderWidth: active ? 1.5 : 1,
                    borderColor: active ? colors.accent : colors.border,
                    backgroundColor: active
                      ? colors.isLight ? `${colors.accent}18` : `${colors.accent}28`
                      : colors.bg,
                  }}
                >
                  <Text style={{ fontSize: 13 }}>{s.emoji}</Text>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: active ? '600' : '400',
                    color: active ? colors.accent : colors.light,
                  }}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TextInput
            style={{
              width: '100%', height: 46, borderWidth: 2, borderRadius: 10,
              paddingHorizontal: 14, marginBottom: 12, fontSize: 13,
              color: colors.text, borderColor: colors.border,
            }}
            placeholder="Nombre del habito"
            placeholderTextColor={colors.light}
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (selectedCategory && t !== selectedCategory) setSelectedCategory(undefined);
            }}
            autoFocus
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            maxLength={60}
          />

          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.light, marginBottom: 8 }}>
              Frecuencia
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: colors.bg, borderRadius: 10, borderWidth: 2,
              borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8,
            }}>
              <TouchableOpacity
                onPress={() => setFrequency((p) => Math.max(1, p - 1))}
                disabled={frequency <= 1}
                style={{
                  width: 36, height: 36, borderRadius: 18,
                  justifyContent: 'center', alignItems: 'center',
                  backgroundColor: frequency <= 1 ? colors.border : colors.primary,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                {getFrequencyLabel(frequency)}
              </Text>
              <TouchableOpacity
                onPress={() => setFrequency((p) => Math.min(7, p + 1))}
                disabled={frequency >= 7}
                style={{
                  width: 36, height: 36, borderRadius: 18,
                  justifyContent: 'center', alignItems: 'center',
                  backgroundColor: frequency >= 7 ? colors.border : colors.primary,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={{
                flex: 1, height: 46, borderRadius: 10,
                justifyContent: 'center', alignItems: 'center',
                backgroundColor: colors.border,
              }}
              onPress={handleCancel}
            >
              <Text style={{ fontWeight: '600', fontSize: 13, color: colors.text }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1, height: 46, borderRadius: 10,
                justifyContent: 'center', alignItems: 'center',
                backgroundColor: canAdd ? colors.primary : colors.border,
                opacity: canAdd ? 1 : 0.6,
              }}
              onPress={handleAdd}
              disabled={!canAdd}
            >
              <Text style={{ fontWeight: '600', fontSize: 13, color: '#fff' }}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}
