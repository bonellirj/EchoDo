import { useState, useEffect } from 'react';
import userPreferencesService from '../services/userPreferencesService';
import type { UserPreferences } from '../types';

export const useLLMPreferences = () => {
  const [speechToTextLLM, setSpeechToTextLLM] = useState<UserPreferences['speechToTextLLM']>('openai');
  const [textToTaskLLM, setTextToTaskLLM] = useState<UserPreferences['textToTaskLLM']>('groq');

  useEffect(() => {
    // Load initial values from storage
    setSpeechToTextLLM(userPreferencesService.getSpeechToTextLLM());
    setTextToTaskLLM(userPreferencesService.getTextToTaskLLM());
  }, []);

  const changeSpeechToTextLLM = (llm: UserPreferences['speechToTextLLM']) => {
    setSpeechToTextLLM(llm);
    userPreferencesService.updateSpeechToTextLLM(llm);
  };

  const changeTextToTaskLLM = (llm: UserPreferences['textToTaskLLM']) => {
    setTextToTaskLLM(llm);
    userPreferencesService.updateTextToTaskLLM(llm);
  };

  return {
    speechToTextLLM,
    textToTaskLLM,
    changeSpeechToTextLLM,
    changeTextToTaskLLM,
  };
}; 