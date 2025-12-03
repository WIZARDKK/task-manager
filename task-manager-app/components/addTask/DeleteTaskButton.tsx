import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface DeleteTaskButtonProps {
  onPress: () => void;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>Delete Task</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default DeleteTaskButton;
