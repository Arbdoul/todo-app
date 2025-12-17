// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTaskStore } from '@/store/taskStore';
import { useThemeStore } from '@/store/themeStores';
export default function RootLayout() {
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadTheme = useThemeStore((state) => state.loadTheme);

  // Initialize stores on app start
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([loadTasks(), loadTheme()]);
    };

    initialize();
  }, [loadTasks, loadTheme]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
