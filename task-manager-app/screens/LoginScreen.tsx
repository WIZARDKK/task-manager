import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import AppLogo from '../components/login/AppLogo';
import InputField from '../components/login/InputField';
import PrimaryButton from '../components/login/PrimaryButton';
import Divider from '../components/login/Divider';
import SocialLoginButton from '../components/login/SocialLoginButton';
import { login } from '../api'; // Import API function

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const handleLogin = async () => {
    // Reset errors
    setErrors({ email: '', password: '', general: '' });

    // Basic validation
    const newErrors = { email: '', password: '', general: '' };
    
    if (!email.trim()) {
      newErrors.email = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Call login API
      const response = await login({
        username: email.trim(),
        password: password,
      });

      // Login successful - navigate to Home
      navigation.replace('Home');
    } catch (error: any) {
      // Login failed - show error message
      const errorMessage = error.message || 'Login failed. Please try again.';
      
      // Check if it's invalid credentials
      if (errorMessage.toLowerCase().includes('credential') || 
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('incorrect')) {
        setErrors({ 
          email: '', 
          password: '', 
          general: 'Invalid username or password. Please try again.' 
        });
      } else {
        setErrors({ email: '', password: '', general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Sign in with Google');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Sign in with Apple');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo and Title */}
          <View style={styles.header}>
            <AppLogo appName="TaskFlow" />
            <Text style={styles.welcomeText}>Welcome back! Please log in to your account.</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Error Message Banner */}
            {errors.general ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            ) : null}

            <InputField
              label="Username"
              placeholder="Enter your username"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email || errors.general) {
                  setErrors({ email: '', password: '', general: '' });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password || errors.general) {
                  setErrors({ email: '', password: '', general: '' });
                }
              }}
              isPassword
              error={errors.password}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <PrimaryButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              disabled={!email || !password}
            />

            {/* Sign Up Button */}
            <PrimaryButton
              title="Sign Up"
              onPress={handleSignUp}
              variant="secondary"
            />

            {/* Divider */}
            <Divider text="OR" />

            {/* Social Login Buttons */}
            <SocialLoginButton provider="google" onPress={handleGoogleLogin} />
            <SocialLoginButton provider="apple" onPress={handleAppleLogin} />
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoginScreen;