// hook/useVoiceInput.android.ts
import { useState, useCallback } from 'react';

export const useVoiceInput = () => {
  const [state, setState] = useState({
    isRecording: false,
    isProcessing: false,
    error: null as string | null,
  });

  const startRecording = async () => {
    console.log('Voice recording not available on Android');
    setState({
      isRecording: false,
      isProcessing: false,
      error: 'Voice input not supported on Android. Use text input instead.',
    });
    return false;
  };

  const stopRecording = async () => {
    return null;
  };

  const cancelRecording = async () => {
    setState({ isRecording: false, isProcessing: false, error: null });
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError,
  };
};
