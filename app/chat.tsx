// app/chat.tsx (FINAL VERSION - Without Footer Images/GIFs)

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from './constants/Styles';
import TypingIndicator from '../components/TypingIndicator';

// --- Full Conversation Data ---
const ALL_MESSAGES: { text: string; sender: 'user' | 'system'; delay: number; image?: string }[] = [
    { text: "Rumor has it you're going to deliver us from shuttle wahala on campus. How?", sender: 'user', delay: 1000 },
    { text: "Yes. We provide students with live tracking of your school shuttles and allow you to filter to know if shuttles exist in your route", sender: 'system', delay: 2500 },
    { text: "Great! But how do we know when the shuttles is actually arriving?", sender: 'user', delay: 2000 },
    { text: "We allow you set reminders and send you precise alerting (eg. '3 min away') so you arrive on time.", sender: 'system', delay: 3000 },
    { text: "What about the drivers? Is it difficult for them to broadcast their location?", sender: 'user', delay: 2000 },
    { text: "Absolutely not, drivers just need to tap 'Start Session' and their good to go.", sender: 'system', delay: 2500 },
];

// --- Chat Bubble Component with Pop Animation ---
const ChatBubble = ({ text, sender }: { text: string; sender: 'user' | 'system' }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300, 
            easing: Easing.out(Easing.back(1.7)),
            useNativeDriver: true,
        }).start();
    }, [scaleAnim]); 

    return (
        <Animated.View style={[
            styles.bubbleContainer, 
            sender === 'system' ? styles.systemAlign : styles.userAlign,
            { transform: [{ scale: scaleAnim }] }
        ]}>
            <Text style={styles.bubbleText}>{text}</Text>
        </Animated.View>
    );
};

const ChatScreen = () => {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    
    const [displayedMessages, setDisplayedMessages] = useState<typeof ALL_MESSAGES>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0); 

    // --- Message Sequence Logic ---
    useEffect(() => {
        if (currentMessageIndex >= ALL_MESSAGES.length) {
            // All messages displayed, set final timer for navigation
            const finalTimer = setTimeout(() => {
                router.replace('/role-select');
            }, 3000); 

            return () => clearTimeout(finalTimer);
        }

        if (ALL_MESSAGES[currentMessageIndex].sender === 'system') {
            setIsTyping(true);
        }

        const delayBeforeNextMessage = ALL_MESSAGES[currentMessageIndex].delay;
        
        const messageTimer = setTimeout(() => {
            setIsTyping(false);
            setDisplayedMessages(prev => [...prev, ALL_MESSAGES[currentMessageIndex]]);
            setCurrentMessageIndex(prev => prev + 1);

            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, delayBeforeNextMessage);

        return () => clearTimeout(messageTimer);
    }, [currentMessageIndex, router]);
    
    // --- Render ---
    return (
        <View style={styles.mainContainer}>
            
            {/* Header/Branding Area */}
            <View style={styles.header}>
                <Image 
                    source={require('../assets/logo.png')}
                    style={styles.logo} 
                />
                <Image 
                    source={require('../assets/clock_icon.png')} 
                    style={styles.clockIcon} 
                />
            </View>

            <ScrollView 
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Messages */}
                {displayedMessages.map((msg, index) => (
                    <ChatBubble key={index} text={msg.text} sender={msg.sender} />
                ))}

                {/* Typing Indicator */}
                {isTyping && <TypingIndicator />}
                
                <View style={{ height: 20 }} /> 
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        position: 'relative',
        zIndex: 10,
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
    },
    clockIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingVertical: 10,
        justifyContent: 'flex-end',
    },
    bubbleContainer: {
        maxWidth: '80%',
        marginVertical: 5,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    userAlign: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 5, 
    },
    systemAlign: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.text, 
        borderBottomRightRadius: 5,
    },
    bubbleText: {
        fontSize: 14,
        color: COLORS.secondary, 
    },
});

export default ChatScreen;