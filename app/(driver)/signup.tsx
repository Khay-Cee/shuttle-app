// app/(driver)/signup.tsx

import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header'; 

const SignUpScreen = () => {
  const router = useRouter();

  return (
    <View style={COMMON_STYLES.container}>
      {/* Reusing the common Header component */}
      <Header title="Sign Up" showBack={true} showMenu={false} />

      <Text style={styles.prompt}>
        Create your account and shuttle smart today!
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} placeholder="John" />
        
        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} placeholder="Doe" />
        
        <Text style={styles.label}>School ID</Text>
        <TextInput style={styles.input} placeholder="123456" keyboardType="numeric" />
        
        <Text style={styles.label}>Personal Email</Text>
        <TextInput style={styles.input} placeholder="your.email@gmail.com" keyboardType="email-address" />
        
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="enter your password" secureTextEntry />
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.replace('/(driver)/shuttle-select')} // Sign up moves to selection
        >
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(driver)/login')}>
          <Text style={styles.loginLink}>log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  prompt: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20, // Add space at the bottom of the scroll view
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: COLORS.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background, // Ensure this sits correctly at the bottom
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textFaded,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default SignUpScreen;