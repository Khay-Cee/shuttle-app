// components/Header.tsx (UPDATED)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../app/constants/Styles';
import ProgressIndicator from './ProgressIndicator'; // New Import

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean; // For the top-right menu button
  progress?: { currentStep: number; totalSteps: number }; // New Prop for Progress
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, showMenu = true, progress }) => {
  const router = useRouter();

  const handleMenuPress = () => {
    router.push('/(driver)/account');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top Row: Logo, Menu/Back */}
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.icon}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        ) : (
          // Placeholder for the logo (top left)
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        )}
        
        {showMenu && (
          <TouchableOpacity onPress={handleMenuPress} style={styles.icon}>
            <Ionicons name="menu" size={30} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Progress Indicator */}
      {progress && (
        <ProgressIndicator 
          currentStep={progress.currentStep} 
          totalSteps={progress.totalSteps} 
        />
      )}
      
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // No flex: 1 here, let content size it
    paddingTop: 10, // Some top padding
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120, 
    height: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  icon: {
    padding: 5,
  },
  // ... other header styles
});

export default Header;