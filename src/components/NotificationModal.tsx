import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { Habit, ThemeColors } from '@/types/habit';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

interface NotificationModalProps {
  visible: boolean;
  habit: Habit | null;
  colors: ThemeColors;
  onSave: (habitId: string, time: string | null) => void;
  onClose: () => void;
}

export function NotificationModal({
  visible,
  habit,
  colors,
  onSave,
  onClose,
}: NotificationModalProps) {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (habit?.notificationTime) {
      const [h, m] = habit.notificationTime.split(':').map(Number);
      setHour(h);
      setMinute(m);
    } else {
      setHour(8);
      setMinute(0);
    }
  }, [habit]);

  if (!habit) return null;

  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const hasNotif = !!habit.notificationTime;

  const labelBg = colors.isLight ? colors.bg : '#2a2a2a';

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

            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
              Recordatorio
            </Text>
            <Text style={{ fontSize: 13, color: colors.light, marginBottom: 24 }}>
              {habit.name}
            </Text>

            {/* Time picker */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 0, marginBottom: 28 }}>
              {/* Hour */}
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => setHour((h) => (h + 1) % 24)}
                  style={{ paddingVertical: 8, paddingHorizontal: 20 }}
                >
                  <Text style={{ fontSize: 22, color: colors.accent }}>▲</Text>
                </TouchableOpacity>
                <View style={{
                  backgroundColor: labelBg, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20,
                  borderWidth: 0.5, borderColor: colors.border,
                }}>
                  <Text style={{ fontSize: 32, fontWeight: '700', color: colors.text }}>
                    {String(hour).padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setHour((h) => (h - 1 + 24) % 24)}
                  style={{ paddingVertical: 8, paddingHorizontal: 20 }}
                >
                  <Text style={{ fontSize: 22, color: colors.accent }}>▼</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 32, fontWeight: '700', color: colors.text, marginHorizontal: 8, marginBottom: 4 }}>:</Text>

              {/* Minute */}
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => setMinute((m) => (MINUTES.indexOf(m) + 1) % MINUTES.length)}
                  style={{ paddingVertical: 8, paddingHorizontal: 20 }}
                >
                  <Text style={{ fontSize: 22, color: colors.accent }}>▲</Text>
                </TouchableOpacity>
                <View style={{
                  backgroundColor: labelBg, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20,
                  borderWidth: 0.5, borderColor: colors.border,
                }}>
                  <Text style={{ fontSize: 32, fontWeight: '700', color: colors.text }}>
                    {String(minute).padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setMinute((m) => {
                    const idx = MINUTES.indexOf(m);
                    return MINUTES[(idx - 1 + MINUTES.length) % MINUTES.length];
                  })}
                  style={{ paddingVertical: 8, paddingHorizontal: 20 }}
                >
                  <Text style={{ fontSize: 22, color: colors.accent }}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={{
                height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
                backgroundColor: colors.primary, marginBottom: 12,
              }}
              onPress={() => { onSave(habit.id, timeStr); onClose(); }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#fff' }}>
                Recordar a las {timeStr}
              </Text>
            </TouchableOpacity>

            {hasNotif && (
              <TouchableOpacity
                style={{
                  height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
                  backgroundColor: colors.bg,
                  borderWidth: 0.5, borderColor: colors.border,
                }}
                onPress={() => { onSave(habit.id, null); onClose(); }}
              >
                <Text style={{ fontSize: 14, color: '#ef4444' }}>Quitar recordatorio</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
