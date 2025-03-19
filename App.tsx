import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import RootNavigator from './navigation/RootNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Separate component that can access the UserContext
function AppContent() {
  return (
    <>
      <Toaster />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
