import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DeleteTaskFooterProps {
  onPress: () => void;
}

const DeleteTaskFooter: React.FC<DeleteTaskFooterProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="trash-outline" size={24} color="#EF4444" />
      <Text style={styles.text}>Delete Task</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    gap: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default DeleteTaskFooter;