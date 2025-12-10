/**
 * Axios instance with automatic token refresh and request queuing
 * Handles 401 errors by refreshing tokens and retrying failed requests
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken, clearTokens } from '../utils/authStorage';
import { ApiResponse, JwtResponse } from '../types/api';

// API Base URL from environment
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track if refresh is in progress
let isRefreshing = false;

// Queue to store failed requests during token refresh
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

/**
 * Process queued requests after successful token refresh
 */
const processQueue = (error: any = null, token: string | null = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<ApiResponse<JwtResponse>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data?.data || response.data;
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;

    if (!newAccessToken) {
      throw new Error('No access token in refresh response');
    }

    // Save new tokens
    await saveAccessToken(newAccessToken);
    if (newRefreshToken) {
      await saveRefreshToken(newRefreshToken);
    }

    return newAccessToken;
  } catch (error) {
    // Clear tokens on refresh failure
    await clearTokens();
    throw error;
  }
};

/**
 * Request interceptor - Add Authorization header
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth header for auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') || 
                          config.url?.includes('/auth/signup') ||
                          config.url?.includes('/auth/refresh');
    
    if (!isAuthEndpoint) {
      const token = await getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle 401 errors and refresh tokens
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip retry for auth endpoints
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh token
        const newToken = await refreshAccessToken();
        
        // Update authorization header with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Process all queued requests
        processQueue(null, newToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear queue and reject all
        processQueue(refreshError, null);
        
        // Clear tokens and force logout
        await clearTokens();
        
        // You can emit an event here to navigate to login screen
        // EventEmitter.emit('FORCE_LOGOUT');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      return error.response.data?.message || error.response.statusText || 'Server error occurred';
    } else if (error.request) {
      // Request made but no response
      return 'Network error - please check your connection';
    }
  }
  return error.message || 'An unexpected error occurred';
};
