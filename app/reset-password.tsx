import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function PasswordResetScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      // First check if the email exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length === 0) {
        // No account exists with this email
        setMessage('No account found with this email address');
        setLoading(false);
        return;
      }
      
      // Email exists, send reset email
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error.code, error.message);
      
      // Handle specific error cases
      switch (error.code) {
        case 'auth/invalid-email':
          setMessage('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setMessage('Too many requests. Try again later');
          break;
        default:
          setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a link to reset your password
      </Text>
      
      {message ? (
        <Text style={[
          styles.messageText, 
          isSuccess ? styles.successText : styles.errorText
        ]}>
          {message}
        </Text>
      ) : null}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isSuccess}
      />
      
      {isSuccess ? (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: Colors.secondary }]} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      )}
      
      {!isSuccess && (
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => router.back()}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.darkGray,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    fontSize: 16,
  },
  messageText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
  },
  successText: {
    color: Colors.success,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});