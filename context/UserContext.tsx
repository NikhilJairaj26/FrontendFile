import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  token: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // Load user data on app startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const email = await AsyncStorage.getItem('email');
        if (token && email) {
          setUserState({ token, email });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUser();
  }, []);

  // Save user data and update state
  const setUser = async (newUser: User | null) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem('token', newUser.token);
        await AsyncStorage.setItem('email', newUser.email);
        setUserState(newUser);
      } else {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        setUserState(null);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      setUserState(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
