// app/(student)/activity.tsx (Upcoming and Past Trips Screen)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header';

// --- MOCK DATA & TYPES ---
interface Trip {
    id: string;
    route: string;
    destination: string;
    date: string; // ISO String
    time: string;
    status: 'Upcoming' | 'Past' | 'Cancelled';
}

const MOCK_PAST_TRIPS: Trip[] = [
    { id: 'T001', route: 'Campus Loop', destination: 'Unity Hall', date: '2025-11-28', time: '08:00 AM', status: 'Past' },
    { id: 'T002', route: 'Express B', destination: 'Tech Junction', date: '2025-11-27', time: '10:30 AM', status: 'Past' },
];

const MOCK_UPCOMING_TRIPS: Trip[] = [
    { id: 'T003', route: 'Express A', destination: 'KNUST Business School (KSB)', date: '2025-12-10', time: '07:45 AM', status: 'Upcoming' },
];

// --- Sub-Component: Trip Card ---
interface TripCardProps {
    trip: Trip;
    onCancel?: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onCancel }) => {
    const tripDate = new Date(trip.date).toLocaleDateString();
    
    return (
        <View style={[styles.card, trip.status === 'Past' && styles.cardPast]}>
            <View style={styles.cardHeader}>
                <Ionicons name="bus" size={24} color={COLORS.primary} />
                <View style={styles.cardDetails}>
                    <Text style={styles.cardRoute}>{trip.route}</Text>
                    <Text style={styles.cardDestination}>{trip.destination}</Text>
                </View>
                <View style={[styles.statusBadge, trip.status === 'Past' && styles.statusBadgePast]}>
                    <Text style={styles.statusText}>{trip.status}</Text>
                </View>
            </View>
            
            <View style={styles.cardFooter}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textFaded} />
                <Text style={styles.dateTimeText}>{tripDate} @ {trip.time}</Text>
                
                {trip.status === 'Upcoming' && onCancel && (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => onCancel(trip)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// --- Main Screen Component ---
const ActivityScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
    const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>(MOCK_UPCOMING_TRIPS);
    const [pastTrips, setPastTrips] = useState<Trip[]>(MOCK_PAST_TRIPS);
    const [modalVisible, setModalVisible] = useState(false);
    const [tripToCancel, setTripToCancel] = useState<Trip | null>(null);

    // Effect to handle the new trip added from the Set Reminder page
    useEffect(() => {
        if (params.newTrip) {
            try {
                const newTripData = JSON.parse(params.newTrip as string);
                
                // Construct the new trip object
                const newId = `T${Math.floor(Math.random() * 10000)}`;
                const newTrip: Trip = {
                    id: newId,
                    route: newTripData.route,
                    destination: newTripData.destination,
                    date: new Date().toISOString().split('T')[0], // Today's date
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                    status: 'Upcoming',
                };
                
                setUpcomingTrips(prev => [newTrip, ...prev]);
                // Ensure the Upcoming tab is active after adding a new trip
                setActiveTab('Upcoming'); 

            } catch (e) {
                console.error("Error parsing new trip data:", e);
            }
        }
    }, [params.newTrip]);

    // Handler for showing the cancel confirmation modal
    const handleCancelPress = (trip: Trip) => {
        setTripToCancel(trip);
        setModalVisible(true);
    };

    // Handler for confirming the cancellation
    const confirmCancel = () => {
        if (tripToCancel) {
            // Logic to remove trip from state/backend
            setUpcomingTrips(prev => prev.filter(t => t.id !== tripToCancel.id));
            
            // Redirect to Home page after cancellation (as per requirement)
            setModalVisible(false);
            setTripToCancel(null);
            Alert.alert("Trip Cancelled", "Your trip has been successfully cancelled.");
            router.replace('/(student)/home-search'); 
        }
    };
    
    // Handler for keeping the trip
    const keepTrip = () => {
        setModalVisible(false);
        setTripToCancel(null);
        // Stays on the Upcoming Trips area
    };

    const displayTrips = activeTab === 'Upcoming' ? upcomingTrips : pastTrips;

    return (
        <View style={COMMON_STYLES.container}>
            <Header title="Your Activity" showBack={true} showMenu={false} />
            
            {/* Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'Upcoming' && styles.tabActive]}
                    onPress={() => setActiveTab('Upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.tabTextActive]}>Upcoming Trips</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'Past' && styles.tabActive]}
                    onPress={() => setActiveTab('Past')}
                >
                    <Text style={[styles.tabText, activeTab === 'Past' && styles.tabTextActive]}>Past Trips</Text>
                </TouchableOpacity>
            </View>

            {/* Trip List */}
            <ScrollView contentContainerStyle={styles.listContainer}>
                {displayTrips.length === 0 ? (
                    <Text style={styles.emptyText}>No {activeTab.toLowerCase()} trips available.</Text>
                ) : (
                    displayTrips.map(trip => (
                        <TripCard 
                            key={trip.id} 
                            trip={trip} 
                            onCancel={activeTab === 'Upcoming' ? handleCancelPress : undefined}
                        />
                    ))
                )}
            </ScrollView>

            {/* Cancel Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={keepTrip} // Close when clicking outside (on backdrop)
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={keepTrip} // Click outside to close
                >
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Cancel Trip?</Text>
                        <Text style={styles.modalBody}>
                            Are you sure you want to cancel your trip to **{tripToCancel?.destination}**? This cannot be undone.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalButton, styles.keepButton]} onPress={keepTrip}>
                                <Text style={styles.modalButtonText}>Keep Trip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelConfirmButton]} onPress={confirmCancel}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>


            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/home-search')}>
                    <Ionicons name="home-outline" size={24} color={COLORS.text} />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="time" size={24} color={COLORS.primary} />
                    <Text style={[styles.navText, { color: COLORS.primary }]}>Activity</Text>
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
    // --- Tabs ---
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        marginHorizontal: 20,
        backgroundColor: COLORS.secondary,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
    },
    tabTextActive: {
        color: COLORS.secondary,
    },
    // --- List & Cards ---
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 80, // Space for bottom nav
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 2,
    },
    cardPast: {
        opacity: 0.8,
        backgroundColor: '#F7F7F7',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    cardDetails: {
        flex: 1,
        marginLeft: 10,
    },
    cardRoute: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cardDestination: {
        fontSize: 14,
        color: COLORS.text,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: '#D4EDDA', // Light Green
    },
    statusBadgePast: {
        backgroundColor: '#E0E0E0',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#155724', // Dark Green
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    dateTimeText: {
        flex: 1,
        marginLeft: 5,
        fontSize: 14,
        color: COLORS.text,
    },
    cancelButton: {
        backgroundColor: '#FF6347', // Tomato Red
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: COLORS.textFaded,
    },
    // --- Modal Styles ---
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    modalBody: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    keepButton: {
        backgroundColor: COLORS.border,
    },
    cancelConfirmButton: {
        backgroundColor: '#FF6347',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    // --- Bottom Nav (Copied) ---
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

export default ActivityScreen;