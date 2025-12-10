/**
 * Login Screen Example
 * Demonstrates how to use auth hooks for login
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLogin } from '../api/hooks/useAuth';
import { useRegisterDeviceToken } from '../api/hooks/useStudent';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const { registerDevice } = useRegisterDeviceToken();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      // Login user
      const result = await login({
        email: email.trim(),
        password,
        loginType: 'student', // or 'driver'
      });

      console.log('Login successful:', result.user);

      // Register device token for push notifications (student only)
      if (result.user.role === 'STUDENT') {
        try {
          // Get Expo push token (you would implement this)
          // const pushToken = await getPushToken();
          // await registerDevice({
          //   studentId: result.user.id,
          //   token: pushToken,
          //   platform: Platform.OS,
          // });
        } catch (deviceError) {
          console.error('Failed to register device token:', deviceError);
          // Continue anyway - not critical
        }
      }

      // Navigate based on user role
      if (result.user.role === 'STUDENT') {
        router.replace('/(student)/home-search');
      } else if (result.user.role === 'DRIVER') {
        router.replace('/(driver)/route-select');
      }
    } catch (err) {
      Alert.alert('Login Failed', error || 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push('/(student)/signup')}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
    textAlign: 'center',
  },
});
