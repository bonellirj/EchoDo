import { create } from 'zustand';
import type { VoiceRecordingState } from '../types';

interface VoiceRecordingStore extends VoiceRecordingState {
  startRecording: () => void;
  stopRecording: () => void;
  updateRecordingTime: (time: number) => void;
  setAudioBlob: (blob: Blob) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: VoiceRecordingState = {
  isRecording: false,
  recordingTime: 0,
  maxRecordingTime: 10, // 10 seconds max
  audioBlob: null,
  isProcessing: false,
  error: null,
};

export const useVoiceRecordingStore = create<VoiceRecordingStore>((set) => ({
  ...initialState,

  startRecording: () => {
    set({
      isRecording: true,
      recordingTime: 0,
      audioBlob: null,
      error: null,
    });
  },

  stopRecording: () => {
    set({
      isRecording: false,
    });
  },

  updateRecordingTime: (time: number) => {
    set({ recordingTime: time });
  },

  setAudioBlob: (blob: Blob) => {
    set({ audioBlob: blob });
  },

  setProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
})); 