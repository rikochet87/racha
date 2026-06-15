import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemeColors } from '@/types/habit';

const ONBOARDED_KEY = '@racha_onboarded';
const { width: SW } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🔥',
    title: 'Construye tu racha',
    body: 'Marca cada día que completes un hábito y ve crecer tu racha. ¡Un día a la vez!',
  },
  {
    emoji: '📊',
    title: 'Mide tu progreso',
    body: 'Visualiza tu cumplimiento semanal y mensual. Conoce tus mejores rachas y ajusta tu ritmo.',
  },
  {
    emoji: '🌿',
    title: 'Sin presión',
    body: 'Con el Día de Gracia puedes excusar un día sin romper tu racha. La constancia es más importante que la perfección.',
  },
];

interface OnboardingModalProps {
  colors: ThemeColors;
}

export function OnboardingModal({ colors }: OnboardingModalProps) {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const dotAnim = useRef(SLIDES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((val) => {
      if (!val) setVisible(true);
    });
  }, []);

  useEffect(() => {
    SLIDES.forEach((_, i) => {
      Animated.spring(dotAnim[i], {
        toValue: slide === i ? 1 : 0,
        useNativeDriver: false,
      }).start();
    });
  }, [slide, dotAnim]);

  const handleNext = () => {
    if (slide < SLIDES.length - 1) {
      const next = slide + 1;
      setSlide(next);
      scrollRef.current?.scrollTo({ x: next * SW, animated: true });
    } else {
      AsyncStorage.setItem(ONBOARDED_KEY, '1');
      setVisible(false);
    }
  };

  const accentColor = colors.accent;

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {SLIDES.map((s, i) => (
            <View
              key={i}
              style={{
                width: SW,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 36,
              }}
            >
              <Text style={{ fontSize: 72, marginBottom: 28 }}>{s.emoji}</Text>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '700',
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 16,
                  letterSpacing: -0.5,
                }}
              >
                {s.title}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.light,
                  textAlign: 'center',
                  lineHeight: 24,
                }}
              >
                {s.body}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Dot indicators */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {SLIDES.map((_, i) => (
            <Animated.View
              key={i}
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: accentColor,
                width: dotAnim[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 24],
                }),
                opacity: dotAnim[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              }}
            />
          ))}
        </View>

        {/* CTA button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            marginHorizontal: 24,
            marginBottom: 48,
            height: 54,
            borderRadius: 14,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
            {slide < SLIDES.length - 1 ? 'Siguiente' : '¡Empezar!'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
