// API Configuration
// Base URL for the backend API

// For Android Emulator use: http://10.0.2.2:8000
// For iOS Simulator use: http://localhost:8000
// For Physical Device use your computer's IP: http://192.168.1.X:8000

// Change this based on your setup:
// export const API_BASE_URL = 'http://10.0.2.2:8000/api';  // Android Emulator
// export const API_BASE_URL = 'http://localhost:8000/api';  // iOS Simulator
export const API_BASE_URL = 'http://192.168.1.111:8000/api';  // Physical Device (Expo Go)

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: '/auth/register/',
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  TOKEN_REFRESH: '/auth/token/refresh/',
  PROFILE: '/auth/profile/',
  CHANGE_PASSWORD: '/auth/change-password/',
  CHANGE_EMAIL: '/auth/change-email/',
  
  // Password Reset
  FORGOT_PASSWORD: '/auth/forgot-password/',
  VERIFY_OTP: '/auth/verify-otp/',
  RESET_PASSWORD: '/auth/reset-password/',
  
  // Tasks
  TASKS: '/tasks/',
  TASK_DETAIL: (id: number) => `/tasks/${id}/`,
  TASK_TOGGLE: (id: number) => `/tasks/${id}/toggle_complete/`,
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
};
