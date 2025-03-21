import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Define User State Interface
export interface UserState {
  id: string;
  name: string;
  email: string;
  token: string;
}

// ✅ Define Context Interface
interface UserContextType {
  user: UserState | null;
  setUser: (user: UserState | null) => Promise<void>;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ✅ Create Context with Default Values
const UserContext = createContext<UserContextType | undefined>(undefined);

// ✅ Provider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load user from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser && isMounted) {
          const parsedUser: UserState = JSON.parse(storedUser);
          if (parsedUser.id && parsedUser.email && parsedUser.token) {
            setUserState(parsedUser);
          } else {
            console.warn("⚠️ Invalid user data found, resetting...");
            await AsyncStorage.removeItem("user");
            setUserState(null);
          }
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false; // ✅ Cleanup function to prevent memory leaks
    };
  }, []);

  // ✅ Function to update user state and persist it
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

  // ✅ Function to refresh user state from AsyncStorage
  const refreshUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser: UserState = JSON.parse(storedUser);
        if (parsedUser?.id && parsedUser?.email && parsedUser?.token) {
          setUserState(parsedUser);
        } else {
          console.warn("⚠️ Invalid user data, resetting storage...");
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

  // ✅ Logout Function
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUserState(null);
      console.log("✅ Successfully logged out");
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

// ✅ Custom Hook for Using User Context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
