// app/(student)/account/privacy.tsx (Privacy Settings Screen)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../../constants/Styles';

// --- MOCK DATA ---
const INITIAL_SETTINGS = {
    savePastTrips: true, // Initially ON
    locationTracking: false, // Initially OFF, user must turn on
};

// --- Sub-Component: Toggle Item ---
interface ToggleItemProps {
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    icon: keyof typeof Ionicons.glyphMap;
    warning?: string;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ title, description, value, onToggle, icon, warning }) => (
    <View style={styles.toggleItem}>
        <Ionicons name={icon} size={24} color={COLORS.primary} style={{ width: 30 }} />
        <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleTitle}>{title}</Text>
            <Text style={styles.toggleDescription}>{description}</Text>
            {warning && <Text style={styles.toggleWarning}>{warning}</Text>}
        </View>
        <Switch 
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={'white'}
            onValueChange={onToggle}
            value={value}
        />
    </View>
);

// --- Main Screen Component ---
const PrivacyScreen = () => {
    const router = useRouter();
    
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key: keyof typeof INITIAL_SETTINGS, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleLocationToggle = (value: boolean) => {
        handleToggle('locationTracking', value);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        // Mock API call to save settings
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        Alert.alert("Success", "Your privacy settings have been updated.");
        setIsSaving(false);
        router.back();
    };

    return (
        <View style={COMMON_STYLES.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy</Text>
                <View style={{ width: 40 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.settingsGroup}>
                    
                    <ToggleItem
                        icon="archive-outline"
                        title="Save Past Trips"
                        description="Keep a record of your past shuttle trips in your Activity history."
                        value={settings.savePastTrips}
                        onToggle={value => handleToggle('savePastTrips', value)}
                    />
                    
                    <View style={styles.divider} />

                    <ToggleItem
                        icon="navigate-circle-outline"
                        title="Location Tracking"
                        description="Allow the app to track your location for accurate pickup and shuttle alerts."
                        value={settings.locationTracking}
                        onToggle={handleLocationToggle}
                        warning={!settings.locationTracking ? "Required for real-time shuttle tracking." : undefined}
                    />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Save Button */}
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
        </View>
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
    settingsGroup: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    toggleTextContainer: {
        flex: 1,
        marginLeft: 15,
        marginRight: 10,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    toggleDescription: {
        fontSize: 14,
        color: COLORS.textFaded,
        marginTop: 2,
    },
    toggleWarning: {
        fontSize: 13,
        color: '#FF6347',
        marginTop: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 60, // Align with text container
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

export default PrivacyScreen;