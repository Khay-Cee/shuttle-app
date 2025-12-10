// components/PermissionModal.tsx

import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../app/constants/Styles';

interface PermissionModalProps {
  isVisible: boolean;
  onGrant: () => void;
  onDeny: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ 
  isVisible, 
  onGrant, 
  onDeny 
}) => {
  // Local state to manage the switch for visual confirmation
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);

  // In a real app, turning the switch on would trigger a location API request.
  // Here, we simulate that granting permission means the user toggles it on.
  const handleSwitchToggle = (value: boolean) => {
    setIsSwitchEnabled(value);
    if (value) {
      // Simulate successful permission grant
      onGrant(); 
    } else {
      // Simulate denial
      onDeny();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      // Pressing outside or using the back button should deny/close
      onRequestClose={onDeny} 
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onDeny} // Tapping the grey background acts as deny/close
      >
        {/* The inner white content box */}
        <View style={styles.modalContent}>
          
          <View style={styles.row}>
            {/* Warning Icon (Red Exclamation Mark) */}
            <Ionicons name="alert-circle-outline" size={30} color="#D9534F" style={styles.icon} />
            
            {/* Toggle Switch */}
            <Text style={styles.text}>Allow location</Text>
            <Switch
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.secondary}
              ios_backgroundColor={COLORS.border}
              onValueChange={handleSwitchToggle}
              value={isSwitchEnabled}
            />
          </View>

        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 20,
    width: '85%', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1, // Allows the text to take up available space
  }
});

export default PermissionModal;