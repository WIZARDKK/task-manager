import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppLogoProps {
  appName?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ appName = 'TaskFlow' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="checkmark-circle" size={64} color="#FFFFFF" />
      </View>
      <Text style={styles.appName}>{appName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default AppLogo;