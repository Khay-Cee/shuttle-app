/**
 * Map Screen Example
 * Demonstrates real-time shuttle tracking with STOMP WebSocket
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useGetShuttleLocation, useGetRoute, useGetEta } from '../api/hooks/useShuttle';
import { useStompClient } from '../api/stomp';
import { LocationBroadcastDto } from '../types/api';

export default function MapScreen() {
  const params = useLocalSearchParams();
  const shuttleId = Number(params.shuttleId);
  const pickupStopId = Number(params.pickupStopId);
  const dropoffStopId = Number(params.dropoffStopId);

  const mapRef = useRef<MapView>(null);

  // API hooks
  const { getLocation, data: initialLocation, isLoading: locationLoading } = useGetShuttleLocation();
  const { getRoute, data: route, isLoading: routeLoading } = useGetRoute();
  const { getEta, data: eta } = useGetEta();

  // STOMP WebSocket
  const { connect, disconnect, subscribe, isConnected } = useStompClient();

  // State
  const [currentLocation, setCurrentLocation] = useState<LocationBroadcastDto | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();

    // Connect to WebSocket
    connectWebSocket();

    return () => {
      // Cleanup on unmount
      disconnect();
    };
  }, []);

  // Subscribe to real-time updates when connected
  useEffect(() => {
    if (isConnected && shuttleId) {
      const unsubscribe = subscribe(shuttleId, handleLocationUpdate);
      return unsubscribe;
    }
  }, [isConnected, shuttleId]);

  // Fetch ETA when location updates
  useEffect(() => {
    if (currentLocation) {
      fetchEta();
    }
  }, [currentLocation]);

  const loadInitialData = async () => {
    try {
      // Get initial shuttle location
      const location = await getLocation(shuttleId);
      if (location) {
        setCurrentLocation({
          shuttleId,
          latitude: location.latitude || 0,
          longitude: location.longitude || 0,
          timestamp: location.createdAt,
        });
      }

      // Get route polyline
      await getRoute(shuttleId);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load shuttle data');
    }
  };

  const connectWebSocket = async () => {
    try {
      await connect();
      console.log('WebSocket connected');
    } catch (error) {
      console.error('WebSocket connection error:', error);
      Alert.alert('Connection Error', 'Failed to connect to real-time updates');
    }
  };

  const handleLocationUpdate = (location: LocationBroadcastDto) => {
    console.log('Received location update:', location);
    setCurrentLocation(location);

    // Animate map to new location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const fetchEta = async () => {
    try {
      const etaData = await getEta(shuttleId, pickupStopId, dropoffStopId);
      if (etaData) {
        const minutes = Math.ceil(etaData.etaMillis / 60000);
        setEtaMinutes(minutes);
      }
    } catch (error) {
      console.error('Error fetching ETA:', error);
    }
  };

  // Convert route stops to polyline coordinates
  const routeCoordinates = route?.stops?.map(stop => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  })) || [];

  if (locationLoading || routeLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ETA Banner */}
      {etaMinutes !== null && (
        <View style={styles.etaBanner}>
          <Text style={styles.etaText}>
            ETA: {etaMinutes} {etaMinutes === 1 ? 'minute' : 'minutes'}
          </Text>
          {!isConnected && (
            <Text style={styles.offlineText}>• Offline</Text>
          )}
        </View>
      )}

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || 0,
          longitude: currentLocation?.longitude || 0,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Shuttle marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Shuttle"
            description="Current location"
            pinColor="#007AFF"
          />
        )}

        {/* Route polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}

        {/* Stop markers */}
        {route?.stops?.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.stopName}
            description={`Stop ${stop.stopOrder}`}
            pinColor={
              stop.id === pickupStopId
                ? '#34C759'
                : stop.id === dropoffStopId
                ? '#FF3B30'
                : '#FFD700'
            }
          />
        ))}
      </MapView>

      {/* Connection Status */}
      <View style={styles.statusBar}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isConnected ? '#34C759' : '#FF3B30' },
          ]}
        />
        <Text style={styles.statusText}>
          {isConnected ? 'Live Tracking' : 'Reconnecting...'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  map: {
    flex: 1,
  },
  etaBanner: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  etaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  offlineText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  statusBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
