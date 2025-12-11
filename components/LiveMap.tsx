// components/LiveMap.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../app/constants/Styles';

const INITIAL_REGION = {
  latitude: 6.670,
  longitude: -1.573,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const LIVE_SHUTTLES = [
  { id: 'S01', lat: 6.675, lon: -1.575, eta: '3 min', route: 'Express A' },
  { id: 'S02', lat: 6.660, lon: -1.570, eta: '8 min', route: 'Campus Loop' },
];

const LiveMap = () => {
  if (Platform.OS === 'web') {
    // Fallback view for web environment
    return (
      <View style={[styles.map, styles.mapPlaceholder]}>
        <Ionicons name="map-outline" size={50} color={COLORS.border} />
        <Text style={styles.mapText}>Map View Disabled on Web Preview</Text>
        <Text style={styles.mapSubText}>(Please run on iOS/Android emulator or device)</Text>
      </View>
    );
  }

  // MapView for Native (iOS/Android)
  const MapView = require('react-native-maps').default;
  const { Marker, PROVIDER_GOOGLE } = require('react-native-maps');
  
  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      showsUserLocation={true}
    >
      {/* Render Markers for Live Shuttles */}
      {LIVE_SHUTTLES.map(shuttle => (
        <Marker
          key={shuttle.id}
          coordinate={{ latitude: shuttle.lat, longitude: shuttle.lon }}
          title={shuttle.route}
          description={`ETA: ${shuttle.eta}`}
        >
          {/* Custom Icon for the Bus */}
          <View style={styles.shuttleIconContainer}>
            <Text style={styles.shuttleEta}>{shuttle.eta}</Text>
            <Ionicons name="bus" size={24} color={COLORS.primary} />
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 15,
  },
  mapSubText: {
    fontSize: 12,
    color: COLORS.textFaded,
    marginTop: 5,
  },
  shuttleIconContainer: {
    alignItems: 'center',
  },
  shuttleEta: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
});

export default LiveMap;