// app/(driver)/route-select.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import SelectionCard from '../../components/SelectionCard'; 
import Header from '../../components/Header';

const RouteSelectScreen = () => {
  const router = useRouter();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const routeData = [
    { id: 'R1', name: 'North Campus', description: 'Brunei → KSB' },
    { id: 'R2', name: 'South Campus', description: 'Library → Admin' },
    // ...
  ];

  return (
    <View style={COMMON_STYLES.container}>
      <Header 
        title="Select Your Route" 
        showBack={true} 
        progress={{ currentStep: 2, totalSteps: 3 }} // Set progress to step 2 of 3
      />
      
      <ScrollView contentContainerStyle={styles.list}>
        {routeData.map((route) => (
          <SelectionCard
            key={route.id}
            primaryText={route.name}
            secondaryText={route.description}
            isSelected={selectedRouteId === route.id}
            isDisabled={false}
            onPress={() => setSelectedRouteId(route.id)}
          />
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.confirmButton, !selectedRouteId && styles.disabledButton]}
        disabled={!selectedRouteId}
        // 👇 FIX: Change '/chat' to the correct driver flow path
        onPress={() => router.push('/(driver)/confirm-live')}
      >
        <Text style={styles.confirmButtonText}>CONFIRM SELECTION</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    margin: 20,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RouteSelectScreen;