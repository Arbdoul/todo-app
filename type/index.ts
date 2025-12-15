// types/index.ts

/**
 * Main Task interface representing a to-do item
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

/**
 * Filter options for task list
 */
export type TaskFilter = 'all' | 'active' | 'completed';

/**
 * Sort options for task list
 */
export type TaskSort = 'date' | 'dueDate' | 'alphabetical';

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Context type for task management
 */
export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

/**
 * Voice recording state
 */
export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

/**
 * Parsed task from voice input
 */
export interface ParsedTask {
  title: string;
  description?: string;
  dueDate?: string;
}

/**
 * OpenAI API response types
 */
export interface OpenAITranscriptionResponse {
  text: string;
}

export interface OpenAICompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Storage service interface
 */
export interface StorageService {
  getTasks: () => Promise<Task[]>;
  saveTasks: (tasks: Task[]) => Promise<void>;
  getTheme: () => Promise<ThemeMode>;
  saveTheme: (theme: ThemeMode) => Promise<void>;
}
