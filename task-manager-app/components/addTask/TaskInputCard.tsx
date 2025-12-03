import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface TaskInputCardProps {
  title: string;
  notes: string;
  onTitleChange: (text: string) => void;
  onNotesChange: (text: string) => void;
}

const TaskInputCard: React.FC<TaskInputCardProps> = ({
  title,
  notes,
  onTitleChange,
  onNotesChange,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="What do you need to do?"
        placeholderTextColor="#B0B5BD"
        value={title}
        onChangeText={onTitleChange}
        multiline
      />
      
      <View style={styles.divider} />
      
      <TextInput
        style={styles.notesInput}
        placeholder="Notes"
        placeholderTextColor="#B0B5BD"
        value={notes}
        onChangeText={onNotesChange}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titleInput: {
    fontSize: 18,
    color: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 60,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },
  notesInput: {
    fontSize: 16,
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    minHeight: 200,
  },
});

export default TaskInputCard;