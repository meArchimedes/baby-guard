import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import firebaseApp from "../firebase";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    const auth = getAuth(firebaseApp);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  const handleSignUp = async () => {
    const auth = getAuth(firebaseApp);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      Alert.alert("Google Sign-In Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0a1a4c" />
        <View style={styles.headerContainer}>
          <Image 
            source={require('../assets/images/favicon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>BabyGuard</Text>
          <Text style={styles.subtitle}>Keep your little ones safe</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          {isSignUp ? (
            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
              <Text style={styles.loginButtonText}>Sign Up</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            {isSignUp ? (
              <>
                <Text style={styles.signupText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => setIsSignUp(false)}>
                  <Text style={styles.signupButtonText}>Sign In</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => setIsSignUp(true)}>
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a1a4c",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#0a1a4c",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#ffffff", 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e0e0e0",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3a4a8c",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 46,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#eefb18",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#eefb18",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: "90%",
    alignSelf: "center",
  },
  loginButtonText: {
    color: "#1a2a6c",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#3a4a8c",
  },
  orText: {
    color: "#e0e0e0",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
    width: "90%",
    alignSelf: "center",
  },
  googleButtonText: {
    color: "#1a2a6c",
    fontSize: 15,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  signupText: {
    color: "#e0e0e0",
    fontSize: 14,
  },
  signupButtonText: {
    color: "#eefb18",
    fontSize: 14,
    fontWeight: "bold",
  },
});