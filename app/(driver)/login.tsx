// app/(driver)/login.tsx

import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header'; // We'll create this common header next

const LoginScreen = () => {
  const router = useRouter();

  return (
    <View style={COMMON_STYLES.container}>
      <Header title="Log In" showBack={true} showMenu={false} />
      
      <Text style={styles.label}>Personal Email</Text>
      <TextInput
        style={styles.input}
        placeholder="your.email@gmail.com"
        keyboardType="email-address"
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
      />
      
      <TouchableOpacity onPress={() => {/* Handle Forgot Password */}}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.replace('/(driver)/shuttle-select')} // Navigate to Shuttle Select
      >
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>
      
      {/* Illustration placeholder image goes here */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>No account, </Text>
        <TouchableOpacity onPress={() => router.push('/(driver)/signup')}>
          <Text style={styles.signUpLink}>sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... add styles specific to Login/Signup (inputs, labels, etc.)
const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.secondary,
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: COLORS.text,
    fontSize: 14,
  },
  signUpLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;