import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { filterTasks, sortTasks, searchTasks, getTaskStats } from '../../utils/taskHelpers';
import { useTaskStore } from '@/store/taskStore';
import { TaskFilter, TaskSort } from '@/type';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TaskItem } from '@/components/TaskItem';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useTheme } from '@/store/themeStores';
export default function HomeScreen() {
  const router = useRouter();

  const tasks = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const addTask = useTaskStore((state) => state.addTask);
  const clearCompleted = useTaskStore((state) => state.clearCompleted);

  const { colors, isDark } = useTheme();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sortBy, setSortBy] = useState<TaskSort>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const filteredTasks = sortTasks(searchTasks(filterTasks(tasks, filter), searchQuery), sortBy);

  const stats = getTaskStats(tasks);

  const handleVoiceTasksCreated = async (
    parsedTasks: Array<{ title: string; description?: string }>
  ) => {
    try {
      for (const task of parsedTasks) {
        await addTask({
          title: task.title,
          description: task.description,
          completed: false,
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Success',
        `${parsedTasks.length} task${parsedTasks.length > 1 ? 's' : ''} added!`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add tasks');
    }
  };

  const handleClearCompleted = () => {
    if (stats.completed === 0) return;

    Alert.alert(
      'Clear Completed',
      `Delete ${stats.completed} completed task${stats.completed > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCompleted();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const renderFilterButton = (filterType: TaskFilter, label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === filterType ? colors.primary : colors.surface,
        },
      ]}
      onPress={() => {
        setFilter(filterType);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}>
      <Text
        style={[
          styles.filterText,
          {
            color: filter === filterType ? '#fff' : colors.text,
          },
        ]}>
        {label} {count > 0 && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {stats.active} active • {stats.completed} completed
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All', stats.total)}
        {renderFilterButton('active', 'Active', stats.active)}
        {renderFilterButton('completed', 'Completed', stats.completed)}
      </View>

      {/* Sort selector */}
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Sort by:</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const sorts: TaskSort[] = ['date', 'dueDate', 'alphabetical'];
            const currentIndex = sorts.indexOf(sortBy);
            setSortBy(sorts[(currentIndex + 1) % sorts.length]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}>
          <Text style={[styles.sortText, { color: colors.primary }]}>
            {sortBy === 'date' && 'Date Created'}
            {sortBy === 'dueDate' && 'Due Date'}
            {sortBy === 'alphabetical' && 'A-Z'}
          </Text>
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onPress={(task) => router.push(`/add-task?id=${task.id}`)}
          />
        )}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            message={
              searchQuery
                ? 'No tasks found'
                : filter === 'active'
                  ? 'No active tasks'
                  : filter === 'completed'
                    ? 'No completed tasks'
                    : 'No tasks yet'
            }
          />
        }
      />

      {/* Bottom actions */}
      {stats.completed > 0 && (
        <View style={[styles.bottomActions, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCompleted}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={[styles.clearButtonText, { color: colors.error }]}>
              Clear Completed ({stats.completed})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FABs */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.voiceFab, { backgroundColor: colors.secondary }]}
          onPress={() => setShowVoiceModal(true)}>
          <Ionicons name="mic" size={22} color="#fff" />
        </TouchableOpacity>
        <FAB onPress={() => router.push('/add-task')} />
      </View>

      {/* Voice recorder modal */}
      <VoiceRecorder
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onTasksCreated={handleVoiceTasksCreated}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 14,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  bottomActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    // position: 'absolute',
    // bottom: 24,
    // right: 24,
    // alignItems: 'center',
    // gap: 16,
  },
  voiceFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
