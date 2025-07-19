// App-wide constants and configuration

export const APP_CONFIG = {
  name: 'EchoDo',
  version: '1.0.0',
  description: 'Voice Task Creator - Mobile Web App',
} as const;

export const STORAGE_KEYS = {
  tasks: 'echodo_tasks',
  preferences: 'echodo_preferences',
  logs: 'echodo_logs',
} as const;

export const SUPPORTED_LANGUAGES = {
  pt: 'Português',
  'pt-BR': 'Português (Brasil)',
  en: 'English',
  es: 'Español',
  fr: 'Français',
} as const;

export const NAVIGATION_ITEMS = [
  {
    id: 'list',
    label: 'Tasks',
    icon: 'list',
    path: '/',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: 'calendar',
    path: '/calendar',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
  },
] as const;

export const VOICE_RECOGNITION_CONFIG = {
  continuous: false,
  interimResults: true,
  lang: 'en-US',
  maxAlternatives: 1,
} as const;

export const LOG_EVENTS = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',
  VOICE_RECOGNITION_STARTED: 'VOICE_RECOGNITION_STARTED',
  VOICE_RECOGNITION_SUCCESS: 'VOICE_RECOGNITION_SUCCESS',
  VOICE_RECOGNITION_FAILED: 'VOICE_RECOGNITION_FAILED',
  DATE_PARSING_FAILED: 'DATE_PARSING_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const; 