/**
 * Authentication API hooks
 * Provides typed hooks for login, signup, refresh, and logout operations
 */

import { useState } from 'react';
import apiClient, { handleApiError } from '../axios';
import { 
  JwtRequest, 
  JwtResponse, 
  RegisterStudentRequest, 
  RegisterDriverRequest,
  StudentDto,
  DriverDto,
  ApiResponse
} from '../../types/api';
import { 
  saveAccessToken, 
  saveRefreshToken, 
  saveUserData, 
  clearTokens 
} from '../../utils/authStorage';

interface UseAuthState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for student login
 * Usage:
 * const { login, data, isLoading, error } = useLogin();
 * await login({ email: 'student@example.com', password: 'password' });
 */
export function useLogin() {
  const [state, setState] = useState<UseAuthState<JwtResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const login = async (credentials: JwtRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<ApiResponse<JwtResponse>>(
        '/auth/login',
        credentials
      );

      const data = response.data?.data || response.data;
      
      // Save tokens
      await saveAccessToken(data.accessToken);
      if (data.refreshToken) {
        await saveRefreshToken(data.refreshToken);
      }
      
      // Save user data
      await saveUserData(data.user);

      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { login, ...state };
}

/**
 * Hook for student signup
 * Usage:
 * const { signupStudent, data, isLoading, error } = useSignupStudent();
 * await signupStudent({ email, password, fullName, schoolId });
 */
export function useSignupStudent() {
  const [state, setState] = useState<UseAuthState<StudentDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const signupStudent = async (studentData: RegisterStudentRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<StudentDto>(
        '/auth/signup/student',
        studentData
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { signupStudent, ...state };
}

/**
 * Hook for driver signup
 * Usage:
 * const { signupDriver, data, isLoading, error } = useSignupDriver();
 * await signupDriver({ email, password, fullName, licenseNumber, schoolId });
 */
export function useSignupDriver() {
  const [state, setState] = useState<UseAuthState<DriverDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const signupDriver = async (driverData: RegisterDriverRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<DriverDto>(
        '/auth/signup/driver',
        driverData
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { signupDriver, ...state };
}

/**
 * Hook for logout
 * Usage:
 * const { logout, isLoading, error } = useLogout();
 * await logout();
 */
export function useLogout() {
  const [state, setState] = useState<UseAuthState<void>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const logout = async () => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      // Call logout endpoint
      await apiClient.post<ApiResponse<void>>('/auth/logout');
      
      // Clear local tokens
      await clearTokens();

      setState({ data: null, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      // Clear tokens even if API call fails
      await clearTokens();
      
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  const logoutAll = async () => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      // Call logout all endpoint
      await apiClient.post<ApiResponse<void>>('/auth/logout/all');
      
      // Clear local tokens
      await clearTokens();

      setState({ data: null, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      // Clear tokens even if API call fails
      await clearTokens();
      
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { logout, logoutAll, ...state };
}

/**
 * Hook for refreshing access token
 * Usage:
 * const { refresh, data, isLoading, error } = useRefresh();
 * await refresh();
 */
export function useRefresh() {
  const [state, setState] = useState<UseAuthState<JwtResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const refresh = async (refreshToken?: string) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<ApiResponse<JwtResponse>>(
        '/auth/refresh',
        { refreshToken }
      );

      const data = response.data?.data || response.data;
      
      // Save new tokens
      await saveAccessToken(data.accessToken);
      if (data.refreshToken) {
        await saveRefreshToken(data.refreshToken);
      }

      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { refresh, ...state };
}
