import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { ThemeColors } from '@/types/habit';

interface DeleteModalProps {
  habitName: string | null;
  colors: ThemeColors;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ habitName, colors, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <Modal visible={habitName !== null} animationType="fade" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <View style={{ borderRadius: 20, padding: 24, backgroundColor: colors.card, width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' }}>
            Eliminar hábito
          </Text>
          <Text style={{ fontSize: 14, color: colors.light, marginBottom: 24, textAlign: 'center' }}>
            ¿Eliminar "{habitName}"?{'\n'}Esta acción no se puede deshacer.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{ flex: 1, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.border }}
              onPress={onCancel}
            >
              <Text style={{ fontWeight: '600', color: colors.text }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ef4444' }}
              onPress={onConfirm}
            >
              <Text style={{ fontWeight: '600', color: '#fff' }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
