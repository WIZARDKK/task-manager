import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import TaskHeader from '../components/taskDetails/TaskHeader';
import TaskDetailRow from '../components/taskDetails/TaskDetailRow';
import DeleteTaskFooter from '../components/taskDetails/DeleteTaskFooter';
import { getTask, deleteTask, updateTask } from '../api';

type TaskDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetails'>;
type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

interface Props {
  navigation: TaskDetailsScreenNavigationProp;
  route: TaskDetailsScreenRouteProp;
}

interface TaskData {
  id: number;
  title: string;
  notes: string;
  due_date: string;
  category: 'Work' | 'Personal';
  completed: boolean;
  user?: string;
  created_at?: string;
  updated_at?: string;
}

const TaskDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh task data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTaskDetails();
    }, [taskId])
  );

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const taskData = await getTask(parseInt(taskId));
      setTask({
        ...taskData,
        notes: taskData.notes || '',
      });
    } catch (error) {
      console.error('Failed to fetch task:', error);
      Alert.alert('Error', 'Failed to load task details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('EditTask', { taskId: taskId });
  };

  const handleToggleComplete = async () => {
    if (!task) return;
    
    try {
      // Optimistic update
      setTask({ ...task, completed: !task.completed });
      
      // Update on server
      await updateTask(task.id, { completed: !task.completed });
    } catch (error) {
      console.error('Failed to toggle task:', error);
      // Revert on error
      setTask({ ...task, completed: task.completed });
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDueDatePress = () => {
    Alert.alert('Due Date', 'Date editing will be implemented');
  };

  const handleCategoryPress = () => {
    Alert.alert('Category', 'Category editing will be implemented');
  };

  const handleReminderPress = () => {
    Alert.alert('Reminder', 'Reminder feature coming soon');
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(parseInt(taskId));
              Alert.alert('Success', 'Task deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Task not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Task Details</Text>

        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Task Header */}
        <TaskHeader
          title={task.title}
          notes={task.notes}
          completed={task.completed}
          onToggleComplete={handleToggleComplete}
        />

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <TaskDetailRow
            icon="calendar"
            iconColor="#EF4444"
            iconBgColor="#FEE2E2"
            label="Due Date"
            value={formatDueDate(task.due_date)}
            valueColor="#2563EB"
            onPress={handleDueDatePress}
          />

          <TaskDetailRow
            icon="pricetag"
            iconColor="#2563EB"
            iconBgColor="#DBEAFE"
            label="Category"
            value={task.category}
            onPress={handleCategoryPress}
          />

          <TaskDetailRow
            icon="notifications"
            iconColor="#10B981"
            iconBgColor="#D1FAE5"
            label="Reminder"
            value="No reminder set"
            onPress={handleReminderPress}
          />
        </View>

        {/* Delete Button */}
        <DeleteTaskFooter onPress={handleDeleteTask} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  editButton: {
    minWidth: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#2563EB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default TaskDetailsScreen;