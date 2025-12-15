// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { StorageService, Task, ThemeMode } from '@/type';

class Storage implements StorageService {
  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasksJson) return [];

      const tasks = JSON.parse(tasksJson);
      return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const tasksJson = JSON.stringify(tasks);
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, tasksJson);
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw new Error('Failed to save tasks');
    }
  }

  async getTheme(): Promise<ThemeMode> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'light' || theme === 'dark' || theme === 'auto') {
        return theme;
      }
      return 'auto';
    } catch (error) {
      console.error('Error loading theme:', error);
      return 'auto';
    }
  }

  /**
   * Save theme preference to storage
   */
  async saveTheme(theme: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
      throw new Error('Failed to save theme');
    }
  }

  /**
   * Clear all app data (useful for testing/reset)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TASKS, STORAGE_KEYS.THEME]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  /**
   * Get storage info (for debugging)
   */
  async getStorageInfo(): Promise<{ keys: string[]; size: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith('@todo_app:'));

      let totalSize = 0;
      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return { keys: appKeys, size: totalSize };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { keys: [], size: 0 };
    }
  }
}

// Export singleton instance
export const storage = new Storage();
