// components/WarningModal.tsx

import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../app/constants/Styles';

interface WarningModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const WarningModal: React.FC<WarningModalProps> = ({ 
  isVisible, 
  onClose, 
  title, 
  message 
}) => {
  return (
    <Modal
      animationType="fade" // Smooth fade animation
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Handles Android back button
    >
      <TouchableWithoutFeedback onPress={onClose}>
        {/* Overlay covers the whole screen and darkens the background */}
        <View style={styles.overlay}>
          {/* Modal content box */}
          <View style={styles.modalContent}>
            
            {/* Warning Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="warning-outline" size={30} color="#D9534F" /> 
            </View>

            {/* Text Content */}
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>
            
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Grayed-out overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    width: '80%', // Takes up most of the screen width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 15,
    backgroundColor: '#FBE9E7', // Light red background for the icon
    borderRadius: 50,
    padding: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
});

export default WarningModal;