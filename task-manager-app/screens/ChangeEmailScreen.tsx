import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import ValidatedInputField from '../components/signup/ValidatedInputField';
import { changeEmail, getUserData } from '../api';

type ChangeEmailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChangeEmail'>;

interface Props {
  navigation: ChangeEmailScreenNavigationProp;
}

const ChangeEmailScreen: React.FC<Props> = ({ navigation }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    newEmail: '',
    password: '',
  });

  useEffect(() => {
    fetchCurrentEmail();
  }, []);

  const fetchCurrentEmail = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setCurrentEmail(userData.email);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeEmail = async () => {
    // Reset errors
    const newErrors = {
      newEmail: '',
      password: '',
    };

    // Validate new email
    if (!newEmail.trim()) {
      newErrors.newEmail = 'New email is required';
    } else if (!validateEmail(newEmail)) {
      newErrors.newEmail = 'Please enter a valid email address';
    } else if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      newErrors.newEmail = 'New email must be different from current email';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required to verify your identity';
    }

    setErrors(newErrors);

    // If there are any errors, don't proceed
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // Proceed with email change
    setLoading(true);
    try {
      await changeEmail(password, newEmail.trim());
      
      Alert.alert(
        'Success',
        'Your email has been changed successfully',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to change email. Please try again.';
      
      // Check if it's incorrect password error
      if (errorMessage.toLowerCase().includes('incorrect') || 
          errorMessage.toLowerCase().includes('password')) {
        setErrors({
          newEmail: '',
          password: 'Password is incorrect',
        });
      } else if (errorMessage.toLowerCase().includes('already in use') ||
                 errorMessage.toLowerCase().includes('email is already')) {
        setErrors({
          newEmail: 'This email is already in use',
          password: '',
        });
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isFormValid = newEmail && password;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Change Email</Text>

        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Info Text */}
          <Text style={styles.infoText}>
            Enter your new email address and confirm with your password
          </Text>

          {/* Current Email Display */}
          <View style={styles.currentEmailContainer}>
            <Text style={styles.currentEmailLabel}>Current Email</Text>
            <View style={styles.currentEmailBox}>
              <Ionicons name="mail" size={20} color="#6B7280" />
              <Text style={styles.currentEmailText}>{currentEmail}</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <ValidatedInputField
              label="New Email"
              placeholder="Enter your new email address"
              value={newEmail}
              onChangeText={setNewEmail}
              error={errors.newEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ValidatedInputField
              label="Password"
              placeholder="Enter your password to confirm"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              isPassword
              showVisibilityToggle
            />

            {/* Change Email Button */}
            <TouchableOpacity
              style={[
                styles.changeButton,
                !isFormValid && styles.changeButtonDisabled,
              ]}
              onPress={handleChangeEmail}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.changeButtonText,
                  !isFormValid && styles.changeButtonTextDisabled,
                ]}
              >
                {loading ? 'Changing Email...' : 'Change Email'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color="#2563EB" />
              <Text style={styles.infoBoxText}>
                Your password is required to verify this change
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color="#2563EB" />
              <Text style={styles.infoBoxText}>
                Make sure you have access to your new email address
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  infoText: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  currentEmailContainer: {
    marginBottom: 24,
  },
  currentEmailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  currentEmailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentEmailText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  changeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  changeButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  changeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  changeButtonTextDisabled: {
    color: '#9CA3AF',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default ChangeEmailScreen;
