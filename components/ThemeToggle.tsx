// components/ThemeToggle.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/store/ThemeStore';
export const ThemeToggle: React.FC = () => {
  const { isDark, themeMode, setTheme, colors } = useTheme();

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (themeMode === 'auto') {
      setTheme('light');
    } else if (themeMode === 'light') {
      setTheme('dark');
    } else {
      setTheme('auto');
    }
  };

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    if (themeMode === 'auto') return 'phone-portrait-outline';
    return isDark ? 'moon' : 'sunny';
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surface }]}
      onPress={handleToggle}>
      <Ionicons name={getIcon()} size={22} color={colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
