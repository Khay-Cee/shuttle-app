// app/splash.tsx (Character-by-character typing effect with 4-second delay)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from './constants/Styles';

// The full text to be typed
const FULL_TAGLINE = 'Your time, tracked in a minute';
// Delay between each character (in milliseconds)
const TYPING_SPEED = 50;
// 💡 FIX: Delay after typing completes before navigation is set to 4000ms (4 seconds)
const FINAL_NAV_DELAY = 4000; 

const SplashScreen = () => {
    const router = useRouter();
    // State to hold the currently displayed text
    const [displayedText, setDisplayedText] = useState('');
    // State for cursor visibility
    const [showCursor, setShowCursor] = useState(true);

    // Blinking cursor effect
    useEffect(() => {
        const cursorBlink = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);

        return () => clearInterval(cursorBlink);
    }, []);

    // Typing Logic
    useEffect(() => {
        if (displayedText.length < FULL_TAGLINE.length) {
            // Continue typing
            const timer = setTimeout(() => {
                setDisplayedText(FULL_TAGLINE.slice(0, displayedText.length + 1));
            }, TYPING_SPEED);

            return () => clearTimeout(timer);
        } else {
            // Typing is complete, navigate after delay
            const navigationTimer = setTimeout(() => {
                router.replace('/chat');
            }, FINAL_NAV_DELAY);

            return () => clearTimeout(navigationTimer);
        }
    }, [displayedText, router]);

    // Display text with cursor
    const displayWithCursor = displayedText + (showCursor ? '|' : '');

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image 
                source={require('../assets/logo1.png')} // Changed to shuttle_smart_logo.png for consistency
                style={styles.logo} 
            />
            
            <Text style={styles.tagline}>
                {displayWithCursor}
            </Text> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 180, 
        height: 40,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    tagline: {
        color: COLORS.secondary,
        fontSize: 14,
        minHeight: 20,
    },
});

export default SplashScreen;