# API Testing Guide

## Test Authentication Endpoints

### 1. Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#",
    "password2": "Test123!@#",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Expected Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJh...",
    "access": "eyJ0eXAiOiJKV1QiLCJh..."
  },
  "message": "User registered successfully"
}
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!@#"
  }'
```

**Save the access token from response for next requests**

### 3. Get User Profile
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```



### 4. Logout
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

## For React Native Integration

### 1. Install AsyncStorage
```bash
npx expo install @react-native-async-storage/async-storage
```

### 2. Login Example
```javascript
const login = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store tokens
      await AsyncStorage.setItem('accessToken', data.tokens.access);
      await AsyncStorage.setItem('refreshToken', data.tokens.refresh);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

### 3. Get Tasks Example
```javascript
const getTasks = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    
    const response = await fetch('http://localhost:8000/api/tasks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      // Token expired, refresh it
      await refreshToken();
      return getTasks(); // Retry
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    throw error;
  }
};
```

### 4. Token Refresh Example
```javascript
const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('accessToken', data.access);
      return data.access;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    // Logout user if refresh fails
    await logout();
  }
};
```

## Important Notes

1. **Token Lifetimes:**
   - Access Token: 1 day
   - Refresh Token: 7 days

2. **User Isolation:**
   - Each user can only see/manage their own tasks
   - Tasks are automatically assigned to the authenticated user

3. **Error Handling:**
   - 401: Unauthorized (invalid/expired token)
   - 400: Bad Request (validation errors)
   - 404: Not Found
   - 201: Created
   - 200: Success

4. **CORS:**
   - Already configured for localhost:8081 and your local network IP
   - Update CORS_ALLOWED_ORIGINS in settings.py for production
