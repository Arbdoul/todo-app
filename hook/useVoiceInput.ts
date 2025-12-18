// import { useState, useCallback, useEffect } from 'react';
// import Voice from '@react-native-voice/voice';
// import { VoiceRecordingState, ParsedTask } from '@/type';
// import { ERROR_MESSAGES } from '../utils/constants';

// export const useVoiceInput = () => {
//   const [state, setState] = useState<VoiceRecordingState>({
//     isRecording: false,
//     isProcessing: false,
//     error: null,
//   });

//   const [transcribedText, setTranscribedText] = useState<string>('');

//   useEffect(() => {
//     // Set up voice recognition event listeners
//     Voice.onSpeechStart = () => {
//       console.log('Speech started');
//       setState({ isRecording: true, isProcessing: false, error: null });
//     };

//     Voice.onSpeechEnd = () => {
//       console.log('Speech ended');
//     };

//     Voice.onSpeechResults = (e) => {
//       console.log('Speech results:', e.value);
//       if (e.value && e.value[0]) {
//         setTranscribedText(e.value[0]);
//       }
//     };

//     Voice.onSpeechError = (e) => {
//       console.error('Speech error:', e.error);
//       setState({
//         isRecording: false,
//         isProcessing: false,
//         error: e.error?.message || ERROR_MESSAGES.VOICE_RECORDING,
//       });
//     };

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   /**
//    * Start recording audio using device speech recognition
//    */
//   const startRecording = async (): Promise<boolean> => {
//     try {
//       setTranscribedText('');
//       setState({ isRecording: true, isProcessing: false, error: null });

//       await Voice.start('en-US');
//       return true;
//     } catch (error) {
//       console.error('Recording start error:', error);
//       setState({
//         isRecording: false,
//         isProcessing: false,
//         error: ERROR_MESSAGES.VOICE_RECORDING,
//       });
//       return false;
//     }
//   };

//   /**
//    * Stop recording and process the transcribed text
//    */
//   const stopRecording = async (): Promise<ParsedTask[] | null> => {
//     try {
//       await Voice.stop();

//       setState({ isRecording: false, isProcessing: true, error: null });

//       await new Promise((resolve) => setTimeout(resolve, 500));

//       if (!transcribedText.trim()) {
//         throw new Error('No speech detected');
//       }

//       console.log('Transcribed text:', transcribedText);

//       const parsedTasks = parseTasksFromText(transcribedText);

//       setState({ isRecording: false, isProcessing: false, error: null });

//       return parsedTasks;
//     } catch (error) {
//       console.error('Recording stop error:', error);
//       setState({
//         isRecording: false,
//         isProcessing: false,
//         error: error instanceof Error ? error.message : ERROR_MESSAGES.VOICE_PROCESSING,
//       });
//       return null;
//     }
//   };

//   /**
//    * Cancel recording
//    */
//   const cancelRecording = useCallback(async () => {
//     try {
//       await Voice.cancel();
//       setTranscribedText('');
//     } catch (error) {
//       console.error('Cancel recording error:', error);
//     } finally {
//       setState({ isRecording: false, isProcessing: false, error: null });
//     }
//   }, []);

//   /**
//    * Clear error state
//    */
//   const clearError = useCallback(() => {
//     setState((prev) => ({ ...prev, error: null }));
//   }, []);

//   return {
//     ...state,
//     startRecording,
//     stopRecording,
//     cancelRecording,
//     clearError,
//   };
// };

// /**
//  * Parse transcribed text into multiple tasks
//  * Handles natural language like "buy groceries and call mom"
//  */
// function parseTasksFromText(text: string): ParsedTask[] {
//   // Clean up the text
//   const cleanText = text.trim();

//   // Split by common separators
//   const separators = /\s+and\s+|\s*,\s*|\s+then\s+/gi;
//   const parts = cleanText.split(separators);

//   // Filter and create tasks
//   const tasks: ParsedTask[] = parts
//     .map((part) => part.trim())
//     .filter((part) => part.length > 0)
//     .map((part) => {
//       // Capitalize first letter
//       const title = part.charAt(0).toUpperCase() + part.slice(1);
//       return { title };
//     });

//   // If no splits were made, return the original as one task
//   if (tasks.length === 0 && cleanText.length > 0) {
//     return [
//       {
//         title: cleanText.charAt(0).toUpperCase() + cleanText.slice(1),
//       },
//     ];
//   }

//   return tasks;
// }

// hook/useVoiceInput.ts
import { Platform } from 'react-native';

// Import platform-specific implementations
let useVoiceInputImplementation;

if (Platform.OS === 'ios') {
  try {
    useVoiceInputImplementation = require('./useVoiceInput.ios').useVoiceInput;
  } catch {
    // Fallback if iOS version fails
    useVoiceInputImplementation = require('./useVoiceInput.android').useVoiceInput;
  }
} else {
  useVoiceInputImplementation = require('./useVoiceInput.android').useVoiceInput;
}

export const useVoiceInput = useVoiceInputImplementation;
