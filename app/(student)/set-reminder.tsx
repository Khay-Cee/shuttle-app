// app/(student)/set-reminder.tsx (Set Reminder Screen)

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Styles';

type MapModule = typeof import('react-native-maps') | null;

// Reminder options available to the user
const REMINDER_OPTIONS = [3, 5, 10, 15]; // minutes

// --- Sub-Component: Reminder Time Button ---
interface ReminderButtonProps {
    time: number;
    isSelected: boolean;
    onPress: (time: number) => void;
}

const ReminderButton: React.FC<ReminderButtonProps> = ({ time, isSelected, onPress }) => (
    <TouchableOpacity
        style={[styles.reminderButton, isSelected && styles.reminderButtonSelected]}
        onPress={() => onPress(time)}
    >
        <Text style={[styles.reminderText, isSelected && styles.reminderTextSelected]}>{time}</Text>
        <Text style={[styles.reminderUnit, isSelected && styles.reminderTextSelected]}>min</Text>
    </TouchableOpacity>
);


// --- Main Screen Component ---
const SetReminderScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [mapModule, setMapModule] = useState<MapModule>(null);
    
    // Load react-native-maps only on native to prevent web bundler errors
    useEffect(() => {
        if (Platform.OS !== 'web') {
            import('react-native-maps').then(setMapModule).catch(() => setMapModule(null));
        }
    }, []);
    
    // Parse shuttle details from URL parameters
    const shuttleId = params.shuttleId as string;
    const route = params.route as string;
    const busNumber = params.busNumber as string;
    const currentLocation = params.currentLocation as string;
    const destination = params.destination as string;
    const etaMinutes = parseInt(params.etaMinutes as string) || 99; // Default to high ETA if missing

    // State for the selected reminder time
    const [selectedReminderTime, setSelectedReminderTime] = useState(5); // Default to 5 mins


    // Validation for Proceed button
    const isReminderValid = useMemo(() => {
        // A reminder must be selected and must be less than the ETA
        return selectedReminderTime > 0 && selectedReminderTime < etaMinutes;
    }, [selectedReminderTime, etaMinutes]);


    // Handler for proceeding to the tracking screen
    const handleProceed = () => {
        if (!isReminderValid) {
            Alert.alert(
                "Invalid Reminder Time",
                `The selected reminder time (${selectedReminderTime} min) must be less than the shuttle's ETA (${etaMinutes} min). Please select a closer time.`,
                [{ text: "OK" }]
            );
            return;
        }

        // --- Core Action: Set Reminder and Navigate to Activity Page ---
        // Pass the new trip details to the Activity page
        router.replace({
            pathname: '/(student)/activity',
            params: {
                newTrip: JSON.stringify({
                    shuttleId,
                    route,
                    destination,
                    reminderTime: selectedReminderTime.toString(),
                    date: new Date().toISOString(), // Use current time for mock trip date
                }),
            }
        });
    };

    return (
        <View style={styles.container}>
            
            {/* ⚠️ Map View Placeholder/Fallback for Web (Similar to home-search) */}
            <View style={styles.mapContainer}>
                {Platform.OS === 'web' || !mapModule ? (
                    <View style={styles.mapFallback}>
                        <Ionicons name="map-outline" size={30} color={COLORS.text} />
                        <Text style={styles.mapFallbackText}>Live Map View</Text>
                    </View>
                ) : (
                    // On Native, use MapView (can be simplified to just a static map showing the route)
                    <mapModule.default style={styles.map} initialRegion={{ latitude: 6.67, longitude: -1.57, latitudeDelta: 0.05, longitudeDelta: 0.05 }} />
                )}
            </View>

            {/* Content Card (Set Reminder) */}
            <ScrollView contentContainerStyle={styles.contentCard}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.screenTitle}>Set Reminder</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Shuttle Information Card */}
                <View style={styles.shuttleInfoCard}>
                    <View style={styles.infoRow}>
                        <Ionicons name="bus" size={24} color="black" />
                        <View style={styles.infoDetails}>
                            <Text style={styles.routeText}>{route} <Text style={styles.busNumberText}>Bus {busNumber}</Text></Text>
                            <Text style={styles.currentLocationText}>Currently at: {currentLocation}</Text>
                        </View>
                        <View style={styles.etaBadge}>
                            <Text style={styles.etaText}>{etaMinutes}</Text>
                            <Text style={styles.etaUnit}>mins</Text>
                        </View>
                    </View>
                    <View style={styles.locationDetailRow}>
                        <Ionicons name="pin" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.locationDetailText}>Going to: {destination}</Text>
                    </View>
                </View>

                {/* Reminder Options */}
                <Text style={styles.reminderHeader}>Remind me before arrival</Text>
                <View style={styles.reminderOptionsContainer}>
                    {REMINDER_OPTIONS.map(time => (
                        <ReminderButton
                            key={time}
                            time={time}
                            isSelected={selectedReminderTime === time}
                            onPress={() => setSelectedReminderTime(time)}
                        />
                    ))}
                </View>

                {/* Reminder Notification Preview */}
                <View style={styles.notificationBox}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                    <View style={styles.notificationTextContainer}>
                        <Text style={styles.notificationTitle}>Reminder Notification</Text>
                        <Text style={styles.notificationBody}>
                            You will receive a notification {selectedReminderTime} minutes before the shuttle arrives at {destination}.
                        </Text>
                        {/* Validation warning */}
                        {!isReminderValid && (
                            <Text style={styles.validationWarning}>
                                ⚠️ Cannot set a reminder time greater than or equal to the ETA ({etaMinutes} mins).
                            </Text>
                        )}
                    </View>
                </View>

                {/* Proceed Button */}
                <TouchableOpacity
                    style={[styles.proceedButton, !isReminderValid && styles.disabledButton]}
                    onPress={handleProceed}
                    disabled={!isReminderValid}
                >
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={24} color={COLORS.primary} />
                    <Text style={[styles.navText, { color: COLORS.primary }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/activity')}>
                    <Ionicons name="time-outline" size={24} color={COLORS.text} />
                    <Text style={styles.navText}>Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/account')}>
                    <Ionicons name="person-outline" size={24} color={COLORS.text} />
                    <Text style={styles.navText}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mapContainer: {
        height: '40%', // Take up the top part of the screen
        width: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapFallback: {
        flex: 1,
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapFallbackText: {
        fontSize: 16,
        marginTop: 5,
        color: COLORS.text,
    },
    contentCard: {
        minHeight: 500,
        backgroundColor: COLORS.secondary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 20,
        marginTop: -30, // Overlap the map area slightly
        paddingBottom: 80, // Space for the bottom nav
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 5,
        paddingTop: 25,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    // --- Shuttle Info Card ---
    shuttleInfoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 30,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 10,
        marginBottom: 10,
    },
    infoDetails: {
        flex: 1,
        marginLeft: 15,
    },
    routeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    busNumberText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: 'normal',
    },
    currentLocationText: {
        fontSize: 14,
        color: COLORS.text,
    },
    etaBadge: {
        alignItems: 'flex-end',
    },
    etaText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    etaUnit: {
        fontSize: 12,
        color: COLORS.primary,
        opacity: 0.8,
    },
    locationDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
    },
    locationDetailText: {
        fontSize: 16,
        color: COLORS.text,
    },
    // --- Reminder Options ---
    reminderHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    reminderOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    reminderButton: {
        width: '23%',
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    reminderButtonSelected: {
        backgroundColor: COLORS.text, // Dark background
        borderColor: COLORS.text,
    },
    reminderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    reminderTextSelected: {
        color: 'white',
    },
    reminderUnit: {
        fontSize: 12,
        color: COLORS.text,
    },
    // --- Notification Preview ---
    notificationBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F8FF', // Light blue background
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 10,
        padding: 15,
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    notificationTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    notificationBody: {
        fontSize: 14,
        color: COLORS.text,
    },
    validationWarning: {
        fontSize: 13,
        color: 'red',
        marginTop: 10,
        fontWeight: '600',
    },
    // --- Proceed Button ---
    proceedButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: COLORS.border,
        opacity: 0.6,
    },
    proceedButtonText: {
        color: COLORS.secondary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    // --- Bottom Navigation Styles (Copied from previous screen for consistency) ---
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 70,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: Platform.OS === 'ios' ? 10 : 0,
    },
    navItem: {
        alignItems: 'center',
        padding: 5,
    },
    navText: {
        fontSize: 12,
        marginTop: 2,
        color: COLORS.text,
    },
});

export default SetReminderScreen;