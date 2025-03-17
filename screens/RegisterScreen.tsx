import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { register } from '../services/authService';
import { useUser } from '../context/UserContext';
import { RegisterScreenNavigationProp } from '../types';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { setUser } = useUser(); // Use setUser from UserContext

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { token, user } = await register(email, password);
      setUser({ token, email: user.email }); // Update user state
      Alert.alert('Registration Successful', 'You can now log in with your credentials.');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Registration failed. Please try again.');
      Alert.alert('Registration Failed', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={isLoading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={isLoading} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  link: { color: '#4a26fd', marginTop: 10, textAlign: 'center' },
});