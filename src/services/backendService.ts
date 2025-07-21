import type { BackendResponse, BackendTaskResponse, BackendErrorResponse } from '../types';
import { log } from '../lib/logger';
import userPreferencesService from './userPreferencesService';

class BackendService {
  private baseUrl: string;

  constructor() {
    // API URL for audio processing
    this.baseUrl = 'https://api.echodo.chat/AudioToText';
  }

  async processAudioToTask(audioBlob: Blob): Promise<BackendTaskResponse> {
    try {
      console.log('BackendService: Starting audio processing', {
        audioBlobSize: audioBlob.size,
        audioBlobType: audioBlob.type,
        timestamp: new Date().toISOString()
      });

      // Get LLM preferences from user settings
      const speechToTextLLM = userPreferencesService.getSpeechToTextLLM();
      const textToTaskLLM = userPreferencesService.getTextToTaskLLM();

      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('TextToTaskLLM', textToTaskLLM);
      formData.append('SpeachToTextLLM', speechToTextLLM);
      formData.append('timestamp', Math.floor(Date.now() / 1000).toString());

      console.log('BackendService: FormData prepared', {
        url: this.baseUrl,
        speechToTextLLM,
        textToTaskLLM,
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          value: value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value
        }))
      });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        console.log('BackendService: Making API request...');
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('BackendService: Response received', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('BackendService: HTTP error response', {
            status: response.status,
            statusText: response.statusText,
            errorText
          });
          
          // Try to parse the error response as JSON to extract the specific error message
          let errorMessage = 'Request failed';
          
          try {
            const errorData = JSON.parse(errorText);
            console.log('BackendService: Parsed error data', errorData);
            
            // Extract the specific message from the nested structure
            if (errorData.details) {
              try {
                const details = JSON.parse(errorData.details);
                console.log('BackendService: Parsed details', details);
                if (details.message) {
                  console.log('BackendService: Found specific message', details.message);
                  errorMessage = details.message;
                }
              } catch (detailsParseError) {
                console.warn('BackendService: Could not parse details', detailsParseError);
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
            console.warn('BackendService: Could not parse error as JSON', jsonParseError);
          }
          
          throw new Error(errorMessage);
        }

        const data: BackendResponse = await response.json();
        console.log('BackendService: Response data received', {
          hasError: 'error' in data,
          hasTask: 'task' in data,
          taskSuccess: 'task' in data ? (data as BackendTaskResponse).task?.success : null
        });

        // Check if the response contains an error
        if ('error' in data) {
          console.error('BackendService: API returned error', data);
          throw new Error((data as BackendErrorResponse).error);
        }

        // Validate the response structure
        const taskResponse = data as BackendTaskResponse;
        if (!taskResponse.task || !taskResponse.task.success) {
          console.error('BackendService: Invalid task response', taskResponse);
          throw new Error('Backend processing failed');
        }

        console.log('BackendService: Processing successful', {
          transcription: taskResponse.transcription,
          taskTitle: taskResponse.task.data.title,
          taskDueDate: taskResponse.task.data.due_date
        });

        return taskResponse;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('BackendService: Fetch error', {
          error: fetchError,
          errorName: fetchError instanceof Error ? fetchError.name : 'Unknown',
          errorMessage: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        });
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw fetchError;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process audio';
      console.error('BackendService: Final error', {
        error,
        errorMessage,
        timestamp: new Date().toISOString()
      });
      log.voiceRecognitionFailed(errorMessage);
      throw new Error(errorMessage);
    }
  }


}

// Create singleton instance
const backendService = new BackendService();

export default backendService; 