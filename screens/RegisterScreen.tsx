import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { register } from "../services/authService"; // Ensure this function works correctly
import { useUser } from "../context/UserContext";
import { RegisterScreenNavigationProp } from "../types";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState(""); // `repassword` matches backend expectation
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { setUser } = useUser(); // User context

  // Validate Email
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Handle Registration
  const handleRegister = async () => {
    setError(""); // Reset error state

    // Form Validation
    if (!name.trim() || !email.trim() || !password.trim() || !repassword.trim()) {
      setError("⚠️ All fields are required.");
      return;
    }

    if (name.length < 3) {
      setError("⚠️ Name must be at least 3 characters long.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters long.");
      return;
    }

    if (password !== repassword) {
      setError("⚠️ Passwords do not match.");
      return;
    }

    setIsLoading(true); // Show loading indicator

    try {
      const { user, token } = await register(name, email, password, repassword); // Call API
      if (!user || !token) {
        throw new Error("Invalid response from server.");
      }

      // Store user in context (DO NOT STORE `repassword`)
      await setUser({ id: user.id, name: user.name, email: user.email, token });

      Alert.alert("🎉 Success", "Registration completed. Please log in.");
      navigation.navigate("Login"); // Redirect to login screen
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "❌ Registration failed. Please try again.");
      Alert.alert("⚠️ Error", err.message || "Registration failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={repassword}
          onChangeText={setRepassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4a26fd",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#4a26fd",
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
  },
});

