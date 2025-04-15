import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { RegistrationProvider } from './src/contexts/RegistrationContext';
import { LogBox } from 'react-native';

// Initialize Firebase
import './src/config/firebase';

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted',
  'Failed to get FCM registration token',
]);

export default function App() {
  useEffect(() => {
    // Any app initialization code can go here
    console.log('App initialized');
  }, []);

  return (
    <SafeAreaProvider>
      <RegistrationProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </RegistrationProvider>
    </SafeAreaProvider>
  );
}
