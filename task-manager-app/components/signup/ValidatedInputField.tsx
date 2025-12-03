import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ValidatedInputFieldProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  error?: string;
  showVisibilityToggle?: boolean;
}

const ValidatedInputField: React.FC<ValidatedInputFieldProps> = ({
  label,
  isPassword = false,
  error,
  showVisibilityToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {showVisibilityToggle && isPassword && (
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Text style={styles.visibilityText}>visibility</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  visibilityButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  visibilityText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 6,
  },
});

export default ValidatedInputField;