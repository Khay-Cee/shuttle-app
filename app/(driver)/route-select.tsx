// app/(driver)/route-select.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from '../../constants/Styles';
import SelectionCard from '../../components/SelectionCard';
import Header from '../../components/Header';
import { useGetRoutes } from '../../src/api/hooks/useShuttle';

const RouteSelectScreen = () => {
  const router = useRouter();
  const { routes, isLoading, error } = useGetRoutes();
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  // Reset selection when routes change
  React.useEffect(() => {
    setSelectedRouteId(null);
  }, [routes]);

  // ---------------------------
  // LOADING STATE
  // ---------------------------
  if (isLoading) {
    return (
      <View style={COMMON_STYLES.container}>
        <Header
          title="Select Your Route"
          showBack={true}
          progress={{ currentStep: 2, totalSteps: 3 }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading routes...</Text>
        </View>
      </View>
    );
  }

  // ---------------------------
  // ERROR STATE
  // ---------------------------
  if (error) {
    return (
      <View style={COMMON_STYLES.container}>
        <Header
          title="Select Your Route"
          showBack={true}
          progress={{ currentStep: 2, totalSteps: 3 }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading routes</Text>
          <Text style={styles.errorMessage}>{String(error)}</Text>
        </View>
      </View>
    );
  }

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <View style={COMMON_STYLES.container}>
      <Header
        title="Select Your Route"
        showBack={true}
        progress={{ currentStep: 2, totalSteps: 3 }}
      />

      <ScrollView contentContainerStyle={styles.list}>
        {routes?.map((route) => (
          <SelectionCard
            key={route.routeId}
            primaryText={route.routeName}
            secondaryText={route.description || 'Route'}
            isSelected={selectedRouteId === route.routeId} // selected ONLY after tap
            isDisabled={false}
            onPress={() => setSelectedRouteId(route.routeId)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !selectedRouteId && styles.disabledButton
        ]}
        disabled={!selectedRouteId}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
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
