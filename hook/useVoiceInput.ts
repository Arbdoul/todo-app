// hooks/useVoiceInput.ts
import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { openAIService } from '../services/openai';
import { ERROR_MESSAGES } from '../utils/constants';
import { ParsedTask, VoiceRecordingState } from '@/type';

/**
 * Custom hook for managing voice input functionality
 */
export const useVoiceInput = () => {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    error: null,
  });

  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  /**
   * Request microphone permissions
   */
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setState((prev) => ({ ...prev, error: ERROR_MESSAGES.VOICE_PERMISSION }));
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      setState((prev) => ({ ...prev, error: ERROR_MESSAGES.VOICE_PERMISSION }));
      return false;
    }
  };

  /**
   * Start recording audio
   */
  const startRecording = async (): Promise<boolean> => {
    try {
      // Check permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) return false;

      // Check if OpenAI is configured
      if (!openAIService.isConfigured()) {
        setState((prev) => ({
          ...prev,
          error: 'OpenAI API key not configured. Please add it to your .env file.',
        }));
        return false;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setState({ isRecording: true, isProcessing: false, error: null });
      return true;
    } catch (error) {
      console.error('Recording start error:', error);
      setState({
        isRecording: false,
        isProcessing: false,
        error: ERROR_MESSAGES.VOICE_RECORDING,
      });
      return false;
    }
  };

  /**
   * Stop recording and process audio
   */
  const stopRecording = async (): Promise<ParsedTask[] | null> => {
    try {
      if (!recording) {
        throw new Error('No active recording');
      }

      // Stop and unload recording
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      const uri = recording.getURI();
      if (!uri) {
        throw new Error('Recording URI not found');
      }

      setState({ isRecording: false, isProcessing: true, error: null });

      // Transcribe audio
      const transcription = await openAIService.transcribeAudio(uri);

      if (!transcription.trim()) {
        throw new Error('No speech detected');
      }

      // Parse tasks from transcription
      const parsedTasks = await openAIService.parseTasks(transcription);

      // Clean up audio file
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (cleanupError) {
        console.warn('Failed to delete audio file:', cleanupError);
      }

      setState({ isRecording: false, isProcessing: false, error: null });
      setRecording(null);

      return parsedTasks;
    } catch (error) {
      console.error('Recording stop error:', error);
      setState({
        isRecording: false,
        isProcessing: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.VOICE_PROCESSING,
      });
      setRecording(null);
      return null;
    }
  };

  /**
   * Cancel recording
   */
  const cancelRecording = useCallback(async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

        const uri = recording.getURI();
        if (uri) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }
      }
    } catch (error) {
      console.error('Cancel recording error:', error);
    } finally {
      setRecording(null);
      setState({ isRecording: false, isProcessing: false, error: null });
    }
  }, [recording]);

  /**
   * Clear error state
   */
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
