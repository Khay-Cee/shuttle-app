// app/role-select.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from './constants/Styles';

const RoleSelectionScreen = () => {
  const router = useRouter();

  return (
    <View style={COMMON_STYLES.container}>
      {/* Full-screen Image based on Figma */}
      <Image 
        source={require('../assets/bus_interior.jpg')} 
        style={styles.busImage} 
      />

      <View style={styles.footer}>
        <Text style={styles.promptText}>Ready to shuttle smart?</Text>
        
        {/* Primary Button: Driver */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(driver)/login')} // Navigate to the Driver Login
        >
          <Text style={styles.primaryButtonText}>Continue as Driver</Text>
        </TouchableOpacity>

        {/* Secondary Button: Student */}
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/(student)/login')} // Navigate to the Driver Login
        >
          <Text style={styles.secondaryButtonText}>Continue as Student</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  busImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  footer: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-end', // Pushes buttons to the bottom
  },
  promptText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.text,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoleSelectionScreen;