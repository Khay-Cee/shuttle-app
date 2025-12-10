/**
 * Student Search Screen Example
 * Demonstrates how to search stops and match trips
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchStops, useMatchTrip } from '../api/hooks/useStudent';
import { StopSearchDto, MatchedRouteDto } from '../types/api';

export default function StudentSearchScreen() {
  const router = useRouter();
  const { searchStops, data: stops, isLoading: searchLoading } = useSearchStops();
  const { matchTrip, data: matchData, isLoading: matchLoading } = useMatchTrip();

  const [pickupQuery, setPickupQuery] = useState('');
  const [dropoffQuery, setDropoffQuery] = useState('');
  const [pickupStop, setPickupStop] = useState<StopSearchDto | null>(null);
  const [dropoffStop, setDropoffStop] = useState<StopSearchDto | null>(null);
  const [searchResults, setSearchResults] = useState<StopSearchDto[]>([]);
  const [searchType, setSearchType] = useState<'pickup' | 'dropoff' | null>(null);

  // Search for pickup stop
  const handleSearchPickup = async (query: string) => {
    setPickupQuery(query);
    setSearchType('pickup');

    if (query.length > 2) {
      try {
        const results = await searchStops(query);
        setSearchResults(results || []);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Search for dropoff stop
  const handleSearchDropoff = async (query: string) => {
    setDropoffQuery(query);
    setSearchType('dropoff');

    if (query.length > 2) {
      try {
        const results = await searchStops(query);
        setSearchResults(results || []);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Select stop from search results
  const handleSelectStop = (stop: StopSearchDto) => {
    if (searchType === 'pickup') {
      setPickupStop(stop);
      setPickupQuery(stop.stopName);
    } else {
      setDropoffStop(stop);
      setDropoffQuery(stop.stopName);
    }
    setSearchResults([]);
    setSearchType(null);
  };

  // Match trips with selected stops
  const handleMatchTrips = async () => {
    if (!pickupStop || !dropoffStop) {
      alert('Please select both pickup and dropoff stops');
      return;
    }

    try {
      const result = await matchTrip({
        pickupStopId: pickupStop.id,
        dropoffStopId: dropoffStop.id,
      });

      console.log('Matched routes:', result.routes);
      
      // Navigate to available shuttles with matched routes
      router.push({
        pathname: '/(student)/available-shuttles',
        params: {
          pickupStopId: pickupStop.id,
          dropoffStopId: dropoffStop.id,
        },
      });
    } catch (error) {
      console.error('Match error:', error);
    }
  };

  const renderStopItem = ({ item }: { item: StopSearchDto }) => (
    <TouchableOpacity
      style={styles.stopItem}
      onPress={() => handleSelectStop(item)}
    >
      <Text style={styles.stopName}>{item.stopName}</Text>
      {item.latitude && item.longitude && (
        <Text style={styles.stopCoords}>
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Shuttle</Text>

      {/* Pickup Stop Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Stop</Text>
        <TextInput
          style={styles.input}
          placeholder="Search pickup location..."
          value={pickupQuery}
          onChangeText={handleSearchPickup}
        />
      </View>

      {/* Dropoff Stop Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dropoff Stop</Text>
        <TextInput
          style={styles.input}
          placeholder="Search dropoff location..."
          value={dropoffQuery}
          onChangeText={handleSearchDropoff}
        />
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderStopItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.resultsList}
          />
        </View>
      )}

      {/* Search Button */}
      <TouchableOpacity
        style={[
          styles.searchButton,
          (!pickupStop || !dropoffStop) && styles.buttonDisabled,
        ]}
        onPress={handleMatchTrips}
        disabled={!pickupStop || !dropoffStop || matchLoading}
      >
        {matchLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Find Shuttles</Text>
        )}
      </TouchableOpacity>

      {/* Loading Indicator */}
      {searchLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  resultsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  resultsList: {
    flex: 1,
  },
  stopItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stopName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  stopCoords: {
    fontSize: 12,
    color: '#666',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
