# Racha 🔥

**Racha** is a minimalist habit tracker for Android built with React Native and Expo. It helps you build and maintain daily routines through streak-based accountability, visual progress grids, and smart analytics — all without distractions or subscriptions.

---

## Features

### Core
- **Habit tracking** — Create habits with custom frequency (1–7 times per week)
- **Rolling window** — View your completion rate over the last 7, 14, or 30 days
- **Streak counter** — Consecutive days tracked per habit; streak persists if today isn't completed yet
- **Day grid** — Compact visual calendar of your completions at a glance

### Engagement
- **Onboarding** — 3-slide introduction shown on first launch
- **Habit suggestions** — Tap a category chip (Exercise, Meditation, Reading, Hydration, Sleep, Diet, Languages) to prefill the name
- **Spring animations** — Each day cell bounces with a spring animation on toggle
- **Progress bar** — Color-coded (green → blue → amber → red) based on completion rate

### Smart Features
- **Grace Day** ⭐ — Long-press any uncompleted day to mark it as excused. One grace per 7-day window. Counts toward your streak without counting as a completion.
- **Statistics modal** — Weekly and monthly summaries with per-habit breakdown, best streaks, total completions, and a mini monthly calendar heatmap
- **Share progress** — One tap generates a weekly summary and opens the native share sheet
- **Notification scheduling** — Set a daily reminder time per habit (requires a native build)

### Customization
- **3 themes**: Claro (light), Oscuro (dark with Claude-inspired amber palette), Rosa (soft feminine rose)
- **Persistent preferences** — Theme and window size saved across sessions via AsyncStorage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Navigation | Expo Router (file-based) |
| Language | TypeScript (strict) |
| Storage | AsyncStorage |
| Animations | React Native Animated API |
| Gradients | expo-linear-gradient |
| Notifications | expo-notifications |

---

## Project Structure

```
src/
├── app/
│   └── index.tsx          # Main screen
├── components/
│   ├── HabitCard.tsx       # Habit card with day grid + spring animations
│   ├── StatsPanel.tsx      # Hero stats panel
│   ├── StatsModal.tsx      # Detailed weekly/monthly statistics
│   ├── AddHabitForm.tsx    # Modal form with category suggestions
│   ├── OnboardingModal.tsx # First-launch 3-slide onboarding
│   ├── NotificationModal.tsx # Per-habit reminder scheduling
│   ├── ThemeModal.tsx      # Theme picker bottom sheet
│   ├── DeleteModal.tsx     # Confirm delete dialog
│   ├── WindowPicker.tsx    # 7 / 14 / 30 day selector
│   └── EmptyState.tsx      # Empty list placeholder
├── hooks/
│   ├── useHabits.ts        # All habit state, mutations, and derived stats
│   └── useAppTheme.ts      # Theme + window size persistence
├── constants/
│   └── themes.ts           # Color palettes for all 3 themes
├── types/
│   └── habit.ts            # TypeScript interfaces
└── utils/
    └── dates.ts            # Date helpers
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Android emulator (Android Studio) or physical device with Expo Development Build

### Install

```bash
git clone https://github.com/YOUR_USERNAME/racha.git
cd racha
npm install
```

### Run

```bash
npx expo start --clear
```

Then open the app on your device or emulator via the Expo development client.

### Build (Android APK)

```bash
eas build --platform android --profile preview
```

---

## Screenshots

> Coming soon

---

## Roadmap

- [ ] Home screen widget (requires bare workflow)
- [ ] iCloud / Google Drive backup
- [ ] Habit categories with icons
- [ ] Weekly email digest
- [ ] Apple Watch companion

---

## License

MIT © 2026 Matias Rosello
