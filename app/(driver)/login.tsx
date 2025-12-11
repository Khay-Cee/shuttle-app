// app/(driver)/login.tsx

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from '../../constants/Styles';
import Header from '../../components/Header';
import { useLogin } from '../../src/api/hooks/useAuth';

const LoginScreen = () => {
  const router = useRouter();
  const { login, isLoading, error: apiError } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isFormValid = useMemo(() => {
    return email && password;
  }, [email, password]);

  const handleLogin = async () => {
    if (!isFormValid) {
      setError('Please enter email and password.');
      return;
    }

    setError('');

    try {
      await login({
        email,
        password,
        loginType: 'driver',
      });

      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => router.replace('/(driver)/shuttle-select') }
      ]);
    } catch (err: any) {
      setError(apiError || 'Login failed. Please check your credentials.');
      console.error('Driver login error:', err);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={COMMON_STYLES.container}
    >
      <View style={COMMON_STYLES.container}>
        <Header title="Driver Log In" showBack={true} showMenu={false} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="your.email@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      
      <TouchableOpacity onPress={() => {/* Handle Forgot Password */}}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.primaryButton, !isFormValid || isLoading ? styles.disabledButton : {}]}
        onPress={handleLogin}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.secondary} />
        ) : (
          <Text style={styles.primaryButtonText}>Log In</Text>
        )}
      </TouchableOpacity>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        </ScrollView>
      </View>
      
      <View style={styles.signUpRow}>
        <Text style={styles.signUpText}>No account, </Text>
        <TouchableOpacity onPress={() => router.push('/(driver)/signup')}>
          <Text style={styles.signUpLink}>sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 10,
    marginTop: 10,
  },
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
  disabledButton: {
    opacity: 0.6,
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