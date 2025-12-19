// import { useState, useCallback, useEffect } from 'react';
// import Voice from '@react-native-voice/voice';

// export const useVoiceInput = () => {
//   const [state, setState] = useState({
//     isRecording: false,
//     isProcessing: false,
//     error: null as string | any,
//   });

//   const [transcribedText, setTranscribedText] = useState('');

//   useEffect(() => {
//     Voice.onSpeechStart = () => {
//       setState({ isRecording: true, isProcessing: false, error: null });
//     };

//     Voice.onSpeechResults = (e) => {
//       if (e.value?.[0]) setTranscribedText(e.value[0]);
//     };

//     Voice.onSpeechError = (e) => {
//       setState({ isRecording: false, isProcessing: false, error: e.error?.message });
//     };

//     return () => {
//       Voice.destroy()
//         .then(Voice.removeAllListeners)
//         .catch(() => {});
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       await Voice.start('en-US');
//       return true;
//     } catch (error) {
//       setState({ isRecording: false, isProcessing: false, error: 'Failed to start' });
//       return false;
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await Voice.stop();
//       return [{ title: transcribedText || 'Task from voice' }];
//     } catch (error) {
//       return null;
//     }
//   };

//   return {
//     ...state,
//     startRecording,
//     stopRecording,
//     cancelRecording: async () => Voice.cancel(),
//     clearError: () => setState((prev) => ({ ...prev, error: null })),
//   };
// };

import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Voice from '@react-native-voice/voice';

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

export const useVoiceInput = () => {
  const [state, setState] = useState<VoiceState>({
    isRecording: false,
    isProcessing: false,
    error: null,
  });

  const [transcribedText, setTranscribedText] = useState('');
  const voiceInitialized = useRef(false);

  useEffect(() => {
    // Only initialize Voice on iOS
    if (Platform.OS === 'ios') {
      if (voiceInitialized.current) return;

      Voice.onSpeechStart = () => {
        console.log('Speech started');
        setState({ isRecording: true, isProcessing: false, error: null });
      };

      Voice.onSpeechResults = (e: any) => {
        console.log('Speech results:', e.value);
        if (e.value?.[0]) {
          setTranscribedText(e.value[0]);
        }
      };

      Voice.onSpeechError = (e: any) => {
        console.error('Speech error:', e.error);
        setState({
          isRecording: false,
          isProcessing: false,
          error: e.error?.message || 'Speech recognition failed',
        });
      };

      Voice.onSpeechEnd = () => {
        console.log('Speech ended');
      };

      voiceInitialized.current = true;
    }

    return () => {
      // Only cleanup on iOS
      if (Platform.OS === 'ios' && voiceInitialized.current) {
        Voice.destroy()
          .then(() => Voice.removeAllListeners?.())
          .catch(() => {});
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Android: Return early with message
      if (Platform.OS === 'android') {
        setState({
          isRecording: false,
          isProcessing: false,
          error: 'Voice input is optimized for iOS. Please use text input on Android.',
        });
        return false;
      }

      // iOS: Start voice recognition
      setTranscribedText('');
      setState({ isRecording: true, isProcessing: false, error: null });

      console.log('Starting voice recognition...');
      await Voice.start('en-US');
      return true;
    } catch (error: any) {
      console.error('Recording start error:', error);

      let errorMessage = 'Failed to start recording';
      if (error?.message?.includes('permission')) {
        errorMessage = 'Microphone permission required';
      }

      setState({
        isRecording: false,
        isProcessing: false,
        error: errorMessage,
      });
      return false;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      // Android: Return null immediately
      if (Platform.OS === 'android') {
        return null;
      }

      // iOS: Stop and process
      console.log('Stopping voice recognition...');
      await Voice.stop();
      setState({ isRecording: false, isProcessing: true, error: null });

      // Wait a bit for processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!transcribedText.trim()) {
        throw new Error('No speech detected');
      }

      console.log('Transcribed text:', transcribedText);

      // Parse tasks from transcribed text
      const tasks = transcribedText
        .split(/\s+and\s+|\s*,\s*/gi)
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
        .map((part) => ({
          title: part.charAt(0).toUpperCase() + part.slice(1),
        }));

      console.log('Parsed tasks:', tasks);
      setState({ isRecording: false, isProcessing: false, error: null });

      return tasks.length > 0 ? tasks : [{ title: transcribedText }];
    } catch (error: any) {
      console.error('Recording stop error:', error);
      setState({
        isRecording: false,
        isProcessing: false,
        error: error?.message || 'Failed to process speech',
      });
      return null;
    }
  }, [transcribedText]);

  const cancelRecording = useCallback(async () => {
    try {
      // Only cancel on iOS
      if (Platform.OS === 'ios' && voiceInitialized.current) {
        await Voice.cancel();
      }
      setTranscribedText('');
    } catch (error) {
      console.error('Cancel error:', error);
    } finally {
      setState({ isRecording: false, isProcessing: false, error: null });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError,
  };
};
