import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import RootNavigator from './navigation/RootNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true); // Loading state for auth check

  // Check if the user is already logged in
  useEffect(() => {
    const checkUserAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // If a token exists, set the user state in UserContext
        // This is handled by the UserProvider, so no need to set it here
      }
      setIsLoading(false); // Stop loading
    };
    checkUserAuth();
  }, []);

  if (isLoading) {
    return null; // Show a splash screen or loading indicator
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <Toaster />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}