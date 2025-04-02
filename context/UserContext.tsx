import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define user state interface
export interface UserState {
  id?: string;
  name?: string;
  email: string;
  token: string;
}

// Define context interface
interface UserContextType {
  user: UserState | null;
  setUser: (user: UserState | null) => Promise<void>;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser && isMounted) {
          setUserState(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, []);

  // Function to update user state and persist it
  const setUser = useCallback(async (userData: UserState | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem("user");
      }
      setUserState(userData);
    } catch (error) {
      console.error("❌ Error saving user data:", error);
    }
  }, []);

  // Function to refresh user state from AsyncStorage
  const refreshUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id && parsedUser?.email) {
          setUserState(parsedUser);
        } else {
          console.warn("⚠️ Invalid user data found in storage, resetting...");
          await AsyncStorage.removeItem("user");
          setUserState(null);
        }
      } else {
        setUserState(null);
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUserState(null);
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
