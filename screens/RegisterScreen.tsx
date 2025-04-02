import React, { useState, useCallback } from "react";
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
import { register } from "../services/authService";
import { useUser } from "../context/UserContext";
import { RegisterScreenNavigationProp } from "../types";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { setUser } = useUser();

  // ✅ Validate Email
  const isValidEmail = useCallback((email: string) => /\S+@\S+\.\S+/.test(email), []);

  // ✅ Handle Input Change
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Validate Input
  const validateForm = useCallback(() => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.repassword.trim()) {
      return "⚠️ All fields are required.";
    }
    if (form.name.length < 3) {
      return "⚠️ Name must be at least 3 characters long.";
    }
    if (!isValidEmail(form.email)) {
      return "⚠️ Please enter a valid email address.";
    }
    if (form.password.length < 6) {
      return "⚠️ Password must be at least 6 characters long.";
    }
    if (form.password !== form.repassword) {
      return "⚠️ Passwords do not match.";
    }
    return null;
  }, [form, isValidEmail]);

  // ✅ Handle Registration
  const handleRegister = async () => {
    setError(null);
    Keyboard.dismiss();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const { user, token } = await register(form.name, form.email, form.password, form.repassword);
      if (!user || !token) {
        throw new Error("Invalid response from server.");
      }

      await setUser({ id: user.id, name: user.name, email: user.email, token });

      Alert.alert("🎉 Success", "Registration completed. Please log in.");
      navigation.navigate("Login");
    } catch (err: any) {
      console.error("❌ Registration failed:", err);
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
          value={form.name}
          onChangeText={(value) => handleChange("name", value)}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={form.repassword}
          onChangeText={(value) => handleChange("repassword", value)}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

// ✅ Styles
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

