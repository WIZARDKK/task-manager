import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useFocusEffect } from '@react-navigation/native';
import HomeHeader from '../components/home/HomeHeader';
import SearchBarSimple from '../components/home/SearchBarSimple';
import CategorySection from '../components/home/CategorySection';
import TaskItem from '../components/home/TaskItem';
import EmptyState from '../components/home/EmptyState';
import FABButton from '../components/home/FABButton';
import { getTasks, toggleTaskComplete, getUserData, logout } from '../api';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  category: 'Work' | 'Personal';
  completed: boolean;
  overdue?: boolean;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const apiTasks = await getTasks();
      
      // Transform API tasks to match our interface
      const transformedTasks: Task[] = apiTasks.map(task => ({
        id: task.id.toString(),
        title: task.title,
        dueDate: formatDueDate(task.due_date),
        category: task.category,
        completed: task.completed,
        overdue: isOverdue(task.due_date),
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUserName(userData.first_name || userData.username);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  // Format due date for display
  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Due Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Due Tomorrow';
    } else if (date < now) {
      return 'Due Yesterday';
    } else {
      return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  };

  // Check if task is overdue
  const isOverdue = (dateString: string): boolean => {
    return new Date(dateString) < new Date();
  };

  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
      fetchUserData();
    }, [])
  );

  const handleToggleComplete = async (id: string) => {
    try {
      // Optimistic update
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );

      // Call API
      await toggleTaskComplete(parseInt(id));
    } catch (error) {
      console.error('Failed to toggle task:', error);
      // Revert on error
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleTaskPress = (id: string) => {
    navigation.navigate('TaskDetails', { taskId: id });
  };

  const handleAddTask = () => {
    navigation.navigate('AddTask');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Profile');
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate tasks by category
  const workTasks = filteredTasks.filter(t => t.category === 'Work');
  const personalTasks = filteredTasks.filter(t => t.category === 'Personal');

  // Check if all tasks are completed
  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <HomeHeader
        userName={userName}
        onSettingsPress={handleSettingsPress}
      />

      {loading ? (
        // Loading indicator
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        // Content
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <SearchBarSimple
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Work Tasks Section */}
        {workTasks.length > 0 && (
          <>
            <CategorySection title="Work" count={workTasks.length} />
            <View style={styles.taskList}>
              {workTasks.map(task => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggleComplete={handleToggleComplete}
                  onPress={handleTaskPress}
                />
              ))}
            </View>
          </>
        )}

        {/* Personal Tasks Section */}
        {personalTasks.length > 0 && (
          <>
            <CategorySection title="Personal" count={personalTasks.length} />
            <View style={styles.taskList}>
              {personalTasks.map(task => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggleComplete={handleToggleComplete}
                  onPress={handleTaskPress}
                />
              ))}
            </View>
          </>
        )}

          {/* Empty State */}
          {(allCompleted || tasks.length === 0) && <EmptyState />}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      {!loading && <FABButton onPress={handleAddTask} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  taskList: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;