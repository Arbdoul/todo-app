import { create } from 'zustand';
import { storage } from '../services/storage';
import { generateId } from '../utils/taskHelpers';
import { Task } from '@/type';

interface TaskState {
  tasks: Task[];
  loading: boolean;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

/**
 * store for task management
 */
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  /**
   * Load tasks from AsyncStorage
   */
  loadTasks: async () => {
    set({ loading: true });
    try {
      const storedTasks = await storage.getTasks();
      set({ tasks: storedTasks, loading: false });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set({ loading: false });
    }
  },

  /**
   * Add a new task
   */
  addTask: async (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...get().tasks];
    set({ tasks: updatedTasks });

    try {
      await storage.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to save task:', error);
      // Revert on error
      set({ tasks: get().tasks.filter((t) => t.id !== newTask.id) });
      throw error;
    }
  },

  /**
   * Update an existing task
   */
  updateTask: async (id, updates) => {
    const oldTasks = get().tasks;
    const updatedTasks = oldTasks.map((task) => (task.id === id ? { ...task, ...updates } : task));

    set({ tasks: updatedTasks });

    try {
      await storage.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on error
      set({ tasks: oldTasks });
      throw error;
    }
  },

  /**
   * Delete a task
   */
  deleteTask: async (id) => {
    const oldTasks = get().tasks;
    const updatedTasks = oldTasks.filter((task) => task.id !== id);

    set({ tasks: updatedTasks });

    try {
      await storage.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Revert on error
      set({ tasks: oldTasks });
      throw error;
    }
  },

  /**
   * Toggle task completion status
   */
  toggleTask: async (id) => {
    const oldTasks = get().tasks;
    const updatedTasks = oldTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    set({ tasks: updatedTasks });

    try {
      await storage.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to toggle task:', error);
      // Revert on error
      set({ tasks: oldTasks });
      throw error;
    }
  },

  /**
   * Clear all completed tasks
   */
  clearCompleted: async () => {
    const oldTasks = get().tasks;
    const updatedTasks = oldTasks.filter((task) => !task.completed);

    set({ tasks: updatedTasks });

    try {
      await storage.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to clear completed tasks:', error);
      // Revert on error
      set({ tasks: oldTasks });
      throw error;
    }
  },
}));

// // stores/themeStore.ts
// import { create } from 'zustand';
// import { useColorScheme } from 'react-native';
// import { storage } from '../services/storage';
// import { COLORS } from '../utils/constants';
// import { ThemeMode } from '@/type';

// interface ThemeState {
//   themeMode: ThemeMode;

//   // Actions
//   setTheme: (mode: ThemeMode) => Promise<void>;
//   loadTheme: () => Promise<void>;
// }

// /**
//  * Zustand store for theme management
//  * Handles theme switching and persistence
//  */
// export const useThemeStore = create<ThemeState>((set) => ({
//   themeMode: 'auto',

//   /**
//    * Set theme mode and persist to storage
//    */
//   setTheme: async (mode) => {
//     set({ themeMode: mode });
//     try {
//       await storage.saveTheme(mode);
//     } catch (error) {
//       console.error('Failed to save theme:', error);
//     }
//   },

//   /**
//    * Load theme from storage
//    */
//   loadTheme: async () => {
//     try {
//       const savedTheme = await storage.getTheme();
//       set({ themeMode: savedTheme });
//     } catch (error) {
//       console.error('Failed to load theme:', error);
//     }
//   },
// }));

// /**
//  * Hook to use theme (simpler API for components)
//  */
// export const useTheme = () => {
//   const themeMode = useThemeStore((state) => state.themeMode);
//   const setTheme = useThemeStore((state) => state.setTheme);
//   const systemColorScheme = useColorScheme();

//   // Compute isDark based on theme mode and system preference
//   const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

//   // Get colors based on current theme
//   const colors = isDark ? COLORS.dark : COLORS.light;

//   return { themeMode, isDark, colors, setTheme };
// };
