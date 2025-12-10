// app/(student)/account/personal-info.tsx (Personal Information Edit Screen)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../../constants/Styles';

// --- MOCK DATA ---
const INITIAL_USER = {
    name: 'John Doe',
    username: 'johndoe12',
    email: 'john.doe@st.knust.edu.gh',
    profilePic: 'https://via.placeholder.com/150/0000FF/808080?text=JD', 
};

// --- Main Screen Component ---
const PersonalInfoScreen = () => {
    const router = useRouter();
    
    const [currentUsername, setCurrentUsername] = useState(INITIAL_USER.username);
    const [currentPhoto, setCurrentPhoto] = useState(INITIAL_USER.profilePic);
    const [isSaving, setIsSaving] = useState(false);

    // Mock function to handle photo selection (e.g., from gallery)
    const handlePhotoChange = () => {
        // In a real app, this would open an image picker (e.g., Expo ImagePicker)
        Alert.alert("Change Photo", "Opening photo picker (Mock function)");
        // Mock update:
        // setCurrentPhoto('new_photo_url'); 
    };
    
    const handleSaveChanges = async () => {
        setIsSaving(true);
        // 1. Validate input (e.g., username is not empty)
        if (!currentUsername.trim()) {
            Alert.alert("Error", "Username cannot be empty.");
            setIsSaving(false);
            return;
        }

        // 2. Mock API call to save changes
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        // 3. Update local state/global context (Mock Alert)
        Alert.alert("Success", "Your personal information has been updated!");
        setIsSaving(false);
        
        // 4. Redirect back to the main profile page
        router.back();
    };

    return (
        <KeyboardAvoidingView 
            style={COMMON_STYLES.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Information</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                {/* Profile Photo Section */}
                <View style={styles.photoSection}>
                    <Image source={{ uri: currentPhoto }} style={styles.profileImage} />
                    <TouchableOpacity style={styles.changePhotoButton} onPress={handlePhotoChange}>
                        <Text style={styles.changePhotoButtonText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Name (Non-Editable) */}
                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                    style={[styles.input, styles.disabledInput]} 
                    value={INITIAL_USER.name} 
                    editable={false} 
                />

                {/* Student Email (Non-Editable) */}
                <Text style={styles.label}>Student Email</Text>
                <TextInput 
                    style={[styles.input, styles.disabledInput]} 
                    value={INITIAL_USER.email} 
                    editable={false} 
                />

                {/* Username (Editable) */}
                <Text style={styles.label}>Username</Text>
                <TextInput 
                    style={styles.input} 
                    value={currentUsername} 
                    onChangeText={setCurrentUsername} 
                    placeholder="Enter new username"
                    autoCapitalize="none"
                />

                <Text style={styles.hintText}>Only your username and profile photo can be changed here.</Text>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Save Button (Fixed to bottom) */}
            <View style={styles.saveContainer}>
                <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.disabledButton]}
                    onPress={handleSaveChanges}
                    disabled={isSaving}
                >
                    <Text style={styles.saveButtonText}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    // --- Header ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    // --- Content ---
    scrollContainer: {
        paddingVertical: 20,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 4,
        borderColor: COLORS.primary,
    },
    changePhotoButton: {
        backgroundColor: COLORS.border,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    changePhotoButtonText: {
        color: COLORS.text,
        fontWeight: '600',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'white',
        color: COLORS.text, 
    },
    disabledInput: {
        backgroundColor: '#F7F7F7',
        color: COLORS.textFaded,
    },
    hintText: {
        fontSize: 13,
        color: COLORS.textFaded,
        marginTop: 10,
        textAlign: 'center',
    },
    // --- Save Button ---
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: COLORS.border,
        opacity: 0.8,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PersonalInfoScreen;