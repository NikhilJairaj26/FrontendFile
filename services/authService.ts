import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API URL from environment variables or default to a local URL
const API_URL = process.env.API_URL || 'http://192.168.79.108:5000/api';

// Define the structure of the response data
interface AuthResponse {
  token: string;
  user: {
    email: string;
  };
}

// Login function
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    await AsyncStorage.setItem('token', data.token); // Save token to AsyncStorage
    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw new Error('Network request failed. Please check your connection.');
  }
};

// Register function
export const register = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    await AsyncStorage.setItem('token', data.token); // Save token to AsyncStorage
    return data;
  } catch (err) {
    console.error('Registration error:', err);
    throw new Error('Network request failed. Please check your connection.');
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
};