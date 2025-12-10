// app/(student)/account/notifications.tsx (Notification Settings Screen)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../../constants/Styles';

// --- MOCK DATA ---
const INITIAL_SETTINGS = {
    pushNotification: true, // Initially ON
    emailNotification: true, // Initially ON
    busArrivalAlerts: true,  // Initially ON
    promotionsUpdates: false, // Initially OFF
};

// --- Sub-Component: Toggle Item ---
interface ToggleItemProps {
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    isTop?: boolean;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ title, description, value, onToggle, isTop = false }) => (
    <View style={styles.toggleItem}>
        <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleTitle}>{title}</Text>
            <Text style={styles.toggleDescription}>{description}</Text>
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
const NotificationScreen = () => {
    const router = useRouter();
    
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key: keyof typeof INITIAL_SETTINGS, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        // Mock API call to save settings
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        Alert.alert("Success", "Your notification preferences have been updated.");
        setIsSaving(false);
        router.back();
    };

    return (
        <View style={COMMON_STYLES.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <Text style={styles.sectionHeader}>Alerts</Text>
                <View style={styles.settingsGroup}>
                    
                    <ToggleItem
                        title="Bus Arrival Alerts"
                        description="Receive reminders for your upcoming trips."
                        value={settings.busArrivalAlerts}
                        onToggle={value => handleToggle('busArrivalAlerts', value)}
                    />
                    
                    <View style={styles.divider} />

                    <ToggleItem
                        title="Push Notifications"
                        description="Receive notifications directly on your phone."
                        value={settings.pushNotification}
                        onToggle={value => handleToggle('pushNotification', value)}
                    />
                    
                    <View style={styles.divider} />

                    <ToggleItem
                        title="Email Notifications"
                        description="Receive trip confirmations and important updates via email."
                        value={settings.emailNotification}
                        onToggle={value => handleToggle('emailNotification', value)}
                    />
                </View>

                <Text style={styles.sectionHeader}>Marketing</Text>
                <View style={styles.settingsGroup}>
                    <ToggleItem
                        title="Promotions & Updates"
                        description="Receive news about new routes, features, and special offers."
                        value={settings.promotionsUpdates}
                        onToggle={value => handleToggle('promotionsUpdates', value)}
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
                        {isSaving ? 'Saving...' : 'Save Preferences'}
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
        backgroundColor: COLORS.secondary,
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
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 5,
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
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    toggleTextContainer: {
        flex: 1,
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
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 15,
    },
    // --- Save Button ---
    saveContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
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

export default NotificationScreen;