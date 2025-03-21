import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import CustomText from "../components/CustomText";

// Define UserState type for better type safety
type UserState = {
  name: string;
  avatar: string;
  device: string;
};

// Mock user data
const user: UserState = {
  name: "Alex Morgan",
  avatar: "https://api.a0.dev/assets/image?text=professional%20headshot%20person&aspect=1:1",
  device: "iPhone 14 Pro",
};

export default function ProfileScreen() {
  const navigation = useNavigation();

  // State for settings
  const [wifiOnly, setWifiOnly] = useState<boolean>(true);
  const [autoAccept, setAutoAccept] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);

  const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>, label: string) => {
    setter((prev) => !prev);
    toast(`${label} ${!darkMode ? "enabled" : "disabled"}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Settings</CustomText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatar }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <CustomText style={styles.profileName}>{user.name}</CustomText>
            <CustomText style={styles.profileDevice}>{user.device}</CustomText>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => toast("Edit profile")}>
            <Feather name="edit-2" size={20} color="#4a26fd" />
          </TouchableOpacity>
        </View>

        {/* Transfer Settings */}
        <View style={styles.settingsSection}>
          <CustomText style={styles.sectionTitle}>Transfer Settings</CustomText>

          <SettingItem
            icon="wifi"
            label="Wi-Fi Only Transfers"
            value={wifiOnly}
            onToggle={() => setWifiOnly((prev) => !prev)}
          />

          <SettingItem
            icon="check-circle-outline"
            label="Auto-Accept from Contacts"
            value={autoAccept}
            onToggle={() => setAutoAccept((prev) => !prev)}
          />
        </View>

        {/* App Settings */}
        <View style={styles.settingsSection}>
          <CustomText style={styles.sectionTitle}>App Settings</CustomText>

          <SettingItem
            icon="weather-night"
            label="Dark Mode"
            value={darkMode}
            onToggle={() => toggleSwitch(setDarkMode, "Dark Mode")}
          />

          <SettingItem
            icon="bell-outline"
            label="Notifications"
            value={notifications}
            onToggle={() => setNotifications((prev) => !prev)}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => toast("Logged out")}>
          <LinearGradient colors={["#ff5858", "#f857a6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoutGradient}>
            <CustomText style={styles.logoutText}>Logout</CustomText>
            <Feather name="log-out" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable SettingItem component
const SettingItem = ({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingInfo}>
      <MaterialCommunityIcons name={icon} size={24} color="#4a26fd" />
      <CustomText style={styles.settingText}>{label}</CustomText>
    </View>
    <Switch trackColor={{ false: "#ddd", true: "#4a26fd" }} thumbColor={value ? "#4a26fd" : "#f4f3f4"} onValueChange={onToggle} value={value} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  placeholder: { width: 34 },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  profileImage: { width: 70, height: 70, borderRadius: 35 },
  profileInfo: { flex: 1, marginLeft: 15 },
  profileName: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
  profileDevice: { fontSize: 14, color: "#777" },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 38, 253, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsSection: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 15 },
  settingItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  settingInfo: { flexDirection: "row", alignItems: "center" },
  settingText: { marginLeft: 12, fontSize: 15, color: "#333" },
  logoutButton: { marginHorizontal: 20, marginBottom: 30, borderRadius: 12, overflow: "hidden" },
  logoutGradient: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 16 },
  logoutText: { color: "white", fontSize: 16, fontWeight: "bold", marginRight: 8 },
});

