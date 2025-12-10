// app/(driver)/account.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header'; // We will use this header for the title/back arrow
import LogoutSuccessModal from '../../components/LogoutSuccessModal'; // NEW Component

const DriverAccountScreen = () => {
  const router = useRouter();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock User Data
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@shuttle.com',
    profilePicUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=JD' // Placeholder for image
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(false);
      setIsLoggedOut(true);
      router.replace('/role-select');
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={COMMON_STYLES.container}>
      <Header title="Account" showBack={true} showMenu={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Picture Section */}
        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: mockUser.profilePicUrl }} 
              style={styles.profileImage} 
            />
            {/* Camera Icon Overlay */}
            <TouchableOpacity style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Click to change photo</Text>
        </View>

        {/* Input Fields (View/Edit) */}
        <Text style={styles.label}>First Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={COLORS.textFaded} style={styles.inputIcon} />
          <TextInput style={styles.input} defaultValue={mockUser.firstName} />
        </View>

        <Text style={styles.label}>Last Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={COLORS.textFaded} style={styles.inputIcon} />
          <TextInput style={styles.input} defaultValue={mockUser.lastName} />
        </View>

        <Text style={styles.label}>Personal Email</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textFaded} style={styles.inputIcon} />
          <TextInput style={styles.input} defaultValue={mockUser.email} keyboardType="email-address" editable={false} />
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#CC0000" style={{ marginRight: 10 }} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Logged Out Message (for visual feedback before modal) */}
        {isLoggedOut && (
          <View style={styles.loggedOutMessage}>
            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.text} style={{ marginRight: 8 }} />
            <Text style={{ color: COLORS.text }}>Logged out successfully</Text>
          </View>
        )}

      </ScrollView>
      
      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={cancelLogout}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={cancelLogout}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Log Out?</Text>
            <Text style={styles.modalBody}>
              Are you sure you want to log out of your account?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.noButton]} onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.yesButton]} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Logout Success Modal */}
      <LogoutSuccessModal isVisible={showSuccessModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    // 2. Makes it circular
    borderRadius: 50, // Half of the width/height
    // 3. Adds a white background (if the image is transparent)
    backgroundColor: '#EEEEEE', 
    // 4. Centers the image within the container
    justifyContent: 'center',
    // 5. Adds a subtle border (optional, but good practice)
    borderWidth: 2, 
    borderColor: '#DDDDDD',
    // 6. Places it centrally on the page
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    // 7. Clips the content (important for the image inside)
    overflow: 'hidden',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 7,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  changePhotoText: {
    fontSize: 12,
    color: COLORS.textFaded,
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE9E9', // Light red background
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#CC0000',
  },
  logoutButtonText: {
    color: '#CC0000',
    fontSize: 16,
    fontWeight: '700',
  },
  loggedOutMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: COLORS.border,
  },
  yesButton: {
    backgroundColor: '#EF5350',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverAccountScreen;