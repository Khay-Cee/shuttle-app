// app/(driver)/confirm-live.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header';
import PermissionModal from '../../components/PermissionModal'; // NEW Component Import

// Mock Data (In a real app, this would come from state/API)
const mockShuttle = { id: 'SS02', license: 'GS 1068-20' };
const mockRoute = { name: 'North Campus', description: 'Brunei → KSB' };


const ConfirmLiveScreen = () => {
  const router = useRouter();
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  // Function to handle the "Start Session" button press
  const handleStartSession = () => {
    // 1. Show the Permission Modal (to mimic the OS request)
    setIsLocationModalVisible(true);
  };

  // Function called after the user interacts with the permission modal
  const handleLocationPermission = (granted: boolean) => {
    setIsLocationModalVisible(false); // Close the modal

    if (granted) {
      // 2. If granted, immediately navigate to the Live Map screen
      router.replace('/(driver)/live-session' as any); 
    } else {
      // 3. Optional: Handle if permission is denied (e.g., show error, stay on screen)
      alert("Location permission is required to start live tracking.");
    }
  };

  return (
    <View style={COMMON_STYLES.container}>
      <Header 
        title="Confirm & Go Live" 
        showBack={true} 
        progress={{ currentStep: 3, totalSteps: 3 }} // Step 3 of 3
      />

      {/* Shuttle Confirmation Card */}
      <View style={styles.card}>
        <Text style={styles.headerText}>SHUTTLE ID</Text>
        <Text style={styles.largeText}>{mockShuttle.id}</Text>
        <Text style={styles.headerText}>LICENSE PLATE</Text>
        <Text style={styles.subText}>{mockShuttle.license}</Text>
      </View>

      {/* Route Confirmation Card */}
      <View style={styles.card}>
        <Text style={styles.largeText}>{mockRoute.name}</Text>
        <Text style={styles.subText}>{mockRoute.description}</Text>
      </View>

      {/* Main CTA Button */}
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={handleStartSession}
      >
        <Text style={styles.primaryButtonText}>Start Session & Go Live</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()} // Go back to route-select
      >
        <Text style={styles.backButtonText}>Back to Route Selection</Text>
      </TouchableOpacity>

      {/* Permission Modal */}
      <PermissionModal
        isVisible={isLocationModalVisible}
        onGrant={() => handleLocationPermission(true)}
        onDeny={() => handleLocationPermission(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 12,
    color: COLORS.textFaded,
    marginBottom: 2,
  },
  largeText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary, // Primary color for selected items
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.textFaded,
    fontSize: 14,
  }
});

export default ConfirmLiveScreen;