/**
 * Driver API hooks
 * Provides typed hooks for driver sessions, location updates, shuttles, and routes
 */

import { useState } from 'react';
import apiClient, { handleApiError } from '../axios';
import { 
  ShuttleDto,
  StartSessionRequest,
  DriverSessionResponse,
  EndSessionRequest,
  EndSessionResponse,
  LocationUpdateDto,
  RouteDto,
  ApiResponse
} from '../../types/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for getting driver's assigned shuttles
 * Usage:
 * const { getShuttles, data, isLoading, error } = useGetDriverShuttles();
 * await getShuttles();
 */
export function useGetDriverShuttles() {
  const [state, setState] = useState<UseApiState<ShuttleDto[]>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const getShuttles = async () => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<ApiResponse<ShuttleDto[]>>(
        '/driver/shuttles'
      );

      const data = response.data?.data || response.data;
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { getShuttles, ...state };
}

/**
 * Hook for starting a driver session
 * Usage:
 * const { startSession, data, isLoading, error } = useStartSession();
 * await startSession({ shuttleId: 1, routeId: 2 });
 */
export function useStartSession() {
  const [state, setState] = useState<UseApiState<DriverSessionResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const startSession = async (request: StartSessionRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<ApiResponse<DriverSessionResponse>>(
        '/driver/session/start',
        request
      );

      const data = response.data?.data || response.data;
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { startSession, ...state };
}

/**
 * Hook for ending a driver session
 * Usage:
 * const { endSession, data, isLoading, error } = useEndSession();
 * await endSession({ sessionId: 123 });
 */
export function useEndSession() {
  const [state, setState] = useState<UseApiState<EndSessionResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const endSession = async (request: EndSessionRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<ApiResponse<EndSessionResponse>>(
        '/driver/session/end',
        request
      );

      const data = response.data?.data || response.data;
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { endSession, ...state };
}

/**
 * Hook for getting available routes for driver
 * Usage:
 * const { getRoutes, data, isLoading, error } = useDriverRoutes();
 * await getRoutes();
 */
export function useDriverRoutes() {
  const [state, setState] = useState<UseApiState<RouteDto[]>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const getRoutes = async () => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<ApiResponse<RouteDto[]>>(
        '/driver/routes'
      );

      const data = response.data?.data || response.data;
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { getRoutes, ...state };
}

/**
 * Hook for posting driver location updates (REST)
 * Usage:
 * const { postLocation, data, isLoading, error } = usePostDriverLocation();
 * await postLocation({ shuttleId: 1, latitude: 40.7128, longitude: -74.0060 });
 */
export function usePostDriverLocation() {
  const [state, setState] = useState<UseApiState<LocationUpdateDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const postLocation = async (location: LocationUpdateDto) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<ApiResponse<LocationUpdateDto>>(
        '/driver/location',
        location
      );

      const data = response.data?.data || response.data;
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { postLocation, ...state };
}

/**
 * Hook for posting driver location updates (alternate endpoint)
 * Usage:
 * const { postLocation, data, isLoading, error } = usePostDriverLocationAlt();
 * await postLocation({ shuttleId: 1, latitude: 40.7128, longitude: -74.0060 });
 */
export function usePostDriverLocationAlt() {
  const [state, setState] = useState<UseApiState<LocationUpdateDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const postLocation = async (location: LocationUpdateDto) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<ApiResponse<LocationUpdateDto>>(
        '/api/driver/location',
        location
      );

      const data = response.data?.data || response.data;
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { postLocation, ...state };
}
