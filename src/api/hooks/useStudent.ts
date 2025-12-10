/**
 * Student API hooks
 * Provides typed hooks for stop search, trip matching, reminders, and device tokens
 */

import { useState } from 'react';
import apiClient, { handleApiError } from '../axios';
import { 
  StopSearchDto,
  TripMatchRequest,
  TripMatchResponse,
  TripReminderRequestDto,
  TripActivityDto,
  DeviceRegisterRequest,
  DeviceUnregisterRequest,
  DeviceTokenResponse,
  ApiResponse
} from '../../types/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for searching stops
 * Usage:
 * const { searchStops, data, isLoading, error } = useSearchStops();
 * await searchStops('Main Street');
 */
export function useSearchStops() {
  const [state, setState] = useState<UseApiState<StopSearchDto[]>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const searchStops = async (query: string) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<StopSearchDto[]>(
        '/stops/search',
        { params: { q: query } }
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { searchStops, ...state };
}

/**
 * Hook for matching trips/routes
 * Usage:
 * const { matchTrip, data, isLoading, error } = useMatchTrip();
 * await matchTrip({ pickupStopId: 1, dropoffStopId: 2 });
 */
export function useMatchTrip() {
  const [state, setState] = useState<UseApiState<TripMatchResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const matchTrip = async (request: TripMatchRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<TripMatchResponse>(
        '/student/trip/match',
        request
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { matchTrip, ...state };
}

/**
 * Hook for creating trip reminders
 * Usage:
 * const { createReminder, data, isLoading, error } = useCreateReminder();
 * await createReminder({ studentId: 1, shuttleId: 2, pickupStopId: 3, dropoffStopId: 4, reminderOffsetMinutes: 5 });
 */
export function useCreateReminder() {
  const [state, setState] = useState<UseApiState<TripActivityDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const createReminder = async (request: TripReminderRequestDto) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<TripActivityDto>(
        '/api/trips/reminders',
        request
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { createReminder, ...state };
}

/**
 * Hook for registering device token for push notifications
 * Usage:
 * const { registerDevice, data, isLoading, error } = useRegisterDeviceToken();
 * await registerDevice({ studentId: 1, token: 'expo-token-123', platform: 'ios' });
 */
export function useRegisterDeviceToken() {
  const [state, setState] = useState<UseApiState<DeviceTokenResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const registerDevice = async (request: DeviceRegisterRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<DeviceTokenResponse>(
        '/api/devices/register',
        request
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { registerDevice, ...state };
}

/**
 * Hook for unregistering device token
 * Usage:
 * const { unregisterDevice, data, isLoading, error } = useUnregisterDeviceToken();
 * await unregisterDevice({ token: 'expo-token-123' });
 */
export function useUnregisterDeviceToken() {
  const [state, setState] = useState<UseApiState<{ ok: boolean }>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const unregisterDevice = async (request: DeviceUnregisterRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<{ ok: boolean }>(
        '/api/devices/unregister',
        request
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { unregisterDevice, ...state };
}
