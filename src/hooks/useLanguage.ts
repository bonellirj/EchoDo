import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import userPreferencesService from '../services/userPreferencesService';
import type { UserPreferences } from '../types';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<UserPreferences['language']>('en');

  // Load language from preferences on mount
  useEffect(() => {
    const savedLanguage = userPreferencesService.getLanguage();
    setCurrentLanguage(savedLanguage);
    
    // Update i18n if language is different from current
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = useCallback((language: UserPreferences['language']) => {
    setCurrentLanguage(language);
    userPreferencesService.updateLanguage(language);
    i18n.changeLanguage(language);
  }, [i18n]);

  return {
    currentLanguage,
    changeLanguage,
  };
}; 