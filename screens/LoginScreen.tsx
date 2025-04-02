import React, { useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, Alert, 
  ActivityIndicator, StyleSheet, KeyboardAvoidingView, 
  Platform, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { useUser } from '../context/UserContext';
import { LoginScreenNavigationProp } from '../types';

// Backend API URL
const API_URL = "http://192.168.137.108:5000/api/auth/login";

export default function LoginScreen() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setUser } = useUser();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
  
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || '❌ Login failed. Please try again.');
      }
  
      const { token, user } = responseData;
      if (!token || !user) {
        throw new Error("Invalid server response. Please try again.");
      }
  
      await AsyncStorage.multiSet([
        ['auth_token', token],
        ['userEmail', user.email],
        ['userId', user.id],
        ['userName', user.name]
      ]);
  
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        token
      });
  
      Alert.alert("🎉 Success", "Login successful!");
      // navigation.navigate("Profile"); // Navigate to the Profile screen
  
    } catch (err: any) {
      setError(err.message || "❌ Login failed. Please try again.");
      Alert.alert("⚠️ Login Failed", err.message || "Login failed.");
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

// Styles
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
