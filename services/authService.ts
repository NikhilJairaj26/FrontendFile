import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Use a valid API URL (Ensure this is environment-configurable)
const API_URL = "http://192.168.137.108:5000/api";

// ✅ User Interface
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ✅ Authentication Response Interface
interface AuthResponse {
  token: string;
  user: User;
}

// ✅ Securely store token
const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("❌ Error storing token:", error instanceof Error ? error.message : error);
  }
};

// ✅ Retrieve stored token
const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.error("❌ Error fetching token:", error instanceof Error ? error.message : error);
    return null;
  }
};

// ✅ Remove token (logout)
const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.error("❌ Error removing token:", error instanceof Error ? error.message : error);
  }
};

// ✅ General function to handle API requests
const apiRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: object,
  auth: boolean = false
): Promise<T> => {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };

    if (auth) {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized: No token found");
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server Error: ${response.status}`);
    }

    return response.status !== 204 ? await response.json() : (null as T); // Handle empty responses
  } catch (error) {
    console.error("❌ API Request Error:", error instanceof Error ? error.message : "Network request failed");
    throw new Error(error instanceof Error ? error.message : "Network request failed");
  }
};

// ✅ Login function
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>("/auth/login", "POST", { email, password });
  await storeToken(data.token);
  return data;
};

// ✅ Register function
export const register = async (email: string, password: string, repassword: string, avatar?: string): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>("/auth/register", "POST", { email, password, repassword, avatar });
  await storeToken(data.token);
  return data;
};

// ✅ Logout function
export const logout = async (): Promise<void> => {
  await removeToken();
  console.log("✅ Successfully logged out");
};

// ✅ Get authenticated user
export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    const data = await apiRequest<{ user: User }>("/auth/user", "GET", undefined, true);
    return data?.user || null;
  } catch (error) {
    console.error("❌ Error fetching user:", error instanceof Error ? error.message : error);
    return null;
  }
};
