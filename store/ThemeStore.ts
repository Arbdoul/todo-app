// stores/themeStore.ts
import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { storage } from '../services/storage';
import { COLORS } from '../utils/constants';
import { ThemeMode } from '@/type';

interface ThemeState {
  themeMode: ThemeMode;

  // Computed
  isDark: () => boolean;
  colors: () => typeof COLORS.light;

  // Actions
  setTheme: (mode: ThemeMode) => Promise<void>;
  loadTheme: () => Promise<void>;
}

/**
 * Zustand store for theme management
 * Handles theme switching and persistence
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'auto',

  /**
   * Check if dark mode is active
   * Takes into account system preference when mode is 'auto'
   */
  isDark: () => {
    const { themeMode } = get();
    const systemColorScheme = useColorScheme();

    return themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
  },

  /**
   * Get current theme colors
   */
  colors: () => {
    return get().isDark() ? COLORS.dark : COLORS.light;
  },

  /**
   * Set theme mode and persist to storage
   */
  setTheme: async (mode) => {
    set({ themeMode: mode });
    try {
      await storage.saveTheme(mode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },

  /**
   * Load theme from storage
   */
  loadTheme: async () => {
    try {
      const savedTheme = await storage.getTheme();
      set({ themeMode: savedTheme });
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));

/**
 * Hook to use theme (simpler API for components)
 */
export const useTheme = () => {
  const themeMode = useThemeStore((state) => state.themeMode);
  const isDark = useThemeStore((state) => state.isDark());
  const colors = useThemeStore((state) => state.colors());
  const setTheme = useThemeStore((state) => state.setTheme);

  return { themeMode, isDark, colors, setTheme };
};
