import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoutButtonLargeProps {
  onPress: () => void;
}

const LogoutButtonLarge: React.FC<LogoutButtonLargeProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="log-out-outline" size={26} color="#EF4444" />
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginHorizontal: 20,
    gap: 12,
  },
  text: {
    fontSize: 19,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default LogoutButtonLarge;