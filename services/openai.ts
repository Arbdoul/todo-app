import { OpenAICompletionResponse, OpenAITranscriptionResponse } from '@/type';
import { OPENAI_CONFIG } from '../utils/constants';

// Get API key from environment
const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

/**
 * Service for interacting with OpenAI APIs
 * CURRENTLY IN MOCK MODE - See comments to enable real API calls
 */
class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Transcribe audio file to text using Whisper API
   * MOCK MODE: Returns simulated transcription without API call
   */
  async transcribeAudio(audioUri: string): Promise<string> {
    // ============================================
    // MOCK MODE - NO API CALL, NO COSTS
    // ============================================
    console.log('🎤 MOCK MODE: Simulating voice transcription');
    console.log('📁 Audio file would be:', audioUri);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return mock transcription
    return 'Buy groceries and call mom and finish the project';

    /* ============================================
       REAL IMPLEMENTATION - UNCOMMENT TO ENABLE
       ============================================
       Requires OpenAI credits: https://platform.openai.com/billing
       
    try {
      // Create form data with audio file
      const formData = new FormData();

      // @ts-ignore - React Native FormData supports file
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });
      formData.append('model', OPENAI_CONFIG.WHISPER_MODEL);

      const response = await fetch(`${OPENAI_CONFIG.API_URL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Transcription failed');
      }

      const data: OpenAITranscriptionResponse = await response.json();
      return data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please check your API key and try again.');
    }
    */
  }

  /**
   * Parse transcribed text into structured tasks using GPT
   * MOCK MODE: Returns simulated task parsing without API call
   */
  async parseTasks(text: string): Promise<Array<{ title: string; description?: string }>> {
    // ============================================
    // MOCK MODE - NO API CALL, NO COSTS
    // ============================================
    console.log('🤖 MOCK MODE: Simulating GPT task parsing');
    console.log('📝 Text to parse:', text);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock parsed tasks
    return [{ title: 'Buy groceries' }, { title: 'Call mom' }, { title: 'Finish the project' }];

    /* ============================================
       REAL IMPLEMENTATION - UNCOMMENT TO ENABLE
       ============================================
       Requires OpenAI credits: https://platform.openai.com/billing
       
    try {
      const systemPrompt = `You are a task parser. Extract individual tasks from the user's text.
Rules:
- Split compound sentences with "and" into separate tasks
- Each task should have a clear action verb
- Keep tasks concise and actionable
- Return ONLY a JSON array of tasks
- Each task object should have "title" and optionally "description"
- If there's only one task, return an array with one item

Examples:
Input: "Buy groceries and call mom"
Output: [{"title": "Buy groceries"}, {"title": "Call mom"}]

Input: "Schedule dentist appointment for next Tuesday"
Output: [{"title": "Schedule dentist appointment", "description": "next Tuesday"}]

Input: "Clean the house, do laundry, and prepare dinner"
Output: [{"title": "Clean the house"}, {"title": "Do laundry"}, {"title": "Prepare dinner"}]`;

      const response = await fetch(`${OPENAI_CONFIG.API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.GPT_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Task parsing failed');
      }

      const data: OpenAICompletionResponse = await response.json();
      const content = data.choices[0].message.content;

      // Parse the JSON response
      const parsed = JSON.parse(content);

      // Handle different response formats
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed.tasks && Array.isArray(parsed.tasks)) {
        return parsed.tasks;
      } else if (parsed.title) {
        return [parsed];
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Task parsing error:', error);

      // Fallback: return the original text as a single task
      return [{ title: text }];
    }
    */
  }

  /**
   * Check if API key is configured
   * In mock mode, always returns true to allow demo
   */
  isConfigured(): boolean {
    // Mock mode - always return true
    return true;

    // Real implementation - uncomment when using real API
    // return Boolean(this.apiKey && this.apiKey.startsWith('sk-'));
  }
}

// Export singleton instance
export const openAIService = new OpenAIService(API_KEY);
