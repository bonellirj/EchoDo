import type { BackendResponse, BackendTaskResponse, BackendErrorResponse } from '../types';
import { log } from '../lib/logger';
import userPreferencesService from './userPreferencesService';
import loggingService from './loggingService';

class BackendService {
  private baseUrl: string;

  constructor() {
    // API URL for audio processing
    this.baseUrl = 'https://api.echodo.chat/AudioToText';
  }

  async processAudioToTask(audioBlob: Blob): Promise<BackendTaskResponse> {
    // Generate TransactionID from timestamp
    const transactionId = Math.floor(Date.now() / 1000).toString();
    
    try {
      await loggingService.info('BackendService: Starting audio processing', {
        audioBlobSize: audioBlob.size,
        audioBlobType: audioBlob.type,
        timestamp: new Date().toISOString(),
        service: 'backend',
        operation: 'processAudioToTask'
      }, transactionId);

      // Get LLM preferences from user settings
      const speechToTextLLM = userPreferencesService.getSpeechToTextLLM();
      const textToTaskLLM = userPreferencesService.getTextToTaskLLM();

      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('TextToTaskLLM', textToTaskLLM);
      formData.append('SpeachToTextLLM', speechToTextLLM);
      formData.append('timestamp', transactionId);

      await loggingService.info('BackendService: FormData prepared', {
        url: this.baseUrl,
        speechToTextLLM,
        textToTaskLLM,
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          value: value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value
        })),
        service: 'backend',
        operation: 'processAudioToTask'
      }, transactionId);

      // Log específico dos parâmetros da API de Audio para Texto
      await loggingService.info('BackendService: API Parameters for Audio to Text', {
        apiUrl: this.baseUrl,
        audioFile: {
          name: 'recording.webm',
          size: audioBlob.size,
          type: audioBlob.type
        },
        llmParameters: {
          speechToTextLLM,
          textToTaskLLM
        },
        timestamp: transactionId,
        formDataKeys: Array.from(formData.keys()),
        service: 'backend',
        operation: 'processAudioToTask'
      }, transactionId);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        await loggingService.info('BackendService: Making API request...', { service: 'backend', operation: 'processAudioToTask' }, transactionId);
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        await loggingService.info('BackendService: Response received', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          service: 'backend',
          operation: 'processAudioToTask'
        }, transactionId);

        if (!response.ok) {
          const errorText = await response.text();
          await loggingService.error('BackendService: HTTP error response', undefined, {
            status: response.status,
            statusText: response.statusText,
            errorText,
            service: 'backend',
            operation: 'processAudioToTask'
          }, transactionId);
          
          // Try to parse the error response as JSON to extract the specific error message
          let errorMessage = 'Request failed';
          
          try {
            const errorData = JSON.parse(errorText);
            await loggingService.debug('BackendService: Parsed error data', {
              ...errorData,
              service: 'backend',
              operation: 'processAudioToTask'
            }, transactionId);
            
            // Extract the specific message from the nested structure
            if (errorData.details) {
              try {
                const details = JSON.parse(errorData.details);
                await loggingService.debug('BackendService: Parsed details', {
                  ...details,
                  service: 'backend',
                  operation: 'processAudioToTask'
                }, transactionId);
                if (details.message) {
                  await loggingService.debug('BackendService: Found specific message', { 
                    message: details.message,
                    service: 'backend',
                    operation: 'processAudioToTask'
                  }, transactionId);
                  errorMessage = details.message;
                }
              } catch (detailsParseError) {
                await loggingService.warn('BackendService: Could not parse details', { 
                  error: detailsParseError,
                  service: 'backend',
                  operation: 'processAudioToTask'
                }, transactionId);
              }
            }
            
            // Fallback to other error message fields if no specific message found
            if (errorMessage === 'Request failed') {
              if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = errorData.error;
              }
            }
          } catch (jsonParseError) {
            await loggingService.warn('BackendService: Could not parse error as JSON', { 
              error: jsonParseError,
              service: 'backend',
              operation: 'processAudioToTask'
            }, transactionId);
          }
          
          throw new Error(errorMessage);
        }

        const data: BackendResponse = await response.json();
        await loggingService.info('BackendService: Response data received', {
          hasError: 'error' in data,
          hasTask: 'task' in data,
          taskSuccess: 'task' in data ? (data as BackendTaskResponse).task?.success : null,
          service: 'backend',
          operation: 'processAudioToTask'
        }, transactionId);

        // Check if the response contains an error
        if ('error' in data) {
          await loggingService.error('BackendService: API returned error', undefined, {
            ...data,
            service: 'backend',
            operation: 'processAudioToTask'
          }, transactionId);
          throw new Error((data as BackendErrorResponse).error);
        }

        // Validate the response structure
        const taskResponse = data as BackendTaskResponse;
        if (!taskResponse.task || !taskResponse.task.success) {
          await loggingService.error('BackendService: Invalid task response', undefined, {
            ...taskResponse,
            service: 'backend',
            operation: 'processAudioToTask'
          }, transactionId);
          throw new Error('Backend processing failed');
        }

        await loggingService.info('BackendService: Processing successful', {
          transcription: taskResponse.transcription,
          taskTitle: taskResponse.task.data.title,
          taskDueDate: taskResponse.task.data.due_date,
          service: 'backend',
          operation: 'processAudioToTask'
        }, transactionId);

        return taskResponse;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        await loggingService.error('BackendService: Fetch error', fetchError instanceof Error ? fetchError : undefined, {
          errorName: fetchError instanceof Error ? fetchError.name : 'Unknown',
          errorMessage: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          service: 'backend',
          operation: 'processAudioToTask'
        }, transactionId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw fetchError;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process audio';
      await loggingService.error('BackendService: Final error', error instanceof Error ? error : undefined, {
        errorMessage,
        timestamp: new Date().toISOString(),
        service: 'backend',
        operation: 'processAudioToTask'
      }, transactionId);
      await log.voiceRecognitionFailed(errorMessage, transactionId);
      throw new Error(errorMessage);
    }
  }


}

// Create singleton instance
const backendService = new BackendService();

export default backendService; 