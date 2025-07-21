import type { UserPreferences } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import logger from '../lib/logger';

class UserPreferencesService {
  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      theme: 'light',
      notifications: true,
      speechToTextLLM: 'openai',
      textToTaskLLM: 'groq',
    };
  }

  private getPreferencesFromStorage(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.preferences);
      if (!stored) return this.getDefaultPreferences();
      
      const preferences = JSON.parse(stored);
      return {
        ...this.getDefaultPreferences(),
        ...preferences,
      };
    } catch (error) {
      logger.error('STORAGE_ERROR', 'Failed to get preferences from storage', error instanceof Error ? error : undefined);
      return this.getDefaultPreferences();
    }
  }

  private savePreferencesToStorage(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(preferences));
      logger.info('USER_PREFERENCES_SAVED', `Preferences saved: ${JSON.stringify(preferences)}`);
    } catch (error) {
      logger.error('STORAGE_ERROR', 'Failed to save preferences to storage', error instanceof Error ? error : undefined);
    }
  }

  getUserPreferences(): UserPreferences {
    return this.getPreferencesFromStorage();
  }

  updateLanguage(language: UserPreferences['language']): void {
    const preferences = this.getPreferencesFromStorage();
    preferences.language = language;
    this.savePreferencesToStorage(preferences);
    logger.info('LANGUAGE_CHANGED', `Language changed to: ${language}`);
  }

  updateTheme(theme: UserPreferences['theme']): void {
    const preferences = this.getPreferencesFromStorage();
    preferences.theme = theme;
    this.savePreferencesToStorage(preferences);
    logger.info('THEME_CHANGED', `Theme changed to: ${theme}`);
  }

  updateSpeechToTextLLM(llm: UserPreferences['speechToTextLLM']): void {
    const preferences = this.getPreferencesFromStorage();
    preferences.speechToTextLLM = llm;
    this.savePreferencesToStorage(preferences);
    logger.info('SPEECH_TO_TEXT_LLM_CHANGED', `Speech to Text LLM changed to: ${llm}`);
  }

  updateTextToTaskLLM(llm: UserPreferences['textToTaskLLM']): void {
    const preferences = this.getPreferencesFromStorage();
    preferences.textToTaskLLM = llm;
    this.savePreferencesToStorage(preferences);
    logger.info('TEXT_TO_TASK_LLM_CHANGED', `Text to Task LLM changed to: ${llm}`);
  }

  updateNotifications(enabled: boolean): void {
    const preferences = this.getPreferencesFromStorage();
    preferences.notifications = enabled;
    this.savePreferencesToStorage(preferences);
    logger.info('NOTIFICATIONS_CHANGED', `Notifications ${enabled ? 'enabled' : 'disabled'}`);
  }

  getLanguage(): UserPreferences['language'] {
    return this.getPreferencesFromStorage().language;
  }

  getTheme(): UserPreferences['theme'] {
    return this.getPreferencesFromStorage().theme;
  }

  getSpeechToTextLLM(): UserPreferences['speechToTextLLM'] {
    return this.getPreferencesFromStorage().speechToTextLLM;
  }

  getTextToTaskLLM(): UserPreferences['textToTaskLLM'] {
    return this.getPreferencesFromStorage().textToTaskLLM;
  }

  getNotifications(): boolean {
    return this.getPreferencesFromStorage().notifications;
  }
}

export default new UserPreferencesService(); 