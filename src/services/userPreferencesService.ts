import type { UserPreferences } from '../types';
import { STORAGE_KEYS } from '../config/constants';
import logger from '../lib/logger';

class UserPreferencesService {
  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'en',
      theme: 'light',
      notifications: true,
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

  getNotifications(): boolean {
    return this.getPreferencesFromStorage().notifications;
  }
}

export default new UserPreferencesService(); 