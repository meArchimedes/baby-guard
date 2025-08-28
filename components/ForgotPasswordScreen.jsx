import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebaseApp from "../firebase";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    const auth = getAuth(firebaseApp);
    if (!email) {
      Alert.alert("Forgot Password", "Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset",
        "If an account exists for this email, a password reset email has been sent."
      );
      navigation.goBack();
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "User not found in the system.");
      } else {
        Alert.alert("Reset Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0a1a4c" },
  title: { fontSize: 24, color: "#fff", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#eefb18",
    borderRadius: 8,
    padding: 12,
    width: "80%",
    backgroundColor: "#fff",
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#eefb18",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: { color: "#1a2a6c", fontWeight: "bold", fontSize: 16 },
  backText: { color: "#eefb18", fontSize: 14, marginTop: 8 },
});