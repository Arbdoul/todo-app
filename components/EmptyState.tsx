import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/store/themeStores';
interface EmptyStateProps {
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No tasks yet',
  icon = 'checkmark-circle-outline',
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={80} color={colors.textSecondary} style={styles.icon} />
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Tap the + button to add a task
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    opacity: 0.3,
    marginBottom: 16,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
