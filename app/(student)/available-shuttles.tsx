// app/(student)/available-shuttles.tsx (Available Shuttles List)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Styles';

// --- MOCK DATA ---
interface Shuttle {
    id: string;
    route: string;
    busNumber: number;
    currentLocation: string;
    etaMinutes: number;
}

const MOCK_SHUTTLES: Shuttle[] = [
    { id: 'SA1', route: 'Express A', busNumber: 42, currentLocation: 'Main Campus', etaMinutes: 3 },
    { id: 'SL1', route: 'Campus Loop', busNumber: 17, currentLocation: 'North Campus', etaMinutes: 8 },
    { id: 'SB2', route: 'South Campus', busNumber: 9, currentLocation: 'Tech Junction', etaMinutes: 15 },
    // A shuttle that is very far, to test the reminder time limitation later
    { id: 'SF3', route: 'Far Route', busNumber: 55, currentLocation: 'City Gate', etaMinutes: 25 }, 
];

// --- Sub-Component: Shuttle Card ---
interface ShuttleCardProps {
    shuttle: Shuttle;
    onSelect: (shuttle: Shuttle) => void;
}

const ShuttleCard: React.FC<ShuttleCardProps> = ({ shuttle, onSelect }) => (
    <TouchableOpacity 
        style={styles.card}
        onPress={() => onSelect(shuttle)}
    >
        <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
                <Ionicons name="bus" size={24} color="black" />
            </View>
            <View style={styles.details}>
                <Text style={styles.shuttleRoute}>{shuttle.route}</Text>
                <Text style={styles.shuttleBusNumber}>Bus {shuttle.busNumber}</Text>
            </View>
            <View style={styles.etaBadge}>
                <Text style={styles.etaText}>{shuttle.etaMinutes}</Text>
                <Text style={styles.etaUnit}>minutes</Text>
            </View>
        </View>
        
        <View style={styles.locationRow}>
            <Ionicons name="locate-outline" size={14} color={COLORS.text} style={{ opacity: 0.6 }} />
            <Text style={styles.locationText}>Currently at: {shuttle.currentLocation}</Text>
        </View>
    </TouchableOpacity>
);

// --- Main Screen Component ---
const AvailableShuttlesScreen = () => {
    const router = useRouter();
    // Retrieve parameters from the previous screen
    const params = useLocalSearchParams();
    const destination = params.destination || 'Selected Destination';

    const [shuttles, setShuttles] = useState<Shuttle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Mock Data Fetching (Replace with API call later) ---
    useEffect(() => {
        // In a real app, this would be a POST/GET call to the backend:
        // GET /api/shuttles/available?destination={destination}
        
        const fetchShuttles = async () => {
            setIsLoading(true);
            setError('');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            
            // For now, we display all mock shuttles regardless of destination
            setShuttles(MOCK_SHUTTLES);
            setIsLoading(false);
        };

        fetchShuttles();
    }, [destination]);


    // --- Selection Handler ---
    const handleSelectShuttle = (shuttle: Shuttle) => {
        // Navigate to the Set Reminder screen, passing all necessary shuttle data
        router.push({
            pathname: '/(student)/set-reminder',
            params: {
                shuttleId: shuttle.id,
                route: shuttle.route,
                busNumber: shuttle.busNumber,
                currentLocation: shuttle.currentLocation,
                etaMinutes: shuttle.etaMinutes.toString(), // Pass numbers as strings for URL params
                destination: destination,
            }
        });
    };

    return (
        <View style={styles.container}>
            
            {/* Header and Back Button */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Available Shuttles</Text>
                    {/* Placeholder for menu or close icon */}
                    <View style={{ width: 50 }} /> 
                </View>
            </View>

            {/* Destination Tag */}
            <View style={styles.destinationTag}>
                <Ionicons name="location-outline" size={18} color={COLORS.text} />
                <Text style={styles.destinationText}>{destination}</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            ) : shuttles.length === 0 ? (
                <Text style={styles.emptyText}>No shuttles found for this route right now.</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.listContainer}>
                    {shuttles.map(shuttle => (
                        <ShuttleCard 
                            key={shuttle.id} 
                            shuttle={shuttle} 
                            onSelect={handleSelectShuttle} 
                        />
                    ))}
                    <Text style={styles.tipText}>Tap any shuttle to set a reminder!</Text>
                </ScrollView>
            )}

            {/* Bottom Navigation (as per design) */}
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
    header: {
        paddingTop: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 50,
        paddingBottom: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    destinationTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        padding: 10,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    destinationText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 8,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        flex: 1,
        marginLeft: 15,
    },
    shuttleRoute: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    shuttleBusNumber: {
        fontSize: 14,
        color: COLORS.border,
    },
    etaBadge: {
        alignItems: 'flex-end',
    },
    etaText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary, // Blue color for ETA
    },
    etaUnit: {
        fontSize: 12,
        color: COLORS.primary,
        opacity: 0.8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    locationText: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.8,
        marginLeft: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: COLORS.primary,
    },
    tipText: {
        textAlign: 'center',
        fontSize: 14,
        color: COLORS.border,
        marginTop: 10,
    },
    // --- Bottom Navigation Styles ---
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

export default AvailableShuttlesScreen;