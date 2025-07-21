import { log } from '../lib/logger';

class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    return 'MediaRecorder' in window && 'getUserMedia' in navigator.mediaDevices;
  }

  async startRecording(): Promise<MediaRecorder> {
    if (!this.isSupported) {
      throw new Error('Audio recording is not supported in this browser');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      log.voiceRecognitionStarted();
      
      return this.mediaRecorder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      log.voiceRecognitionFailed(errorMessage);
      throw new Error(errorMessage);
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (event) => {
        const error = `Recording error: ${event.error}`;
        log.voiceRecognitionFailed(error);
        this.cleanup();
        reject(new Error(error));
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecordingSupported(): boolean {
    return this.isSupported;
  }

  getCurrentRecorder(): MediaRecorder | null {
    return this.mediaRecorder;
  }
}

// Create singleton instance
const audioRecordingService = new AudioRecordingService();

export default audioRecordingService; 