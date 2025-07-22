# API Integration - Audio to Task

## Overview
This document describes the integration of EchoDo with the real backend API for audio processing and task creation.

## API Endpoint
- **URL**: `https://8gw2krv890.execute-api.us-east-1.amazonaws.com/AudioToText`
- **Method**: POST
- **Content-Type**: multipart/form-data

## Request Parameters
- `file`: Audio file (WebM format with Opus codec)
- `TextToTaskLLM`: Fixed value "groq"
- `SpeachToTextLLM`: Fixed value "openai"
- `timestamp`: Unix timestamp of the request

## Response Format
```json
{
  "timestamp": "1753037747",
  "transcription": "Nova atividade para hoje, meia-noite e quarenta e cinco.",
  "task": {
    "success": true,
    "data": {
      "title": "Nova atividade",
      "description": "Nova atividade para hoje, meia-noite e quarenta e cinco",
      "due_date": "2025-07-20T23:45:00Z",
      "meta": {
        "llm_provider": "groq",
        "model_used": "llama3-8b-8192"
      }
    }
  }
}
```

## Implementation Details

### 1. Backend Service (`src/services/backendService.ts`)
- Updated to use the real API endpoint
- Added proper FormData construction with required parameters
- Implemented timeout handling (30 seconds)
- Enhanced error handling for various failure scenarios

### 2. Type Definitions (`src/types/index.ts`)
- Updated `BackendTaskResponse` to match the real API response structure
- Added `ApiTaskData` and `ApiTaskResponse` interfaces
- Maintained backward compatibility with existing code

### 3. Task Service (`src/services/taskService.ts`)
- Updated `createTaskFromBackendResponse` to handle the new response structure
- Added validation for task success status
- Set default priority to "média" since not provided by API

### 4. Voice Recording Hook (`src/hooks/useVoiceRecording.ts`)
- Switched from mock service to real API service
- Enhanced error handling with specific error messages
- Removed automatic audio download functionality

### 5. Voice Button Component (`src/components/VoiceButton.tsx`)
- Removed automatic audio download functionality
- Maintained recording and processing UI

## Error Handling

### Timeout Errors
- 30-second timeout for API requests
- User-friendly message: "Request timeout - please try again"

### HTTP Errors
- Handles various HTTP status codes
- User-friendly message: "Server error - please try again later"

### Processing Errors
- Validates API response structure
- User-friendly message: "Could not process voice input - please try again"

### Network Errors
- Handles connection failures
- Generic error message: "Failed to process audio"

## Usage Flow

1. **User clicks VoiceButton** → Recording starts
2. **Audio capture** → WebM file with Opus codec
3. **API call** → FormData with audio and parameters
4. **Backend processing** → Speech-to-text and task extraction
5. **Response handling** → Validation and task creation
6. **Task creation** → Local storage with API data
7. **User feedback** → Success or error notification

## Testing

### Development Mode
- Use `mockProcessAudioToTask()` for testing without API
- Simulates 2-second delay and returns sample data

### Production Mode
- Use `processAudioToTask()` for real API integration
- Requires internet connection and valid API endpoint

## Future Enhancements

1. **Dynamic LLM Selection**: Allow users to choose different LLM providers
2. **Priority Detection**: Implement priority detection from voice input
3. **Language Support**: Add support for multiple languages
4. **Offline Mode**: Implement offline processing capabilities
5. **Audio Quality Settings**: Allow users to adjust recording quality

## Troubleshooting

### Common Issues

1. **Timeout Errors**
   - Check internet connection
   - Verify API endpoint availability
   - Consider increasing timeout if needed

2. **HTTP Errors**
   - Check API endpoint status
   - Verify request format
   - Check server logs for details

3. **Processing Failures**
   - Ensure audio quality is adequate
   - Check audio format compatibility
   - Verify API parameters

### Debug Mode
Enable debug logging by checking browser console for detailed error information. 