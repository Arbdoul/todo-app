// hook/useVoiceInput.ios.ts
import { useState, useCallback, useEffect } from 'react';
import Voice from '@react-native-voice/voice';

export const useVoiceInput = () => {
  const [state, setState] = useState({
    isRecording: false,
    isProcessing: false,
    error: null as string | null,
  });

  const [transcribedText, setTranscribedText] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setState({ isRecording: true, isProcessing: false, error: null });
    };

    Voice.onSpeechResults = (e) => {
      if (e.value?.[0]) setTranscribedText(e.value[0]);
    };

    Voice.onSpeechError = (e) => {
      setState({ isRecording: false, isProcessing: false, error: e.error?.message });
    };

    return () => {
      Voice.destroy()
        .then(Voice.removeAllListeners)
        .catch(() => {});
    };
  }, []);

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      return true;
    } catch (error) {
      setState({ isRecording: false, isProcessing: false, error: 'Failed to start' });
      return false;
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      // Parse your tasks here
      return [{ title: transcribedText || 'Task from voice' }];
    } catch (error) {
      return null;
    }
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording: async () => Voice.cancel(),
    clearError: () => setState((prev) => ({ ...prev, error: null })),
  };
};
