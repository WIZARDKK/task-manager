import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TaskHeaderProps {
  title: string;
  notes: string;
  completed: boolean;
  onToggleComplete: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  title,
  notes,
  completed,
  onToggleComplete,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onToggleComplete}
        activeOpacity={0.7}
      >
        {completed ? (
          <View style={styles.checkboxChecked}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        ) : (
          <View style={styles.checkboxUnchecked} />
        )}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text
          style={[styles.title, completed && styles.titleCompleted]}
          numberOfLines={3}
        >
          {title}
        </Text>
        {notes ? (
          <Text style={styles.notes} numberOfLines={5}>
            {notes}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
  },
  checkboxContainer: {
    marginRight: 16,
    marginTop: 4,
  },
  checkboxUnchecked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  checkboxChecked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 34,
    marginBottom: 12,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  notes: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});

export default TaskHeader;