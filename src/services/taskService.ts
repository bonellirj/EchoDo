import type { Task } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import { log } from '../lib/logger';

class TaskService {
  private getTasksFromStorage(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.tasks);
      if (!stored) return [];
      
      const tasks = JSON.parse(stored);
      // Convert date strings back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      log.storageError('getTasksFromStorage', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch (error) {
      log.storageError('saveTasksToStorage', error instanceof Error ? error.message : 'Unknown error');
      throw new Error('Failed to save tasks to storage');
    }
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.getTasksFromStorage();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const tasks = this.getTasksFromStorage();
    return tasks.find(task => task.id === id) || null;
  }

  async createTask(title: string, dueDate?: Date): Promise<Task> {
    const newTask: Task = {
      id: this.generateId(),
      title,
      dueDate,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tasks = this.getTasksFromStorage();
    tasks.push(newTask);
    this.saveTasksToStorage(tasks);

    log.taskCreated(newTask.id, newTask.title);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    const tasks = this.getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasksToStorage(tasks);

    log.taskUpdated(id, updates);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const tasks = this.getTasksFromStorage();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === initialLength) {
      return false; // Task not found
    }

    this.saveTasksToStorage(filteredTasks);
    log.taskDeleted(id);
    return true;
  }

  async toggleTaskCompletion(id: string): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) return null;

    return this.updateTask(id, { completed: !task.completed });
  }

  async getTasksByDate(date: Date): Promise<Task[]> {
    const tasks = this.getTasksFromStorage();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === targetDate.getTime();
    });
  }

  async getCompletedTasks(): Promise<Task[]> {
    const tasks = this.getTasksFromStorage();
    return tasks.filter(task => task.completed);
  }

  async getPendingTasks(): Promise<Task[]> {
    const tasks = this.getTasksFromStorage();
    return tasks.filter(task => !task.completed);
  }

  async clearCompletedTasks(): Promise<number> {
    const tasks = this.getTasksFromStorage();
    const pendingTasks = tasks.filter(task => !task.completed);
    const deletedCount = tasks.length - pendingTasks.length;
    
    this.saveTasksToStorage(pendingTasks);
    return deletedCount;
  }
}

// Create singleton instance
const taskService = new TaskService();

export default taskService; 