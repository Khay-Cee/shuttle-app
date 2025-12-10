// app/(student)/home-search.tsx (Student Home Map & Search Screen - Web Fix Applied)

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Keyboard, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header';

// --- DUMMY DATA ---
const BUS_STOPS = [
    'Main Campus',
    'KNUST Business School (KSB)',
    'Brunei Hostel',
    'North Campus Hall',
    'Unity Hall',
    'Queen Elizabeth II Hall',
    'Tech Junction',
    'Ayeduase Gate',
    'Rattray Building',
];

const INITIAL_REGION = {
    latitude: 6.670,
    longitude: -1.573,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

const LIVE_SHUTTLES = [
    { id: 'S01', lat: 6.675, lon: -1.575, eta: '3 min', route: 'Express A' },
    { id: 'S02', lat: 6.660, lon: -1.570, eta: '8 min', route: 'Campus Loop' },
];

// --- Sub-Component: Searchable Input (Autocomplete) ---
interface SearchInputProps {
    label: string;
    value: string;
    onValueChange: (text: string) => void;
    onSelection: (stop: string) => void;
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
    label, value, onValueChange, onSelection, isFocused, onFocus, onBlur 
}) => {
    
    const filteredStops = useMemo(() => {
        if (!value) return BUS_STOPS;
        const lowerCaseQuery = value.toLowerCase();
        return BUS_STOPS.filter(stop => stop.toLowerCase().includes(lowerCaseQuery));
    }, [value]);

    return (
        <View style={[styles.searchInputGroup, isFocused && styles.searchInputGroupFocused]}>
            <Text style={styles.inputLabel}>{label}</Text>
            
            {/* Input Bar */}
            <View style={styles.inputBar}>
                <Ionicons name="search-outline" size={20} color={COLORS.border} style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.inputField}
                    placeholder="Enter bus stop..."
                    placeholderTextColor={COLORS.border}
                    value={value}
                    onChangeText={onValueChange}
                    onFocus={onFocus}
                    // onBlur is tricky with FlatList, we rely on the parent TouchableOpacity to handle closing
                    autoCapitalize="words"
                />
            </View>

            {/* Autocomplete List */}
            {isFocused && filteredStops.length > 0 && (
                <View style={styles.autocompleteList}>
                    <FlatList
                        data={filteredStops.slice(0, 5)} // Limit to 5 suggestions
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.autocompleteItem}
                                onPress={() => onSelection(item)}
                            >
                                <Ionicons name="location-outline" size={18} color={COLORS.text} style={{ marginRight: 10 }} />
                                <Text style={styles.autocompleteText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="always" // Important for usability
                    />
                </View>
            )}
        </View>
    );
};

// --- Main Screen Component ---
const HomeSearchScreen = () => {
    const router = useRouter();
    
    const [pickupStop, setPickupStop] = useState('');
    const [destinationStop, setDestinationStop] = useState('');
    const [focusedInput, setFocusedInput] = useState<'pickup' | 'destination' | null>(null);

    const isFormComplete = pickupStop && destinationStop;

    // Handler to navigate to the list of available shuttles
    const handleDone = () => {
        if (isFormComplete) {
            router.push({
                pathname: '/(student)/available-shuttles',
                params: { 
                    pickup: pickupStop, 
                    destination: destinationStop 
                }
            });
        }
    };

    // Handler for selecting a suggestion in the autocomplete list
    const handleSelection = (stop: string) => {
        if (focusedInput === 'pickup') {
            setPickupStop(stop);
        } else if (focusedInput === 'destination') {
            setDestinationStop(stop);
        }
        setFocusedInput(null); // Blur the input after selection
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Map View - CONDITIONAL RENDERING FIX */}
            {Platform.OS === 'web' ? (
                // Fallback view for web environment
                <View style={styles.mapFallback}>
                    <Ionicons name="map-outline" size={50} color={COLORS.border} />
                    <Text style={styles.mapFallbackText}>Map View Disabled on Web Preview</Text>
                    <Text style={styles.mapFallbackTextSmall}>(Please run on iOS/Android emulator or device)</Text>
                </View>
            ) : (
                // MapView for Native (iOS/Android) - loaded via require
                (() => {
                    const MapView = require('react-native-maps').default;
                    const { Marker, PROVIDER_GOOGLE } = require('react-native-maps');
                    return (
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={INITIAL_REGION}
                            showsUserLocation={true}
                        >
                            {/* Render Markers for Live Shuttles */}
                            {LIVE_SHUTTLES.map(shuttle => (
                                <Marker
                                    key={shuttle.id}
                                    coordinate={{ latitude: shuttle.lat, longitude: shuttle.lon }}
                                    title={shuttle.route}
                                    description={`ETA: ${shuttle.eta}`}
                                >
                                    {/* Custom Image for the Bus Icon */}
                                    <View style={styles.shuttleIconContainer}>
                                        <Text style={styles.shuttleEta}>{shuttle.eta}</Text>
                                        <Ionicons name="bus" size={24} color={COLORS.primary} />
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    );
                })()
            )}
            



            {/* Bottom Search Interface (Floating Card) */}
            <View style={styles.searchCard}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    
                    {/* Pick-Up Stop Search */}
                    <SearchInput
                        label="Choose pick up bus stop?"
                        value={pickupStop}
                        onValueChange={setPickupStop}
                        onSelection={handleSelection}
                        isFocused={focusedInput === 'pickup'}
                        onFocus={() => setFocusedInput('pickup')}
                        onBlur={() => focusedInput === 'pickup' && setFocusedInput(null)}
                    />

                    {/* Destination Stop Search */}
                    <SearchInput
                        label="Choose destination bus stop?"
                        value={destinationStop}
                        onValueChange={setDestinationStop}
                        onSelection={handleSelection}
                        isFocused={focusedInput === 'destination'}
                        onFocus={() => setFocusedInput('destination')}
                        onBlur={() => focusedInput === 'destination' && setFocusedInput(null)}
                    />

                    {/* Done Button */}
                    <TouchableOpacity
                        style={[styles.doneButton, !isFormComplete && styles.disabledButton]}
                        onPress={handleDone}
                        disabled={!isFormComplete}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>

            {/* Bottom Navigation (as seen in image_a3d7d8.png) */}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
    },
    map: {
        flex: 1,
        width: '100%',
    },
    // --- New Styles for Web Fallback ---
    mapFallback: {
        flex: 1,
        width: '100%',
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapFallbackText: {
        fontSize: 18,
        marginTop: 10,
        color: COLORS.text,
    },
    mapFallbackTextSmall: {
        fontSize: 14,
        color: COLORS.primary,
        marginTop: 5,
    },
    // -----------------------------------
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    shuttleIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    shuttleEta: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 5,
        marginBottom: 3,
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    // --- Search Card Styles ---
    searchCard: {
        position: 'absolute',
        bottom: 70, // Above the bottom nav
        left: 0,
        right: 0,
        backgroundColor: COLORS.secondary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    searchInputGroup: {
        marginBottom: 20,
    },
    searchInputGroupFocused: {
        zIndex: 10000, // Ensure focused input's dropdown appears above other elements
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        height: 50,
    },
    inputField: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    inputArrow: {
        marginLeft: 10,
        padding: 5,
    },
    autocompleteList: {
        position: 'absolute',
        top: 85, 
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        elevation: 5,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    autocompleteItem: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    autocompleteText: {
        fontSize: 16,
        color: COLORS.text,
    },
    doneButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: COLORS.border,
        opacity: 0.6,
    },
    doneButtonText: {
        color: COLORS.secondary,
        fontSize: 18,
        fontWeight: 'bold',
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

export default HomeSearchScreen;