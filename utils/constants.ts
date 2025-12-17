/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  TASKS: '@todo_app:tasks',
  THEME: '@todo_app:theme',
} as const;

/**
 * OpenAI API configuration
 */
export const OPENAI_CONFIG = {
  API_URL: 'https://api.openai.com/v1',
  WHISPER_MODEL: 'whisper-1',
  GPT_MODEL: 'gpt-4o-mini',
  MAX_AUDIO_DURATION: 300,
} as const;

/**
 * App theme colors
 */
export const COLORS = {
  light: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#10b981',
    completed: '#94a3b8',
  },
  dark: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    error: '#f87171',
    success: '#34d399',
    completed: '#64748b',
  },
} as const;

/**
 * Animation durations (in ms)
 */
export const ANIMATION_DURATION = {
  short: 200,
  medium: 300,
  long: 500,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  EMPTY_TITLE: 'Task title cannot be empty',
  STORAGE_ERROR: 'Failed to save data. Please try again.',
  VOICE_PERMISSION: 'Microphone permission is required for voice input',
  VOICE_RECORDING: 'Failed to start recording. Please check permissions.',
  VOICE_PROCESSING: 'Failed to process voice input. Please try again.',
  API_ERROR: 'Failed to connect to OpenAI. Check your API key.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  TASK_ADDED: 'Task added successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted',
  TASKS_CLEARED: 'Completed tasks cleared',
} as const;
