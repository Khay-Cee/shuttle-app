// components/LiveMap.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../app/constants/Styles';

const LiveMap = () => {
  // Show placeholder for both web and mobile for now
  // Future: Replace with MapView on mobile platforms
  return (
    <View style={[styles.map, styles.mapPlaceholder]}>
      <Text style={styles.mapText}>Live Map</Text>
      <Text style={styles.mapSubText}>Route tracking active</Text>
    </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  mapSubText: {
    fontSize: 14,
    color: COLORS.textFaded,
  },
});

export default LiveMap;