import { useCallback, useEffect, useRef } from 'react';
import { useVoiceRecordingStore } from '../store/voiceRecordingStore';
import audioRecordingService from '../services/audioRecordingService';
import backendService from '../services/backendService';
import taskService from '../services/taskService';
import { log } from '../lib/logger';
import loggingService from '../services/loggingService';
import type { Task } from '../types';

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  recordingTime: number;
  maxRecordingTime: number;
  isProcessing: boolean;
  error: string | null;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  stopRecordingManually: () => Promise<void>;
  reset: () => void;
}

interface UseVoiceRecordingOptions {
  onTaskCreated?: (task: Task) => void;
}

export const useVoiceRecording = (options: UseVoiceRecordingOptions = {}): UseVoiceRecordingReturn => {
  const { onTaskCreated } = options;
  
  const {
    isRecording,
    recordingTime,
    maxRecordingTime,
    isProcessing,
    error,
    audioBlob,
    startRecording: startStoreRecording,
    stopRecording: stopStoreRecording,
    updateRecordingTime,
    setAudioBlob,
    setProcessing,
    setError,
    reset: resetStore,
  } = useVoiceRecordingStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        updateRecordingTime(elapsed);
        
        // Auto-stop when max time is reached
        if (elapsed >= maxRecordingTime) {
          // Use a ref to avoid dependency issues
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          startTimeRef.current = null;
          stopStoreRecording();
          // Trigger stop recording manually
          audioRecordingService.stopRecording().then(audioBlob => {
            setAudioBlob(audioBlob);
            setProcessing(true);
            // Process audio with backend
            backendService.processAudioToTask(audioBlob)
              .then(async backendResponse => {
                const newTask = await taskService.createTaskFromBackendResponse(backendResponse, backendResponse.timestamp);
                if (onTaskCreated && newTask) {
                  onTaskCreated(newTask);
                }
                await log.voiceRecognitionSuccess('Task created from voice input', 1.0, backendResponse.timestamp);
                return newTask;
              })
              .catch(async backendError => {
                let errorMessage = 'Failed to process audio';
                if (backendError instanceof Error) {
                  if (backendError.message.includes('timeout')) {
                    errorMessage = 'Request timeout - please try again';
                  } else if (backendError.message.includes('HTTP error')) {
                    errorMessage = 'Server error - please try again later';
                  } else if (backendError.message.includes('Backend processing failed')) {
                    errorMessage = 'Could not process voice input - please try again';
                  } else if (backendError.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error - check your connection';
                  } else {
                    errorMessage = backendError.message;
                  }
                }
                const errorTransactionId = Math.floor(Date.now() / 1000).toString();
                setError(errorMessage);
                await log.voiceRecognitionFailed(errorMessage, errorTransactionId);
              })
              .finally(() => {
                setProcessing(false);
              });
          }).catch(async error => {
            const errorTransactionId = Math.floor(Date.now() / 1000).toString();
            const errorMessage = error instanceof Error ? error.message : 'Failed to stop recording';
            setError(errorMessage);
            await log.voiceRecognitionFailed(errorMessage, errorTransactionId);
            setProcessing(false);
          });
        }
      }
    }, 100);
  }, [maxRecordingTime, updateRecordingTime, stopStoreRecording, setAudioBlob, setProcessing, setError, onTaskCreated]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (!audioRecordingService.isRecordingSupported()) {
        throw new Error('Audio recording is not supported in this browser');
      }

      startStoreRecording();
      await audioRecordingService.startRecording();
      startTimer();
    } catch (error) {
      const errorTransactionId = Math.floor(Date.now() / 1000).toString();
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setError(errorMessage);
      await log.voiceRecognitionFailed(errorMessage, errorTransactionId);
    }
  }, [startStoreRecording, startTimer, setError]);

  const stopRecording = useCallback(async () => {
    try {
      stopTimer();
      stopStoreRecording();

      if (!audioRecordingService.getCurrentRecorder()) {
        return;
      }

      setProcessing(true);
      const audioBlob = await audioRecordingService.stopRecording();
      setAudioBlob(audioBlob);

      // Process audio with backend
      try {
        // Use real backend service
        const backendResponse = await backendService.processAudioToTask(audioBlob);
        
        // Create task from backend response
        const newTask = await taskService.createTaskFromBackendResponse(backendResponse, backendResponse.timestamp);
        
        // Notify parent component about the new task
        if (onTaskCreated && newTask) {
          onTaskCreated(newTask);
        }
        
        await log.voiceRecognitionSuccess('Task created from voice input', 1.0, backendResponse.timestamp);
      } catch (backendError) {
        // Generate transactionId for error tracking
        const errorTransactionId = Math.floor(Date.now() / 1000).toString();
        
        let errorMessage = 'Failed to process audio';
        let detailedError = '';
        
        if (backendError instanceof Error) {
          detailedError = backendError.message;
          
          if (backendError.message.includes('timeout')) {
            errorMessage = 'Request timeout - please try again';
          } else if (backendError.message.includes('HTTP error')) {
            errorMessage = 'Server error - please try again later';
          } else if (backendError.message.includes('Backend processing failed')) {
            errorMessage = 'Could not process voice input - please try again';
          } else if (backendError.message.includes('Failed to fetch')) {
            errorMessage = 'Network error - check your connection';
          } else {
            errorMessage = backendError.message;
          }
        }
        
        // Log detailed error for debugging
        await loggingService.error('Voice Recording Error Details', backendError instanceof Error ? backendError : undefined, {
          message: detailedError,
          timestamp: new Date().toISOString(),
          audioBlobSize: audioBlob.size,
          audioBlobType: audioBlob.type,
          service: 'voiceRecording',
          operation: 'stopRecording'
        }, errorTransactionId);
        
        // For debug purposes, show detailed error in development
        if (import.meta.env.DEV) {
          errorMessage = `DEBUG: ${detailedError}`;
        }
        
        setError(errorMessage);
        await log.voiceRecognitionFailed(errorMessage, errorTransactionId);
      }
    } catch (error) {
      const errorTransactionId = Math.floor(Date.now() / 1000).toString();
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop recording';
      setError(errorMessage);
      await log.voiceRecognitionFailed(errorMessage, errorTransactionId);
    } finally {
      setProcessing(false);
    }
  }, [stopTimer, stopStoreRecording, setProcessing, setAudioBlob, setError, onTaskCreated]);

  const stopRecordingManually = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    }
  }, [isRecording, stopRecording]);

  const reset = useCallback(() => {
    stopTimer();
    resetStore();
  }, [stopTimer, resetStore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    isRecording,
    recordingTime,
    maxRecordingTime,
    isProcessing,
    error,
    audioBlob,
    startRecording,
    stopRecording,
    stopRecordingManually,
    reset,
  };
}; 