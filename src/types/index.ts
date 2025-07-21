// Global TypeScript definitions for EchoDo

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: 'baixa' | 'média' | 'alta';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  transcription?: string; // Original transcription from voice input
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

// New types for voice recording
export interface VoiceRecordingState {
  isRecording: boolean;
  recordingTime: number; // in seconds
  maxRecordingTime: number; // in seconds
  audioBlob: Blob | null;
  isProcessing: boolean;
  error: string | null;
}

// Updated types for the real API response
export interface ApiTaskData {
  title: string;
  description: string;
  due_date: string; // ISO string
  meta: {
    llm_provider: string;
    model_used: string;
  };
}

export interface ApiTaskResponse {
  success: boolean;
  data: ApiTaskData;
}

export interface BackendTaskResponse {
  timestamp: string;
  transcription: string;
  task: ApiTaskResponse;
}

export interface BackendErrorResponse {
  error: string;
}

export type BackendResponse = BackendTaskResponse | BackendErrorResponse;

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
  speechToTextLLM: 'openai';
  textToTaskLLM: 'groq' | 'openai';
}

export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
}; 