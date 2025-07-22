import type { LogEntry } from '../types';
import { LOG_EVENTS } from '../config/constants';
import loggingService from '../services/loggingService';

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private createLogEntry(
    level: LogEntry['level'],
    event: string,
    message: string,
    stackTrace?: string,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      event,
      message,
      stackTrace,
      metadata,
    };
  }

  private async addLog(logEntry: LogEntry, transactionId?: string): Promise<void> {
    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('echodo_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to store logs in localStorage:', error);
    }

          // Send to external logging service
      try {
        const metadata = {
          ...logEntry.metadata,
          event: logEntry.event,
          stackTrace: logEntry.stackTrace,
          level: logEntry.level.toLowerCase(),
          app: 'echodo'
        };

        switch (logEntry.level) {
          case 'ERROR':
            await loggingService.error(logEntry.message, undefined, metadata, transactionId);
            break;
          case 'WARN':
            await loggingService.warn(logEntry.message, metadata, transactionId);
            break;
          case 'DEBUG':
            await loggingService.debug(logEntry.message, metadata, transactionId);
            break;
          default:
            await loggingService.info(logEntry.message, metadata, transactionId);
            break;
        }
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  async info(event: string, message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    await this.addLog(this.createLogEntry('INFO', event, message, undefined, metadata), transactionId);
  }

  async warn(event: string, message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    await this.addLog(this.createLogEntry('WARN', event, message, undefined, metadata), transactionId);
  }

  async error(event: string, message: string, error?: Error, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    await this.addLog(this.createLogEntry('ERROR', event, message, error?.stack, metadata), transactionId);
  }

  async debug(event: string, message: string, metadata?: Record<string, any>, transactionId?: string): Promise<void> {
    if (import.meta.env.DEV) {
      await this.addLog(this.createLogEntry('DEBUG', event, message, undefined, metadata), transactionId);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem('echodo_logs');
    } catch (error) {
      console.error('Failed to clear logs from localStorage:', error);
    }
  }

  loadLogsFromStorage(): void {
    try {
      const storedLogs = localStorage.getItem('echodo_logs');
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Failed to load logs from localStorage:', error);
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Load existing logs on initialization
logger.loadLogsFromStorage();

export default logger;

// Convenience functions for common logging patterns
export const log = {
  taskCreated: async (taskId: string, title: string, transactionId?: string) => {
    await logger.info(LOG_EVENTS.TASK_CREATED, `Task created: ${title}`, { taskId, title }, transactionId);
  },
  
  taskUpdated: async (taskId: string, changes: Record<string, any>, transactionId?: string) => {
    await logger.info(LOG_EVENTS.TASK_UPDATED, `Task updated: ${taskId}`, { taskId, changes }, transactionId);
  },
  
  taskDeleted: async (taskId: string, transactionId?: string) => {
    await logger.info(LOG_EVENTS.TASK_DELETED, `Task deleted: ${taskId}`, { taskId }, transactionId);
  },
  
  voiceRecognitionStarted: async (transactionId?: string) => {
    await logger.info(LOG_EVENTS.VOICE_RECOGNITION_STARTED, 'Voice recognition started', undefined, transactionId);
  },
  
  voiceRecognitionSuccess: async (text: string, confidence: number, transactionId?: string) => {
    await logger.info(LOG_EVENTS.VOICE_RECOGNITION_SUCCESS, `Voice recognition successful: ${text}`, { text, confidence }, transactionId);
  },
  
  voiceRecognitionFailed: async (error: string, transactionId?: string) => {
    await logger.error(LOG_EVENTS.VOICE_RECOGNITION_FAILED, `Voice recognition failed: ${error}`, undefined, undefined, transactionId);
  },
  
  dateParsingFailed: async (input: string, error: string, transactionId?: string) => {
    await logger.error(LOG_EVENTS.DATE_PARSING_FAILED, `Date parsing failed for "${input}": ${error}`, undefined, { input }, transactionId);
  },
  
  storageError: async (operation: string, error: string, transactionId?: string) => {
    await logger.error(LOG_EVENTS.STORAGE_ERROR, `Storage error during ${operation}: ${error}`, undefined, { operation }, transactionId);
  },
}; 