// components/SessionEndModal.tsx

import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../app/constants/Styles';

interface SessionEndModalProps {
  isVisible: boolean;
}

const SessionEndModal: React.FC<SessionEndModalProps> = ({ isVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.overlay}>
        {/* Modal content box */}
        <View style={styles.modalContent}>
          
          <Ionicons name="checkmark-circle-outline" size={36} color="#4CAF50" /> 

          <Text style={styles.titleText}>Session ended successfully</Text>
          <Text style={styles.messageText}>...navigating to home</Text>
          
        </View>
      </View>
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
    padding: 30,
    alignItems: 'center',
    width: '70%', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.text,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textFaded,
    marginTop: 5,
  },
});

export default SessionEndModal;
