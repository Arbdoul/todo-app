import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { formatDate, isOverdue } from '../utils/taskHelpers';
import { Task } from '@/type';
import { useTheme } from '@/store/themeStores';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress?: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onPress }) => {
  const { colors } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(task.id);
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onDelete(task.id);
        },
      },
    ]);
  };

  const overdue = isOverdue(task);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress?.(task)}
      activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Checkbox */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handleToggle}
            style={[
              styles.checkbox,
              {
                borderColor: task.completed ? colors.success : colors.border,
                backgroundColor: task.completed ? colors.success : 'transparent',
              },
            ]}>
            {task.completed && <Ionicons name="checkmark" size={18} color="#fff" />}
          </TouchableOpacity>
        </Animated.View>

        {/* Task content */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { color: task.completed ? colors.completed : colors.text },
              task.completed && styles.completedText,
            ]}
            numberOfLines={2}>
            {task.title}
          </Text>

          {task.description && (
            <Text
              style={[
                styles.description,
                { color: colors.textSecondary },
                task.completed && styles.completedText,
              ]}
              numberOfLines={2}>
              {task.description}
            </Text>
          )}

          {/* Due date indicator */}
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={overdue ? colors.error : colors.textSecondary}
              />
              <Text
                style={[
                  styles.dueDate,
                  {
                    color: overdue ? colors.error : colors.textSecondary,
                  },
                ]}>
                {formatDate(task.dueDate)}
              </Text>
            </View>
          )}
        </View>

        {/* Delete button */}
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Overdue indicator */}
      {overdue && <View style={[styles.overdueBar, { backgroundColor: colors.error }]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  overdueBar: {
    height: 3,
    width: '100%',
  },
});
