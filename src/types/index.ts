// Global TypeScript definitions for EchoDo

export interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface ParsedTaskData {
  title: string;
  dueDate?: Date;
  time?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
  event: string;
  message: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

export interface AppState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  currentView: 'list' | 'calendar' | 'settings';
}

export interface UserPreferences {
  language: 'pt' | 'pt-BR' | 'en' | 'es' | 'fr';
  theme: 'light' | 'dark';
  notifications: boolean;
}

export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
}; 