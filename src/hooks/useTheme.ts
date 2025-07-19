import { useState, useEffect, useCallback } from 'react';
import userPreferencesService from '../services/userPreferencesService';
import type { UserPreferences } from '../types';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<UserPreferences['theme']>('light');

  const applyTheme = useCallback((theme: UserPreferences['theme']) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply new theme
    root.classList.add(theme);
  }, []);

  // Load theme from preferences on mount
  useEffect(() => {
    const savedTheme = userPreferencesService.getTheme();
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, [applyTheme]);



  const changeTheme = useCallback((theme: UserPreferences['theme']) => {
    setCurrentTheme(theme);
    userPreferencesService.updateTheme(theme);
    applyTheme(theme);
  }, [applyTheme]);

  return {
    currentTheme,
    changeTheme,
  };
}; 