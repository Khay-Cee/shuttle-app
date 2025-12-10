// app/(driver)/shuttle-select.tsx

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, // Ensure StyleSheet is imported
    TouchableOpacity, 
    ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import SelectionCard from '../../components/SelectionCard';
import Header from '../../components/Header';
import WarningModal from '../../components/WarningModal';

type Shuttle = {
  id: string;
  license: string;
  available: boolean;
};

const ShuttleSelectScreen = () => {
  const router = useRouter();
  const [selectedShuttleId, setSelectedShuttleId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const shuttleData: Shuttle[] = [
    { id: 'SS01', license: 'GS 1068-20', available: true },
    { id: 'SS02', license: 'GS 2014-21', available: false }, // Disabled
    { id: 'SS03', license: 'GT 555-22', available: true },
  ];

  const handleShuttleSelection = (shuttle: Shuttle) => {
    if (!shuttle.available) {
      setIsModalVisible(true); // Show modal if unavailable
    } else {
      setSelectedShuttleId(shuttle.id); // Otherwise, select it
    }
  };

  return (
    <View style={COMMON_STYLES.container}>
      <Header 
        title="Select Shuttle" 
        showBack={false} 
        progress={{ currentStep: 1, totalSteps: 3 }} 
      />
      
      <ScrollView contentContainerStyle={styles.list}>
        {shuttleData.map((shuttle) => (
          <SelectionCard
            key={shuttle.id}
            primaryText={shuttle.id}
            secondaryText={`LICENSE PLATE\n${shuttle.license}`} 
            isSelected={selectedShuttleId === shuttle.id}
            isDisabled={!shuttle.available}
            onPress={() => handleShuttleSelection(shuttle)} 
          />
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.confirmButton, !selectedShuttleId && styles.disabledButton]}
        disabled={!selectedShuttleId}
        onPress={() => router.push('/(driver)/route-select')} 
      >
        <Text style={styles.confirmButtonText}>CONFIRM SELECTION</Text>
      </TouchableOpacity>

      <WarningModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Tapping the screen closes the modal
        title="Shuttle Unavailable"
        message="This shuttle is currently in use. Please select another shuttle."
      />
    </View>
  );
};

// V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V
// THIS IS THE MISSING STYLES DEFINITION BLOCK THAT FIXES THE ERROR
const styles = StyleSheet.create({
  list: {
    paddingVertical: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    // margin: 20, // Removed margin to stick to bottom better with flex layout
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
// ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^

export default ShuttleSelectScreen;