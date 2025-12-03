import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskItemProps {
  id: string;
  title: string;
  dueDate: string;
  category: 'Work' | 'Personal';
  completed: boolean;
  overdue?: boolean;
  onToggleComplete: (id: string) => void;
  onPress: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  dueDate,
  category,
  completed,
  overdue = false,
  onToggleComplete,
  onPress,
}) => {
  const categoryColor = category === 'Work' ? '#FED7AA' : '#BBF7D0';
  const categoryTextColor = category === 'Work' ? '#C2410C' : '#15803D';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggleComplete(id)}
        activeOpacity={0.7}
      >
        {completed ? (
          <View style={styles.checkboxChecked}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </View>
        ) : (
          <View style={styles.checkboxUnchecked} />
        )}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            completed && styles.titleCompleted,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.dueDate,
            overdue && !completed && styles.dueDateOverdue,
          ]}
        >
          {dueDate}
        </Text>
      </View>

      <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
        <Text style={[styles.categoryText, { color: categoryTextColor }]}>
          {category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkboxUnchecked: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  checkboxChecked: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  dueDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  dueDateOverdue: {
    color: '#EF4444',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TaskItem;
