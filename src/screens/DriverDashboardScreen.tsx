/**
 * Driver Dashboard Screen Example
 * Demonstrates driver session management and location tracking
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import {
  useGetDriverShuttles,
  useStartSession,
  useEndSession,
  useDriverRoutes,
  usePostDriverLocation,
} from '../api/hooks/useDriver';
import { useStompClient } from '../api/stomp';
import { ShuttleDto, RouteDto } from '../types/api';

export default function DriverDashboardScreen() {
  const router = useRouter();

  // API hooks
  const { getShuttles, data: shuttles, isLoading: shuttlesLoading } = useGetDriverShuttles();
  const { getRoutes, data: routes, isLoading: routesLoading } = useDriverRoutes();
  const { startSession, data: sessionData, isLoading: sessionStarting } = useStartSession();
  const { endSession, isLoading: sessionEnding } = useEndSession();
  const { postLocation } = usePostDriverLocation();

  // STOMP WebSocket
  const { connect, disconnect, publish, isConnected } = useStompClient();

  // State
  const [selectedShuttle, setSelectedShuttle] = useState<ShuttleDto | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteDto | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  // Load shuttles and routes on mount
  useEffect(() => {
    loadData();
  }, []);

  // Connect WebSocket when needed
  useEffect(() => {
    if (isSessionActive) {
      connectWebSocket();
    } else {
      disconnect();
    }
  }, [isSessionActive]);

  const loadData = async () => {
    try {
      await Promise.all([getShuttles(), getRoutes()]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const connectWebSocket = async () => {
    try {
      await connect();
      console.log('Driver WebSocket connected');
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  const handleStartSession = async () => {
    if (!selectedShuttle) {
      Alert.alert('Error', 'Please select a shuttle');
      return;
    }

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      // Start session
      const session = await startSession({
        shuttleId: selectedShuttle.id,
        routeId: selectedRoute?.id,
      });

      console.log('Session started:', session);
      setIsSessionActive(true);

      // Start location tracking
      startLocationTracking();

      Alert.alert('Success', 'Session started successfully');
    } catch (error) {
      console.error('Error starting session:', error);
      Alert.alert('Error', 'Failed to start session');
    }
  };

  const handleEndSession = async () => {
    try {
      if (sessionData) {
        await endSession({ sessionId: sessionData.id });
      }

      setIsSessionActive(false);

      // Stop location tracking
      stopLocationTracking();

      Alert.alert('Success', 'Session ended successfully');
    } catch (error) {
      console.error('Error ending session:', error);
      Alert.alert('Error', 'Failed to end session');
    }
  };

  const startLocationTracking = async () => {
    try {
      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // or every 10 meters
        },
        (location) => {
          handleLocationUpdate(location);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const handleLocationUpdate = async (location: Location.LocationObject) => {
    if (!selectedShuttle) return;

    const locationData = {
      shuttleId: selectedShuttle.id,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
      heading: location.coords.heading || undefined,
      speed: location.coords.speed || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      // Send via REST API
      await postLocation(locationData);

      // Also publish via WebSocket if connected
      if (isConnected) {
        publish({
          shuttleId: selectedShuttle.id,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          createdAt: new Date().toISOString(),
        });
      }

      console.log('Location updated:', locationData);
    } catch (error) {
      console.error('Error posting location:', error);
    }
  };

  const renderShuttleItem = ({ item }: { item: ShuttleDto }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        selectedShuttle?.id === item.id && styles.itemCardSelected,
      ]}
      onPress={() => setSelectedShuttle(item)}
      disabled={isSessionActive}
    >
      <Text style={styles.itemTitle}>{item.licensePlate}</Text>
      <Text style={styles.itemSubtitle}>
        Capacity: {item.capacity} | Status: {item.status || 'Active'}
      </Text>
    </TouchableOpacity>
  );

  const renderRouteItem = ({ item }: { item: RouteDto }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        selectedRoute?.id === item.id && styles.itemCardSelected,
      ]}
      onPress={() => setSelectedRoute(item)}
      disabled={isSessionActive}
    >
      <Text style={styles.itemTitle}>{item.routeName}</Text>
      <Text style={styles.itemSubtitle}>
        {item.stops?.length || 0} stops
      </Text>
    </TouchableOpacity>
  );

  if (shuttlesLoading || routesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>

      {!isSessionActive ? (
        <>
          {/* Shuttle Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Shuttle</Text>
            <FlatList
              data={shuttles || []}
              renderItem={renderShuttleItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>

          {/* Route Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Route (Optional)</Text>
            <FlatList
              data={routes || []}
              renderItem={renderRouteItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>

          {/* Start Session Button */}
          <TouchableOpacity
            style={[
              styles.button,
              !selectedShuttle && styles.buttonDisabled,
            ]}
            onPress={handleStartSession}
            disabled={!selectedShuttle || sessionStarting}
          >
            {sessionStarting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Start Session</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Active Session Info */}
          <View style={styles.activeSession}>
            <Text style={styles.activeSessionTitle}>Session Active</Text>
            <Text style={styles.activeSessionText}>
              Shuttle: {selectedShuttle?.licensePlate}
            </Text>
            {selectedRoute && (
              <Text style={styles.activeSessionText}>
                Route: {selectedRoute.routeName}
              </Text>
            )}
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isConnected ? '#34C759' : '#FF3B30' },
                ]}
              />
              <Text style={styles.statusText}>
                {isConnected ? 'Live Tracking Active' : 'Connecting...'}
              </Text>
            </View>
          </View>

          {/* End Session Button */}
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleEndSession}
            disabled={sessionEnding}
          >
            {sessionEnding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>End Session</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  listContainer: {
    paddingRight: 20,
  },
  itemCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 200,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeSession: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  activeSessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  activeSessionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
