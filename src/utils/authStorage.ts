/**
 * Secure token storage utility using Expo SecureStore
 * Provides typed functions for managing access/refresh tokens
 */

import * as SecureStore from 'expo-secure-store';

// Storage keys
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const USER_DATA_KEY = 'USER_DATA';

/**
 * Save access token to secure storage
 */
export async function saveAccessToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving access token:', error);
    throw error;
  }
}

/**
 * Get access token from secure storage
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Save refresh token to secure storage
 */
export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
}

/**
 * Get refresh token from secure storage
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Save user data to secure storage
 */
export async function saveUserData(userData: any): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

/**
 * Get user data from secure storage
 */
export async function getUserData(): Promise<any | null> {
  try {
    const data = await SecureStore.getItemAsync(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Clear all auth tokens and user data
 */
export async function clearTokens(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_DATA_KEY),
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated (has access token)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}
