import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialLoginButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onPress }) => {
  const isGoogle = provider === 'google';

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isGoogle ? (
        <Ionicons name="logo-google" size={24} color="#4285F4" />
      ) : (
        <Ionicons name="logo-apple" size={24} color="#000000" />
      )}
      <Text style={styles.text}>
        Sign in with {isGoogle ? 'Google' : 'Apple'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
});

export default SocialLoginButton;