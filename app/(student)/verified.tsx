// app/(student)/verified.tsx (Email Verified Success Screen)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Styles';

const REDIRECT_DELAY = 3000; // 3 seconds before redirecting

const VerifiedScreen = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(REDIRECT_DELAY / 1000); // 3

    // Countdown and Redirect Logic
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        let countdownInterval: ReturnType<typeof setInterval>;

        // Start countdown display
        countdownInterval = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Redirect after delay
        timer = setTimeout(() => {
            clearInterval(countdownInterval);
            // Navigate to the main student map/home screen
            router.replace('/(student)/home-search'); 
        }, REDIRECT_DELAY);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }, [router]);

    return (
        <View style={styles.container}>
            <View style={styles.checkCircle}>
                <Ionicons name="checkmark-sharp" size={60} color="white" />
            </View>
            
            <Text style={styles.title}>Email Verified!</Text>
            <Text style={styles.welcome}>Welcome, [User Name]! 🥳</Text>
            <Text style={styles.message}>
                Your account has been successfully verified. Get ready to track your campus shuttles in real-time.
            </Text>

            <Text style={styles.redirecting}>Redirecting to app in</Text>
            
            {/* Countdown Spinner (Mock of the design) */}
            <View style={styles.countdownCircle}>
                <Text style={styles.countdownText}>{countdown}</Text>
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
            </View>
            
            {/* Features (Mock of the design icons) */}
            <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                    <Ionicons name="bus-outline" size={30} color={COLORS.text} />
                    <Text style={styles.featureText}>Real-time Tracking</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="notifications-outline" size={30} color={COLORS.text} />
                    <Text style={styles.featureText}>Smart Alerts</Text>
                </View>
                <View style={styles.featureItem}>
                    <Ionicons name="calendar-outline" size={30} color={COLORS.text} />
                    <Text style={styles.featureText}>Easy Scheduling</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
    welcome: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 50,
    },
    redirecting: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 20,
    },
    countdownCircle: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    countdownText: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        zIndex: 1,
    },
    spinner: {
        position: 'absolute',
        transform: [{ scale: 1.5 }], 
        opacity: 0.5,
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    featureItem: {
        alignItems: 'center',
        width: '30%',
    },
    featureText: {
        fontSize: 12,
        color: COLORS.text,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default VerifiedScreen;