import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ChangeEmailScreen from './screens/ChangeEmailScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import EditTaskScreen from './screens/EditTaskScreen';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  AddTask: undefined;
  Profile: undefined;
  ChangePassword: undefined;
  ChangeEmail: undefined;
  TaskDetails: { taskId: string };
  EditTask: { taskId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F9FAFB' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
        <Stack.Screen 
          name="EditTask" 
          component={EditTaskScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
