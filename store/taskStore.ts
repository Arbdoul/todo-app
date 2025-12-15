// stores/taskStore.ts
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
 * Zustand store for task management
 * Handles all task CRUD operations and persistence
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
