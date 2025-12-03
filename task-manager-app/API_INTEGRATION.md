# API Integration Guide

## Overview
This document outlines the API integration between the React Native frontend and Django backend.

## Base Configuration
**API Base URL**: `http://192.168.1.111:8000/api`  
**Storage**: AsyncStorage for JWT tokens and user data

## File Structure
```
api/
├── config.ts           # API endpoints and configuration
├── authApi.ts          # Authentication API calls
├── tasksApi.ts         # Tasks CRUD operations
└── index.ts            # Export barrel file
```

## Authentication Flow

### 1. Registration (SignUpScreen)
- **Endpoint**: `POST /auth/register/`
- **Request**: `{ username, email, password, password2, first_name, last_name }`
- **Response**: `{ user: {...}, access: string, refresh: string }`
- **Storage**: Saves tokens and user data to AsyncStorage
- **Navigation**: Auto-navigates to Home on success

### 2. Login (LoginScreen)
- **Endpoint**: `POST /auth/login/`
- **Request**: `{ username, password }`
- **Response**: `{ access: string, refresh: string, user: {...} }`
- **Storage**: Saves tokens and user data to AsyncStorage
- **Navigation**: Navigates to Home with replace

### 3. Logout (HomeScreen)
- **Endpoint**: `POST /auth/logout/`
- **Request**: `{ refresh_token: string }`
- **Response**: 205 No Content (success)
- **Storage**: Clears all auth data from AsyncStorage
- **Navigation**: Navigates back to Login

### 4. Token Refresh
- **Endpoint**: `POST /auth/token/refresh/`
- **Request**: `{ refresh: string }`
- **Response**: `{ access: string }`
- **Auto-triggered**: When API returns 401 Unauthorized
- **Implemented in**: All authenticated requests via `makeAuthenticatedRequest()`

## Task Management

### 1. Get Tasks (HomeScreen)
- **Endpoint**: `GET /tasks/`
- **Query Params**: Optional `category`, `completed` filters
- **Response**: Array of tasks `[{ id, title, notes, due_date, category, is_completed, user }]`
- **Refresh**: Triggered on screen focus via `useFocusEffect`

### 2. Create Task (AddTaskScreen)
- **Endpoint**: `POST /tasks/`
- **Request**: `{ title, notes, due_date, category }`
- **Response**: Created task object
- **User Assignment**: Automatically assigned to authenticated user in backend
- **Navigation**: Returns to Home with success alert

### 3. Toggle Task Complete (HomeScreen)
- **Endpoint**: `POST /tasks/{id}/toggle_complete/`
- **Response**: Updated task object
- **UI Update**: Optimistic update with error rollback
- **Refresh**: Auto-refreshes task list on success

### 4. Update Task (Not implemented yet)
- **Endpoint**: `PATCH /tasks/{id}/`
- **Request**: `{ title?, notes?, due_date?, category?, is_completed? }`
- **Response**: Updated task object

### 5. Delete Task (Not implemented yet)
- **Endpoint**: `DELETE /tasks/{id}/`
- **Response**: 204 No Content

## Token Management

### Storage Keys
- `accessToken`: JWT access token (1 day lifetime)
- `refreshToken`: JWT refresh token (7 days lifetime)
- `userData`: User profile JSON string

### Automatic Refresh Logic
```typescript
async function makeAuthenticatedRequest(endpoint, method, body?) {
  let accessToken = await getAccessToken();
  
  // First attempt
  let response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  // If 401, refresh token and retry once
  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }
  
  return response;
}
```

## Error Handling

### API Error Responses
Backend returns errors in format:
```json
{
  "detail": "Error message",
  "field_name": ["Error for specific field"]
}
```

### Frontend Parsing
```typescript
try {
  // API call
} catch (error: any) {
  const errorMessage = error.message || 'Operation failed';
  Alert.alert('Error', errorMessage);
}
```

### Network Errors
- Caught in try/catch blocks
- Displayed via Alert.alert
- Console logged for debugging

## Screen Integration Status

### ✅ Completed
- **LoginScreen**: Full authentication with error handling
- **SignUpScreen**: Registration with username generation from email
- **HomeScreen**: Task fetching, toggle complete, logout, loading states
- **AddTaskScreen**: Task creation with loading indicator

### 🔶 Partially Complete
- **AddTaskScreen**: Delete button doesn't do anything (task doesn't exist yet)
- **HomeScreen**: Update/delete not implemented (would need edit screen)

### ⏳ Pending
- Edit task functionality (requires new screen or modal)
- Profile management screen
- Change password screen
- Category management
- Date picker for custom due dates
- Push notifications for task reminders

## Testing Checklist

### Authentication
- [x] User can register with valid credentials
- [x] User can login with email/password
- [x] Invalid credentials show error
- [x] Tokens stored in AsyncStorage
- [x] User can logout
- [x] Logout clears all stored data

### Task Management
- [x] User can view their tasks
- [x] Loading indicator shown while fetching
- [x] User can create new task
- [x] User can toggle task completion
- [x] Task list refreshes on screen focus
- [ ] User can edit existing task
- [ ] User can delete task

### Token Refresh
- [x] Access token auto-refreshes on 401
- [x] Failed refresh redirects to login
- [x] Refresh happens transparently

### User Isolation
- [x] Users only see their own tasks
- [x] Task creation auto-assigns to current user
- [x] Backend validates task ownership

## Development Notes

### Backend Configuration
- **Server**: Running on http://127.0.0.1:8000
- **Database**: MySQL (taskmanager_db)
- **Token Blacklist**: Enabled for logout
- **CORS**: Configured for http://192.168.1.111:8081

### Frontend Configuration
- **Expo SDK**: 54.0.25
- **React Navigation**: Stack navigator
- **Storage**: @react-native-async-storage/async-storage

### Known Limitations
1. No persistent login (need to implement auth check on app start)
2. No global auth context (using local storage helpers)
3. Date picker not implemented (using "Today"/"Tomorrow" defaults)
4. Category picker not implemented (defaults to "Work")
5. No offline support
6. No retry logic for failed requests

## Next Steps

### Priority 1: Authentication Persistence
- Create AuthContext for global auth state
- Check authentication status on app start
- Show splash screen while checking
- Auto-navigate to Home if authenticated

### Priority 2: Edit/Delete Tasks
- Create EditTaskScreen or add edit mode to AddTaskScreen
- Implement updateTask and deleteTask API integration
- Add edit button to task cards in HomeScreen

### Priority 3: Enhanced UX
- Implement date picker for custom due dates
- Add category selector modal
- Add pull-to-refresh on HomeScreen
- Add task search/filter functionality
- Show task statistics/counts

### Priority 4: Production Ready
- Add error boundary component
- Implement retry logic for failed requests
- Add offline indicator
- Add loading skeletons instead of spinners
- Implement toast notifications instead of alerts
- Add form validation messages
- Handle edge cases (no internet, server down, etc.)
