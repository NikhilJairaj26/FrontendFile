import React, { useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, Alert, 
  ActivityIndicator, StyleSheet, KeyboardAvoidingView, 
  Platform, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/authService';
import { useUser } from '../context/UserContext';
import { LoginScreenNavigationProp } from '../types';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setUser } = useUser();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await login(email, password);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      const { token, user } = response;
      
      // Save user data to AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userEmail', user.email);
      
      // Update user context
      setUser({ email: user.email, token });
      
      // No need to navigate - RootNavigator will handle this automatically
    } catch (err) {
      let errorMessage = 'Something went wrong';
      
      if (err instanceof Error) {
        console.error('Login failed:', err.message);
        
        if (err.message.includes('Network request failed')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = 'Invalid email or password';
        }
      }
      
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Login</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  innerContainer: {
    width: '100%',
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#333' 
  },
  input: { 
    height: 45, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 12, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    fontSize: 16, 
    color: '#333' 
  },
  error: { 
    color: 'red', 
    marginBottom: 12, 
    textAlign: 'center', 
    fontSize: 14 
  },
  button: { 
    backgroundColor: '#4a26fd', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  buttonDisabled: { 
    backgroundColor: 'gray' 
  },
  link: { 
    color: '#4a26fd', 
    marginTop: 12, 
    textAlign: 'center', 
    fontSize: 14 
  },
});
