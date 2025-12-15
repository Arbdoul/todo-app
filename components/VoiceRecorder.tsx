// components/VoiceRecorder.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ParsedTask } from '@/type';
import { useTheme } from '@/store/ThemeStore';
import { useVoiceInput } from '@/hook/useVoiceInput';

interface VoiceRecorderProps {
  visible: boolean;
  onClose: () => void;
  onTasksCreated: (tasks: ParsedTask[]) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  visible,
  onClose,
  onTasksCreated,
}) => {
  const { colors } = useTheme();
  const {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError,
  } = useVoiceInput();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for recording indicator
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  // Auto-start recording when modal opens
  useEffect(() => {
    if (visible && !isRecording && !isProcessing) {
      startRecording();
    }
  }, [visible]);

  const handleStop = async () => {
    const tasks = await stopRecording();
    if (tasks && tasks.length > 0) {
      onTasksCreated(tasks);
      onClose();
    }
  };

  const handleCancel = async () => {
    await cancelRecording();
    clearError();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isProcessing ? 'Processing...' : 'Voice Input'}
            </Text>
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Recording indicator */}
          <View style={styles.content}>
            {isProcessing ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <Animated.View
                style={[
                  styles.recordingIndicator,
                  {
                    backgroundColor: colors.error,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}>
                <Ionicons name="mic" size={40} color="#fff" />
              </Animated.View>
            )}

            <Text style={[styles.message, { color: colors.text }]}>
              {isProcessing ? 'Converting speech to tasks...' : 'Speak your tasks now'}
            </Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
                <Ionicons name="warning" size={20} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}

            {!isProcessing && !error && (
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Example: "Buy groceries and call mom"
              </Text>
            )}
          </View>

          {/* Action buttons */}
          {isRecording && !isProcessing && (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.error }]}
                onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.success }]}
                onPress={handleStop}>
                <Ionicons name="checkmark" size={24} color="#fff" />
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  recordingIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
