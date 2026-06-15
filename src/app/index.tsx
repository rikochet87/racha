import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Share, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AddHabitForm } from '@/components/AddHabitForm';
import { DeleteModal } from '@/components/DeleteModal';
import { EmptyState } from '@/components/EmptyState';
import { HabitCard } from '@/components/HabitCard';
import { NotificationModal } from '@/components/NotificationModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { StatsModal } from '@/components/StatsModal';
import { StatsPanel } from '@/components/StatsPanel';
import { ThemeModal } from '@/components/ThemeModal';
import { WindowPicker } from '@/components/WindowPicker';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types/habit';

function ThemeToggleIcon({ colors }: { colors: any }) {
  if (colors.isLight) {
    return (
      <View style={{ width: 26, height: 26, borderRadius: 13, overflow: 'hidden', flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: '#0f172a' }} />
        <View style={{ flex: 1, backgroundColor: '#f8fafc', borderWidth: 0.5, borderColor: '#e2e8f0' }} />
      </View>
    );
  }
  return (
    <View style={{ width: 26, height: 26, borderRadius: 13, overflow: 'hidden', flexDirection: 'row' }}>
      <View style={{ flex: 1, backgroundColor: colors.card }} />
      <View style={{ flex: 1, backgroundColor: colors.primary }} />
    </View>
  );
}

export default function HomeScreen() {
  const {
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
  } = useHabits();
  const { theme, colors, setTheme, windowSize, setWindowSize } = useAppTheme();

  const [showForm, setShowForm] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [notifHabit, setNotifHabit] = useState<Habit | null>(null);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <Text style={{ color: colors.text, fontSize: 16 }}>Cargando...</Text>
      </View>
    );
  }

  const { todayCompleted, maxStreak, overallPercentage } = getStats(windowSize);

  const handleShare = async () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    let completedThisWeek = 0;
    habits.forEach((h) => {
      h.completions.forEach((c) => {
        const d = new Date(c.date + 'T00:00:00');
        if (d >= weekStart) completedThisWeek++;
      });
    });

    const lines = [
      `📊 Mi progreso en Racha esta semana:`,
      ``,
      `✅ Completé ${completedThisWeek} días de hábitos`,
      `🔥 Racha máxima: ${maxStreak} días`,
      `📈 Cumplimiento: ${overallPercentage}%`,
      ``,
      ...habits.slice(0, 5).map((h) => {
        const s = getStreak(h);
        return `• ${h.name}${s > 0 ? ` — ${s} días seguidos 🔥` : ''}`;
      }),
      ``,
      `¡Descarga Racha y construye tus hábitos! 🚀`,
    ];

    try {
      await Share.share({ message: lines.join('\n') });
    } catch (_) {}
  };

  const iconBtnStyle = {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center' as const, alignItems: 'center' as const,
  };

  const lightIconBg = { backgroundColor: colors.bg, borderWidth: 0.5, borderColor: colors.border };
  const darkIconBg = { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.3)' };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <OnboardingModal colors={colors} />

      {/* Header */}
      {colors.isLight ? (
        <View style={{
          paddingTop: 72, paddingHorizontal: 16, paddingBottom: 16,
          backgroundColor: colors.card,
          borderBottomWidth: 0.5, borderBottomColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.5 }}>Racha</Text>
              <Text style={{ fontSize: 11, color: colors.light, marginTop: 1 }}>Seguimiento de hábitos</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <TouchableOpacity onPress={handleShare} style={[iconBtnStyle, lightIconBg]}>
                <Text style={{ fontSize: 16 }}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowStats(true)} style={[iconBtnStyle, lightIconBg]}>
                <Text style={{ fontSize: 16 }}>📊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowThemeModal(true)} style={[iconBtnStyle, lightIconBg]}>
                <ThemeToggleIcon colors={colors} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 72, paddingHorizontal: 16, paddingBottom: 20 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: -0.5 }}>Racha</Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>Seguimiento de hábitos</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <TouchableOpacity onPress={handleShare} style={[iconBtnStyle, darkIconBg]}>
                <Text style={{ fontSize: 16 }}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowStats(true)} style={[iconBtnStyle, darkIconBg]}>
                <Text style={{ fontSize: 16 }}>📊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowThemeModal(true)} style={[iconBtnStyle, darkIconBg]}>
                <ThemeToggleIcon colors={colors} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      )}

      <ThemeModal
        visible={showThemeModal}
        currentTheme={theme}
        colors={colors}
        onSelect={setTheme}
        onClose={() => setShowThemeModal(false)}
      />

      <StatsModal
        visible={showStats}
        habits={habits}
        colors={colors}
        onClose={() => setShowStats(false)}
      />

      <NotificationModal
        visible={notifHabit !== null}
        habit={notifHabit}
        colors={colors}
        onSave={setNotification}
        onClose={() => setNotifHabit(null)}
      />

      <DeleteModal
        habitName={confirmDelete?.name ?? null}
        colors={colors}
        onConfirm={() => {
          if (confirmDelete) {
            deleteHabit(confirmDelete.id);
            setConfirmDelete(null);
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <StatsPanel
          totalHabits={habits.length}
          todayCompleted={todayCompleted}
          maxStreak={maxStreak}
          percentage={overallPercentage}
          windowSize={windowSize}
          colors={colors}
        />

        <WindowPicker value={windowSize} onChange={setWindowSize} colors={colors} />

        {habits.length === 0 ? (
          <EmptyState colors={colors} />
        ) : (
          <View style={{ gap: 10 }}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                windowSize={windowSize}
                streak={getStreak(habit)}
                rolling={getRollingWindow(habit, windowSize)}
                colors={colors}
                onToggleDay={toggleDay}
                onGraceDay={addGraceDay}
                onDelete={(id, name) => setConfirmDelete({ id, name })}
                onNotification={(id) => {
                  const h = habits.find((x) => x.id === id);
                  if (h) setNotifHabit(h);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add form — Modal handles keyboard automatically */}
      <AddHabitForm
        visible={showForm}
        colors={colors}
        onAdd={(name, freq, category) => {
          addHabit(name, freq, category);
          setShowForm(false);
        }}
        onCancel={() => setShowForm(false)}
      />

      {/* FAB */}
      {!showForm && (
        <TouchableOpacity
          style={{
            position: 'absolute', bottom: 20, left: 16, right: 16,
            height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
            backgroundColor: colors.primary, elevation: 6,
          }}
          onPress={() => setShowForm(true)}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#fff', letterSpacing: 0.3 }}>
            + Agregar Hábito
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
