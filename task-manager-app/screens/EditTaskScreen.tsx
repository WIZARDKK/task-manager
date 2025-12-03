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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import TaskInputCard from '../components/addTask/TaskInputCard';
import TaskOptionRow from '../components/addTask/TaskOptionRow';
import DatePickerModal from '../components/addTask/DatePickerModal';
import CategoryPickerModal from '../components/addTask/CategoryPickerModal';
import { getTask, updateTask, deleteTask } from '../api';

type EditTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditTask'>;
type EditTaskScreenRouteProp = RouteProp<RootStackParamList, 'EditTask'>;

interface Props {
  navigation: EditTaskScreenNavigationProp;
  route: EditTaskScreenRouteProp;
}

const EditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params;
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<'Work' | 'Personal'>('Work');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const taskData = await getTask(parseInt(taskId));
      setTitle(taskData.title);
      setNotes(taskData.notes || '');
      setSelectedDate(new Date(taskData.due_date));
      setCategory(taskData.category);
    } catch (error) {
      console.error('Failed to fetch task:', error);
      Alert.alert('Error', 'Failed to load task details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      setSaving(true);

      // Set due date to end of day
      const dueDateISO = new Date(selectedDate);
      dueDateISO.setHours(23, 59, 59, 999);

      await updateTask(parseInt(taskId), {
        title: title.trim(),
        notes: notes.trim(),
        due_date: dueDateISO.toISOString(),
        category: category,
      });

      Alert.alert('Success', 'Task updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Error updating task:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update task. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDueDatePress = () => {
    setShowDatePicker(true);
  };

  const handleCategoryPress = () => {
    setShowCategoryPicker(true);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelectCategory = (cat: 'Work' | 'Personal') => {
    setCategory(cat);
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
              navigation.navigate('Home');
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Task</Text>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={!title.trim() || saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Text style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Task Input Card */}
          <TaskInputCard
            title={title}
            notes={notes}
            onTitleChange={setTitle}
            onNotesChange={setNotes}
          />

          {/* Options Section */}
          <View style={styles.optionsContainer}>
            <TaskOptionRow
              icon="calendar"
              iconColor="#F97316"
              iconBgColor="#FED7AA"
              label="Due Date"
              value={formatDueDate(selectedDate)}
              onPress={handleDueDatePress}
            />

            <TaskOptionRow
              icon="flag"
              iconColor="#2563EB"
              iconBgColor="#DBEAFE"
              label="Category"
              value={category}
              onPress={handleCategoryPress}
            />
          </View>

          {/* Delete Section */}
          <View style={styles.deleteSection}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteTask}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={styles.deleteButtonText}>Delete Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        selectedDate={selectedDate}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={handleSelectDate}
      />

      {/* Category Picker Modal */}
      <CategoryPickerModal
        visible={showCategoryPicker}
        selectedCategory={category}
        onClose={() => setShowCategoryPicker(false)}
        onSelectCategory={handleSelectCategory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
  },
  headerButton: {
    minWidth: 70,
  },
  cancelButton: {
    fontSize: 17,
    color: '#2563EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2563EB',
    textAlign: 'right',
  },
  saveButtonDisabled: {
    color: '#9CA3AF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  deleteSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default EditTaskScreen;
