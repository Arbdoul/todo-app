// utils/taskHelpers.ts

import { Task, TaskFilter, TaskSort } from '@/type';

/**
 * Generate a unique ID for a task
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Filter tasks based on completion status
 */
export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.completed);
    case 'completed':
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
};

/**
 * Sort tasks based on selected criteria
 */
export const sortTasks = (tasks: Task[], sortBy: TaskSort): Task[] => {
  const sorted = [...tasks];

  switch (sortBy) {
    case 'date':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

/**
 * Check if a task is overdue
 */
export const isOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Get task statistics
 */
export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(isOverdue).length;

  return { total, completed, active, overdue };
};

/**
 * Search tasks by title or description
 */
export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;

  const lowerQuery = query.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Validate task title
 */
export const validateTaskTitle = (title: string): { valid: boolean; error?: string } => {
  const trimmed = title.trim();

  if (!trimmed) {
    return { valid: false, error: 'Task title cannot be empty' };
  }

  if (trimmed.length > 200) {
    return { valid: false, error: 'Task title is too long (max 200 characters)' };
  }

  return { valid: true };
};
