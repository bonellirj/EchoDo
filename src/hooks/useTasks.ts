import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types';
import taskService from '../services/taskService';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (title: string, dueDate?: Date, description?: string, priority?: 'baixa' | 'média' | 'alta', transcription?: string) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompletion: (id: string) => Promise<Task | null>;
  refreshTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = await taskService.getAllTasks();
      setTasks(loadedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (title: string, dueDate?: Date, description?: string, priority?: 'baixa' | 'média' | 'alta', transcription?: string): Promise<Task | null> => {
    try {
      setError(null);
      const newTask = await taskService.createTask(title, dueDate, description, priority, transcription);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(id, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      }
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await taskService.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      return false;
    }
  }, []);

  const toggleTaskCompletion = useCallback(async (id: string): Promise<Task | null> => {
    try {
      setError(null);
      const updatedTask = await taskService.toggleTaskCompletion(id);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      }
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle task completion';
      setError(errorMessage);
      return null;
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks,
  };
}; 