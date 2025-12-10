/**
 * Shuttle and Route API hooks
 * Provides typed hooks for shuttles, routes, ETA, and schools
 */

import { useState } from 'react';
import apiClient, { handleApiError } from '../axios';
import { 
  ShuttleDto,
  RegisterShuttleRequest,
  ShuttleLocationDto,
  RouteResponseDto,
  EtaResponseDto,
  SchoolDto,
  RegisterSchoolRequest,
  ApiResponse
} from '../../types/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for adding a new shuttle
 * Usage:
 * const { addShuttle, data, isLoading, error } = useAddShuttle();
 * await addShuttle({ licensePlate: 'ABC123', capacity: 40, schoolId: 1 });
 */
export function useAddShuttle() {
  const [state, setState] = useState<UseApiState<ShuttleDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const addShuttle = async (request: RegisterShuttleRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<ShuttleDto>(
        '/shuttles/add',
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

  return { addShuttle, ...state };
}

/**
 * Hook for getting shuttle location
 * Usage:
 * const { getLocation, data, isLoading, error } = useGetShuttleLocation();
 * await getLocation(shuttleId);
 */
export function useGetShuttleLocation() {
  const [state, setState] = useState<UseApiState<ShuttleLocationDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const getLocation = async (shuttleId: number) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<ApiResponse<ShuttleLocationDto>>(
        `/shuttles/${shuttleId}/location`
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

  return { getLocation, ...state };
}

/**
 * Hook for getting shuttle route
 * Usage:
 * const { getRoute, data, isLoading, error } = useGetRoute();
 * await getRoute(shuttleId);
 */
export function useGetRoute() {
  const [state, setState] = useState<UseApiState<RouteResponseDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const getRoute = async (shuttleId: number) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<RouteResponseDto>(
        `/api/routes/${shuttleId}`
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { getRoute, ...state };
}

/**
 * Hook for getting ETA
 * Usage:
 * const { getEta, data, isLoading, error } = useGetEta();
 * await getEta(shuttleId, pickupStopId, dropoffStopId);
 */
export function useGetEta() {
  const [state, setState] = useState<UseApiState<EtaResponseDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const getEta = async (shuttleId: number, pickupStopId: number, dropoffStopId: number) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<EtaResponseDto>(
        `/api/shuttles/${shuttleId}/eta`,
        { 
          params: { 
            pickupStopId, 
            dropoffStopId 
          } 
        }
      );

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { getEta, ...state };
}

/**
 * Hook for listing schools
 * Usage:
 * const { listSchools, data, isLoading, error } = useListSchools();
 * await listSchools();
 */
export function useListSchools() {
  const [state, setState] = useState<UseApiState<SchoolDto[]>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const listSchools = async () => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<SchoolDto[]>('/schools');

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { listSchools, ...state };
}

/**
 * Hook for creating a school
 * Usage:
 * const { createSchool, data, isLoading, error } = useCreateSchool();
 * await createSchool({ schoolName: 'University', mapCenterLat: 40.7128, mapCenterLon: -74.0060 });
 */
export function useCreateSchool() {
  const [state, setState] = useState<UseApiState<SchoolDto>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const createSchool = async (request: RegisterSchoolRequest) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const response = await apiClient.post<SchoolDto>('/schools', request);

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState({ data: null, isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return { createSchool, ...state };
}
