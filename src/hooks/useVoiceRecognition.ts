import { useState, useCallback } from 'react';
import type { ParsedTaskData } from '../types';
import voiceService from '../services/voiceService';
import { log } from '../lib/logger';

interface UseVoiceRecognitionReturn {
  isRecording: boolean;
  isSupported: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  parseTaskFromSpeech: (text: string) => ParsedTaskData;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(voiceService.isRecognitionSupported());

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recognition is not supported in this browser');
      return;
    }

    try {
      setError(null);
      setIsRecording(true);
      
      await voiceService.startRecognition();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      log.voiceRecognitionFailed(errorMessage);
    } finally {
      setIsRecording(false);
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    voiceService.stopRecognition();
    setIsRecording(false);
  }, []);

  const parseTaskFromSpeech = useCallback((text: string): ParsedTaskData => {
    return voiceService.parseTaskFromSpeech(text);
  }, []);

  return {
    isRecording,
    isSupported,
    error,
    startRecording,
    stopRecording,
    parseTaskFromSpeech,
  };
}; 