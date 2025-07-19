import type { LogEntry } from '../types';
import { LOG_EVENTS } from '../config/constants';

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

  private addLog(logEntry: LogEntry): void {
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

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = logEntry.level === 'ERROR' ? 'error' : logEntry.level === 'WARN' ? 'warn' : 'log';
      console[consoleMethod](`[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.event} - ${logEntry.message}`, logEntry.metadata || '');
    }
  }

  info(event: string, message: string, metadata?: Record<string, any>): void {
    this.addLog(this.createLogEntry('INFO', event, message, undefined, metadata));
  }

  warn(event: string, message: string, metadata?: Record<string, any>): void {
    this.addLog(this.createLogEntry('WARN', event, message, undefined, metadata));
  }

  error(event: string, message: string, error?: Error, metadata?: Record<string, any>): void {
    this.addLog(this.createLogEntry('ERROR', event, message, error?.stack, metadata));
  }

  debug(event: string, message: string, metadata?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      this.addLog(this.createLogEntry('DEBUG', event, message, undefined, metadata));
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
  taskCreated: (taskId: string, title: string) => {
    logger.info(LOG_EVENTS.TASK_CREATED, `Task created: ${title}`, { taskId, title });
  },
  
  taskUpdated: (taskId: string, changes: Record<string, any>) => {
    logger.info(LOG_EVENTS.TASK_UPDATED, `Task updated: ${taskId}`, { taskId, changes });
  },
  
  taskDeleted: (taskId: string) => {
    logger.info(LOG_EVENTS.TASK_DELETED, `Task deleted: ${taskId}`, { taskId });
  },
  
  voiceRecognitionStarted: () => {
    logger.info(LOG_EVENTS.VOICE_RECOGNITION_STARTED, 'Voice recognition started');
  },
  
  voiceRecognitionSuccess: (text: string, confidence: number) => {
    logger.info(LOG_EVENTS.VOICE_RECOGNITION_SUCCESS, `Voice recognition successful: ${text}`, { text, confidence });
  },
  
  voiceRecognitionFailed: (error: string) => {
    logger.error(LOG_EVENTS.VOICE_RECOGNITION_FAILED, `Voice recognition failed: ${error}`);
  },
  
  dateParsingFailed: (input: string, error: string) => {
    logger.error(LOG_EVENTS.DATE_PARSING_FAILED, `Date parsing failed for "${input}": ${error}`, undefined, { input });
  },
  
  storageError: (operation: string, error: string) => {
    logger.error(LOG_EVENTS.STORAGE_ERROR, `Storage error during ${operation}: ${error}`, undefined, { operation });
  },
}; 