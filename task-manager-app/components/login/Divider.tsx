import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DividerProps {
  text?: string;
}

const Divider: React.FC<DividerProps> = ({ text = 'OR' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  text: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default Divider;
