import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner-native";
import CustomText from "../components/CustomText";
import { LoginScreenNavigationProp } from "types";
import { CommonActions } from "@react-navigation/native";

// User type definition
type User = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  device: string;
};

export default function ProfileScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const systemColorScheme = useColorScheme();

  // Settings state
  const [wifiOnly, setWifiOnly] = useState<boolean>(true);
  const [autoAccept, setAutoAccept] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(systemColorScheme === 'dark');
  const [notifications, setNotifications] = useState<boolean>(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from AsyncStorage
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedUserName = await AsyncStorage.getItem("userName");
      const storedUserEmail = await AsyncStorage.getItem("userEmail");
      if (!storedUserId || !storedUserName || !storedUserEmail) {
        toast("User data not found!");
        return;
      }
      setUser({
        _id: storedUserId,
        name: storedUserName,
        email: storedUserEmail,
        avatar: "https://via.placeholder.com/70",
        device: "Unknown Device",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["auth_token", "userId", "userName", "userEmail"]);
      toast("Logged out successfully");
      navigation.navigate('Login')
    } catch (error) {
      console.error("Logout error:", error);
      toast("Logout failed");
    }
  };

  const getThemeColors = () => {
    return {
      background: darkMode ? '#1a1a1a' : '#f8f9fa',
      card: darkMode ? '#2d2d2d' : '#fff',
      text: darkMode ? '#ffffff' : '#333333',
      border: darkMode ? '#404040' : '#e0e0e0',
    };
  };

  const theme = getThemeColors();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#4a26fd" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <CustomText style={[styles.headerTitle, { color: theme.text }]}>Profile</CustomText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
          <Image source={{ uri: user?.avatar }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <TextInput
              style={[styles.profileName, { color: theme.text }]}
              value={user?.name}
              onChangeText={(text) => setUser((prev) => (prev ? { ...prev, name: text } : prev))}
              placeholder="Enter name"
              placeholderTextColor={darkMode ? '#888' : '#666'}
            />
            <CustomText style={[styles.profileDevice, { color: theme.text }]}>{user?.device}</CustomText>
          </View>
        </View>

        {/* Transfer Settings */}
        <SettingsSection 
          title="Transfer Settings" 
          settings={[
            { icon: "wifi", label: "Wi-Fi Only Transfers", value: wifiOnly, setValue: setWifiOnly },
            { icon: "check-circle-outline", label: "Auto-Accept from Contacts", value: autoAccept, setValue: setAutoAccept },
          ]}
          darkMode={darkMode}
        />

        {/* App Settings */}
        <SettingsSection 
          title="App Settings" 
          settings={[
            { icon: "weather-night", label: "Dark Mode", value: darkMode, setValue: setDarkMode },
            { icon: "bell-outline", label: "Notifications", value: notifications, setValue: setNotifications },
          ]}
          darkMode={darkMode}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient colors={["#ff5858", "#f857a6"]} style={styles.logoutGradient}>
            <CustomText>Logout</CustomText>
            <Feather name="log-out" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SettingsSectionProps {
  title: string;
  settings: Array<{
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value: boolean;
    setValue: (value: boolean) => void;
  }>;
  darkMode: boolean;
}

const SettingsSection = ({ title, settings, darkMode }: SettingsSectionProps) => {
  const theme = {
    card: darkMode ? '#2d2d2d' : '#fff',
    text: darkMode ? '#ffffff' : '#333333',
    border: darkMode ? '#404040' : '#e0e0e0',
  };

  return (
    <View style={[styles.settingsSection, { backgroundColor: theme.card }]}>
      <CustomText style={[styles.sectionTitle, { color: theme.text }]}>{title}</CustomText>
      {settings.map(({ icon, label, value, setValue }) => (
        <View key={label} style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <MaterialCommunityIcons name={icon} size={24} color="#4a26fd" />
            <CustomText style={[styles.settingText, { color: theme.text }]}>{label}</CustomText>
          </View>
          <Switch 
            trackColor={{ false: "#ddd", true: "#4a26fd" }} 
            thumbColor={value ? "#4a26fd" : "#f4f3f4"} 
            onValueChange={() => setValue(!value)} 
            value={value} 
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16, 
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333"
  },
  profileSection: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16, 
    backgroundColor: "#fff",
    marginBottom: 16
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333"
  },
  profileDevice: {
    fontSize: 14,
    opacity: 0.7,
    color: "#333"
  },
  settingsSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333"
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333"
  },
  logoutButton: { margin: 16, borderRadius: 10 },
  logoutGradient: { flexDirection: "row", justifyContent: "center", padding: 14, borderRadius: 10 },
});
