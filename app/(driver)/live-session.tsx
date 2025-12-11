// app/(driver)/live-session.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import LiveMap from '../../components/LiveMap';
import { COLORS } from '../../constants/Styles';
import SessionEndModal from '../../components/SessionEndModal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LiveMap from '../../components/LiveMap';
import SessionEndModal from '../../components/SessionEndModal';
import { COLORS } from '../constants/Styles';

const LiveSessionScreen = () => {
  const router = useRouter();
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);

  const handleEndSession = () => {
    setIsEndModalVisible(true);
    setTimeout(() => {
      setIsEndModalVisible(false);
      router.replace('/(driver)/shuttle-select');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Map View - CONDITIONAL RENDERING FIX */}
      {Platform.OS === 'web' ? (
        // Fallback view for web environment
        <View style={styles.mapFallback}>
          <Ionicons name="map-outline" size={50} color={COLORS.border} />
          <Text style={styles.mapFallbackText}>Map View Disabled on Web Preview</Text>
          <Text style={styles.mapFallbackTextSmall}>(Please run on iOS/Android emulator or device)</Text>
        </View>
      ) : (
        <LiveMap />
      )}

      {/* Top Header Controls */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo1.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => router.push('/(driver)/account')}>
          <Ionicons name="menu" size={30} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Route Card */}
      <View style={styles.routeCard}>
        <Text style={styles.routeText}>North Campus</Text>
        <Text style={styles.routeSubText}>Brunei → KSB</Text>
      </View>

      {/* End Session Button */}
      <TouchableOpacity 
        style={styles.endButton}
        onPress={() => handleEndSession()}
      >
        <Text style={styles.endButtonText}>End Session</Text>
      </TouchableOpacity>

      {/* Session End Modal */}
      <SessionEndModal isVisible={isEndModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  mapFallbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 15,
  },
  mapFallbackTextSmall: {
    fontSize: 12,
    color: COLORS.textFaded,
    marginTop: 5,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 30,
    resizeMode: 'contain',
  },
  routeCard: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    zIndex: 10,
  },
  routeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  routeSubText: {
    fontSize: 14,
    color: COLORS.secondary,
    opacity: 0.7,
  },
  endButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor:'red',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  endButtonText: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default LiveSessionScreen;