// Authentication API Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from './config';

// ============= TYPES =============
export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  user: UserData;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

// ============= STORAGE HELPERS =============
export const storeTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

export const storeUserData = async (userData: UserData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

// ============= API CALLS =============

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || JSON.stringify(responseData));
    }

    // Store tokens and user data
    await storeTokens(responseData.tokens.access, responseData.tokens.refresh);
    await storeUserData(responseData.user);

    return responseData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Login failed');
    }

    // Store tokens and user data
    await storeTokens(responseData.tokens.access, responseData.tokens.refresh);
    await storeUserData(responseData.user);

    return responseData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (accessToken && refreshToken) {
      // Call logout endpoint to blacklist token
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API call success
    await clearAuthData();
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TOKEN_REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    // Store new access token
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);

    return data.access;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear auth data if refresh fails
    await clearAuthData();
    return null;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserData> => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      // Try to refresh token
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry with new token
        return getUserProfile();
      }
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    await storeUserData(data);
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = await getAccessToken();
  return !!accessToken;
};

/**
 * Change user password
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHANGE_PASSWORD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to change password');
  }

  const data = await response.json();
  return data;
};

/**
 * Change user email
 */
export const changeEmail = async (password: string, newEmail: string): Promise<{ email: string }> => {
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHANGE_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      password: password,
      new_email: newEmail,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to change email');
  }

  const data = await response.json();
  
  // Update stored user data with new email
  const userData = await getUserData();
  if (userData) {
    userData.email = data.email;
    await storeUserData(userData);
  }
  
  return data;
};

/**
 * Request password reset - sends OTP to email
 */
export const requestPasswordReset = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send OTP');
  }

  return await response.json();
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (email: string, otp_code: string) => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_OTP}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp_code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Handle validation errors from DRF
    if (errorData.non_field_errors) {
      throw new Error(errorData.non_field_errors[0]);
    }
    throw new Error(errorData.error || 'Invalid OTP code');
  }

  return await response.json();
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (
  email: string,
  otp_code: string,
  new_password: string,
  confirm_password: string
) => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      otp_code,
      new_password,
      confirm_password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Handle validation errors
    if (errorData.non_field_errors) {
      throw new Error(errorData.non_field_errors[0]);
    }
    if (errorData.confirm_password) {
      throw new Error(errorData.confirm_password[0]);
    }
    if (errorData.new_password) {
      throw new Error(errorData.new_password[0]);
    }
    throw new Error(errorData.error || 'Failed to reset password');
  }

  return await response.json();
};
