// app/(driver)/shuttle-select.tsx

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
import WarningModal from '../../components/WarningModal';
import { useGetShuttles } from '../../src/api/hooks/useShuttle';
import { ShuttleDto } from '../../src/types/api';

const ShuttleSelectScreen = () => {
  const router = useRouter();
  const { shuttles, isLoading, error } = useGetShuttles();

  const [selectedShuttleId, setSelectedShuttleId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedShuttle, setSelectedShuttle] = useState<ShuttleDto | null>(null);

  const handleShuttleSelection = (shuttle: ShuttleDto) => {
    // 🛑 If shuttle is already in use, show modal
    if (shuttle.inUse) {
      setSelectedShuttle(shuttle);
      setIsModalVisible(true);
      return;
    }

    // Otherwise select the shuttle
    setSelectedShuttleId(shuttle.shuttleId);
  };

  if (isLoading) {
    return (
      <View style={COMMON_STYLES.container}>
        <Header 
          title="Select Shuttle" 
          showBack={false} 
          progress={{ currentStep: 1, totalSteps: 3 }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading shuttles...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={COMMON_STYLES.container}>
        <Header 
          title="Select Shuttle" 
          showBack={false} 
          progress={{ currentStep: 1, totalSteps: 3 }} 
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading shuttles</Text>
          <Text style={styles.errorMessage}>{String(error)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={COMMON_STYLES.container}>
      <Header 
        title="Select Shuttle" 
        showBack={false} 
        progress={{ currentStep: 1, totalSteps: 3 }} 
      />
      
      <ScrollView contentContainerStyle={styles.list}>
        {shuttles.map((shuttle) => (
          <SelectionCard
            key={shuttle.externalId}  // stable unique key
            primaryText={shuttle.externalId}   // ✅ FIXED — show backend externalId
            secondaryText={`LICENSE PLATE\n${shuttle.licensePlate}`} 
            isSelected={selectedShuttleId === shuttle.shuttleId}
            isDisabled={shuttle.inUse}   // 🔥 Real backend truth
            onPress={() => handleShuttleSelection(shuttle)} 
          />
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={[
          styles.confirmButton, 
          !selectedShuttleId && styles.disabledButton
        ]}
        disabled={!selectedShuttleId}
        onPress={() => router.push('/(driver)/route-select')}
      >
        <Text style={styles.confirmButtonText}>CONFIRM SELECTION</Text>
      </TouchableOpacity>

      <WarningModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Shuttle Unavailable"
        message={`${selectedShuttle?.licensePlate || 'This shuttle'} is currently in use by another driver. Please select another shuttle.`}
      />
    </View>
  );
};

// -----------------------------------------
// Styles
// -----------------------------------------
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
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShuttleSelectScreen;
