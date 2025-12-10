// components/LogoutSuccessModal.tsx

import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../app/constants/Styles';

interface LogoutSuccessModalProps {
  isVisible: boolean;
}

const LogoutSuccessModal: React.FC<LogoutSuccessModalProps> = ({ isVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.overlay}>
        {/* Modal content box */}
        <View style={styles.modalContent}>
          
          <Ionicons name="checkmark-circle-outline" size={30} color="#4CAF50" style={{ marginRight: 10 }} /> 
          <Text style={styles.messageText}>Logged out successfully</Text>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // Dark transparent background is intentional to focus on the message
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: 'auto', // Auto width based on content
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default LogoutSuccessModal;