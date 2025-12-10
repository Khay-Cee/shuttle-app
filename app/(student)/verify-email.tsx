// app/(student)/verify-email.tsx (Email Verification Screen)

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../constants/Styles';

// --- Verification Constants ---
const CORRECT_CODE = '666666'; 
const MAX_ATTEMPTS = 5;
const EMAIL_PLACEHOLDER = 'mkhj2@st.knust.edu.gh'; // Mock email from design

const VerifyEmailScreen = () => {
    const router = useRouter();
    
    // --- State Management ---
    const [code, setCode] = useState(Array(6).fill(''));
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(59); // Start at 59s
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const fullCode = code.join('');
    const isCodeComplete = fullCode.length === 6;

    // --- Timer for Resend Code ---
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

    // --- Input Handling ---
    const handleCodeChange = (text: string, index: number) => {
        if (text.length > 1) {
            // Paste functionality: if user pastes a full code
            if (text.length === 6 && /^\d{6}$/.test(text)) {
                setCode(text.split(''));
                Keyboard.dismiss();
                return;
            }
            text = text.charAt(0);
        }
        
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto-focus to the next input or dismiss keyboard
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        } else if (!text && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (index === 5 && text) {
            Keyboard.dismiss();
        }
    };
    
    // --- Verification Logic ---
    const handleVerify = () => {
        if (!isCodeComplete) {
            setError('Please enter the 6-digit verification code.');
            return;
        }

        if (fullCode === CORRECT_CODE) {
            // --- SUCCESS ---
            setError('');
            router.replace('/(student)/verified'); // Navigate to the success page
        } else {
            // --- FAILURE ---
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            if (newAttempts >= MAX_ATTEMPTS) {
                // Maximum attempts reached: Redirect to Role Select
                Alert.alert("Account Locked", "Too many incorrect attempts. Please try signing up again.", 
                    [{ text: "OK", onPress: () => router.replace('/role-select') }]
                );
            } else {
                // Show error and remaining attempts
                setError('Incorrect verification code.');
                setCode(Array(6).fill('')); // Clear the code boxes
                inputRefs.current[0]?.focus(); // Focus the first input
            }
        }
    };

    return (
        <View style={COMMON_STYLES.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Ionicons name="mail-outline" size={50} color="black" />
                </View>
                
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.subtitle}>
                    We have sent a 6-digit verification code to
                </Text>
                <Text style={styles.emailText}>{EMAIL_PLACEHOLDER}</Text>

                <Text style={styles.label}>Enter verification code</Text>
                
                {/* Verification Code Inputs */}
                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={el => { inputRefs.current[index] = el; }}
                            style={[
                                styles.codeInput,
                                attempts > 0 && fullCode !== CORRECT_CODE && styles.inputError // Red border on error
                            ]}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={text => handleCodeChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
                                    inputRefs.current[index - 1]?.focus();
                                }
                            }}
                        />
                    ))}
                </View>

                {/* Error and Attempts */}
                {error && (
                    <View style={styles.errorBox}>
                        <Ionicons name="close-circle-outline" size={20} color="red" />
                        <View style={{ marginLeft: 8 }}>
                            <Text style={styles.errorText}>{error}</Text>
                            <Text style={styles.errorAttempts}>{MAX_ATTEMPTS - attempts} attempts remaining before account lock</Text>
                        </View>
                    </View>
                )}
                {attempts > 0 && (
                    <Text style={styles.failedAttempts}>Failed attempts: {attempts}/{MAX_ATTEMPTS}</Text>
                )}


                <TouchableOpacity 
                    style={[styles.primaryButton, !isCodeComplete && styles.disabledButton]}
                    onPress={handleVerify}
                    disabled={!isCodeComplete || attempts >= MAX_ATTEMPTS}
                >
                    <Text style={styles.primaryButtonText}>Verify Email</Text>
                </TouchableOpacity>

                {/* Resend Code */}
                <Text style={styles.resendPrompt}>Did not receive the code?</Text>
                <Text style={styles.resendCode}>
                    Resend code in {resendTimer > 0 ? `${resendTimer}s` : (
                        <TouchableOpacity onPress={() => setResendTimer(59)}>
                            <Text style={styles.resendLink}>Resend</Text>
                        </TouchableOpacity>
                    )}
                </Text>
                
                <Text style={styles.spamCheck}>Check your spam folder if you do not see the email</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    backButton: {
        paddingTop: 50,
        paddingLeft: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 50,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.text,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
    },
    emailText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 10,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    codeInput: {
        width: 40,
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: COLORS.secondary,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEEEE',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        fontWeight: '600',
    },
    errorAttempts: {
        color: 'red',
        fontSize: 12,
    },
    failedAttempts: {
        color: 'orange',
        fontSize: 12,
        marginBottom: 10,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: COLORS.border,
    },
    primaryButtonText: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendPrompt: {
        fontSize: 14,
        color: COLORS.text,
        marginTop: 20,
    },
    resendCode: {
        fontSize: 14,
        color: COLORS.text,
        marginTop: 5,
    },
    resendLink: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    spamCheck: {
        fontSize: 12,
        color: COLORS.border,
        marginTop: 30,
        textAlign: 'center',
    }
});

export default VerifyEmailScreen;