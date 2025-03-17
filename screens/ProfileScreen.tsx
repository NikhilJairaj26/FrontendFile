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

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [wifiOnly, setWifiOnly] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleWifiOnly = () => setWifiOnly((prev) => !prev);
  const toggleAutoAccept = () => setAutoAccept((prev) => !prev);
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    toast(`Dark mode ${!darkMode ? "enabled" : "disabled"}`);
  };
  const toggleNotifications = () => setNotifications((prev) => !prev);

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
          <Image
            source={{ uri: "https://api.a0.dev/assets/image?text=professional%20headshot%20person&aspect=1:1" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <CustomText style={styles.profileName}>Alex Morgan</CustomText>
            <CustomText style={styles.profileDevice}>iPhone 14 Pro</CustomText>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => toast("Edit profile")}>
            <Feather name="edit-2" size={20} color="#4a26fd" />
          </TouchableOpacity>
        </View>

        {/* Transfer Settings */}
        <View style={styles.settingsSection}>
          <CustomText style={styles.sectionTitle}>Transfer Settings</CustomText>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="wifi" size={24} color="#4a26fd" />
              <CustomText style={styles.settingText}>Wi-Fi Only Transfers</CustomText>
            </View>
            <Switch trackColor={{ false: "#ddd", true: "#4a26fd" }} thumbColor={wifiOnly ? "#4a26fd" : "#f4f3f4"} onValueChange={toggleWifiOnly} value={wifiOnly} />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="check-circle-outline" size={24} color="#4a26fd" />
              <CustomText style={styles.settingText}>Auto-Accept from Contacts</CustomText>
            </View>
            <Switch trackColor={{ false: "#ddd", true: "#4a26fd" }} thumbColor={autoAccept ? "#4a26fd" : "#f4f3f4"} onValueChange={toggleAutoAccept} value={autoAccept} />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.settingsSection}>
          <CustomText style={styles.sectionTitle}>App Settings</CustomText>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="weather-night" size={24} color="#4a26fd" />
              <CustomText style={styles.settingText}>Dark Mode</CustomText>
            </View>
            <Switch trackColor={{ false: "#ddd", true: "#4a26fd" }} thumbColor={darkMode ? "#4a26fd" : "#f4f3f4"} onValueChange={toggleDarkMode} value={darkMode} />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#4a26fd" />
              <CustomText style={styles.settingText}>Notifications</CustomText>
            </View>
            <Switch trackColor={{ false: "#ddd", true: "#4a26fd" }} thumbColor={notifications ? "#4a26fd" : "#f4f3f4"} onValueChange={toggleNotifications} value={notifications} />
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 34,
  },
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
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profileDevice: {
    fontSize: 14,
    color: "#777",
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    overflow: "hidden",
  },
  logoutGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});