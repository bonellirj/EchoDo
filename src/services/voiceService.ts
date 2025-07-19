import type { VoiceRecognitionResult, ParsedTaskData } from '../types';
import { VOICE_RECOGNITION_CONFIG } from '../config/constants';
import { log } from '../lib/logger';

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();
    if (this.isSupported) {
      this.initializeRecognition();
    }
  }

  private checkSupport(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  private initializeRecognition(): void {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    Object.assign(this.recognition, VOICE_RECOGNITION_CONFIG);
  }

  async startRecognition(): Promise<Promise<VoiceRecognitionResult>> {
    if (!this.isSupported) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    if (!this.recognition) {
      throw new Error('Speech recognition not initialized');
    }

    log.voiceRecognitionStarted();

    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not available'));
        return;
      }

      let finalResult: VoiceRecognitionResult | null = null;

      this.recognition.onresult = (event) => {
        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        finalResult = {
          text: transcript,
          confidence,
          isFinal: result.isFinal,
        };

        if (result.isFinal) {
          log.voiceRecognitionSuccess(transcript, confidence);
          resolve(finalResult);
        }
      };

      this.recognition.onerror = (event) => {
        const error = `Speech recognition error: ${event.error}`;
        log.voiceRecognitionFailed(error);
        reject(new Error(error));
      };

      this.recognition.onend = () => {
        if (finalResult && !finalResult.isFinal) {
          // If we have a result but it wasn't marked as final, treat it as final
          finalResult.isFinal = true;
          resolve(finalResult);
        }
      };

      this.recognition.start();
    });
  }

  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  // Basic date parsing utility (can be enhanced with external libraries)
  parseTaskFromSpeech(text: string): ParsedTaskData {
    // Simple date patterns
    const datePatterns = [
      { pattern: /(?:on|by|at)\s+(\w+\s+\d{1,2}(?:st|nd|rd|th)?)/i, extract: (match: string) => this.parseDate(match) },
      { pattern: /(?:on|by|at)\s+(tomorrow)/i, extract: () => this.getTomorrow() },
      { pattern: /(?:on|by|at)\s+(next\s+\w+)/i, extract: (match: string) => this.parseRelativeDate(match) },
    ];

    let dueDate: Date | undefined;
    let title = text;

    // Try to extract date from text
    for (const { pattern, extract } of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          dueDate = extract(match[1]);
          // Remove the date part from the title
          title = text.replace(pattern, '').trim();
          break;
        } catch (error) {
          log.dateParsingFailed(match[1], error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }

    return {
      title: this.cleanTitle(title),
      dueDate,
    };
  }

  private cleanTitle(title: string): string {
    // Remove common prefixes and clean up the title
    return title
      .replace(/^(remind me to|i need to|please|can you)/i, '')
      .replace(/^(call|text|message|email)\s+/i, '')
      .trim();
  }

  private parseDate(dateString: string): Date {
    // Basic date parsing - can be enhanced with libraries like date-fns or moment
    const today = new Date();
    const year = today.getFullYear();
    
    // Try to parse common date formats
    const parsed = new Date(`${dateString} ${year}`);
    
    if (isNaN(parsed.getTime())) {
      throw new Error(`Unable to parse date: ${dateString}`);
    }
    
    // If the parsed date is in the past, assume it's for next year
    if (parsed < today) {
      parsed.setFullYear(year + 1);
    }
    
    return parsed;
  }

  private getTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  private parseRelativeDate(relativeDate: string): Date {
    const today = new Date();
    const lowerDate = relativeDate.toLowerCase();
    
    if (lowerDate.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    }
    
    if (lowerDate.includes('next month')) {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return nextMonth;
    }
    
    // Parse day names
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < dayNames.length; i++) {
      if (lowerDate.includes(dayNames[i])) {
        const targetDay = i;
        const currentDay = today.getDay();
        let daysToAdd = targetDay - currentDay;
        
        if (daysToAdd <= 0) {
          daysToAdd += 7; // Next week
        }
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysToAdd);
        return targetDate;
      }
    }
    
    throw new Error(`Unable to parse relative date: ${relativeDate}`);
  }
}

// Create singleton instance
const voiceService = new VoiceService();

export default voiceService; 