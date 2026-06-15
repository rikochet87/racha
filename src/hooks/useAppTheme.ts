import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { THEMES } from '@/constants/themes';
import { Theme, ThemeColors, WindowSize } from '@/types/habit';

const THEME_KEY = '@racha_theme_v2';
const WINDOW_KEY = '@racha_window';

const VALID_THEMES: Theme[] = ['light', 'dark', 'rose'];
const VALID_WINDOWS: WindowSize[] = [7, 14, 30];

export function useAppTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [windowSize, setWindowSizeState] = useState<WindowSize>(7);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(THEME_KEY), AsyncStorage.getItem(WINDOW_KEY)])
      .then(([themeRaw, windowRaw]) => {
        if (themeRaw && VALID_THEMES.includes(themeRaw as Theme)) {
          setThemeState(themeRaw as Theme);
        }
        const parsed = parseInt(windowRaw ?? '', 10) as WindowSize;
        if (VALID_WINDOWS.includes(parsed)) {
          setWindowSizeState(parsed);
        }
      })
      .catch((e) => console.error('[useAppTheme] Failed to load preferences:', e));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    AsyncStorage.setItem(THEME_KEY, t).catch((e) =>
      console.error('[useAppTheme] Failed to save theme:', e),
    );
  }, []);

  const setWindowSize = useCallback((w: WindowSize) => {
    setWindowSizeState(w);
    AsyncStorage.setItem(WINDOW_KEY, w.toString()).catch((e) =>
      console.error('[useAppTheme] Failed to save window size:', e),
    );
  }, []);

  const colors: ThemeColors = THEMES[theme];

  return { theme, colors, setTheme, windowSize, setWindowSize };
}
