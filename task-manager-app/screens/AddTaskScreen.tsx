import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import TaskInputCard from '../components/addTask/TaskInputCard';
import TaskOptionRow from '../components/addTask/TaskOptionRow';
import DeleteTaskButton from '../components/addTask/DeleteTaskButton';
import DatePickerModal from '../components/addTask/DatePickerModal';
import CategoryPickerModal from '../components/addTask/CategoryPickerModal';
import { createTask } from '../api';

type AddTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTask'>;

interface Props {
  navigation: AddTaskScreenNavigationProp;
}

const AddTaskScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [category, setCategory] = useState<'Work' | 'Personal'>('Work');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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
    if (!title.trim() && !notes.trim()) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to discard this task?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      setLoading(true);

      // Set due date to end of day
      const dueDateISO = new Date(selectedDate);
      dueDateISO.setHours(23, 59, 59, 999);

      await createTask({
        title: title.trim(),
        notes: notes.trim(),
        due_date: dueDateISO.toISOString(),
        category: category,
      });

      Alert.alert('Success', 'Task created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Error creating task:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create task. Please try again.'
      );
    } finally {
      setLoading(false);
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
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Deleted') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Task</Text>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={!title.trim() || loading}
        >
          {loading ? (
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

          {/* Delete Button */}
          <View style={styles.deleteContainer}>
            <DeleteTaskButton onPress={handleDeleteTask} />
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
  deleteContainer: {
    marginTop: 20,
  },
});

export default AddTaskScreen;