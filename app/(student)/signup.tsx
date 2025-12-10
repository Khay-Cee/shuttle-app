// app/(student)/signup.tsx (Student Sign Up Screen - FINAL AUTOSUGGEST VERSION)

import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header';

// --- DUMMY DATA ---
const SCHOOLS = ['KNUST', 'University of Ghana', 'GIMPA', 'Academic City University College', 'Ashesi University', 'Kwame Nkrumah University of Science and Technology', 'Central University', 'Accra Technical University'];

// Simple email regex for basic frontend validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_EMAIL_DOMAIN = /@(st\.)?knust\.edu\.gh|@ug\.edu\.gh|@gimpa\.edu\.gh|@ashesi\.edu\.gh$/i; 

// --- DUMMY BACKEND URL ---
// const BACKEND_URL = 'YOUR_BACKEND_URL'; // TODO: Replace with actual backend URL 

const StudentSignUpScreen = () => {
    const router = useRouter();
    
    // --- Form State Management ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [school, setSchool] = useState(''); // Selected or currently typed school name
    const [studentId, setStudentId] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // --- UI/Validation State ---
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSchoolListVisible, setIsSchoolListVisible] = useState(false);

    const schoolInputRef = useRef<TextInput>(null);

    // --- Validation Logic ---
    const isFormValid = useMemo(() => {
        const requiredFields = [firstName, lastName, username, school, studentId, studentEmail, password];
        const allFilled = requiredFields.every(field => field.length > 0);
        
        const isEmailValid = EMAIL_REGEX.test(studentEmail) && STUDENT_EMAIL_DOMAIN.test(studentEmail);

        if (allFilled && !isEmailValid) {
            setError("Please use a valid Student Email for a registered school.");
        } else if (!allFilled) {
             setError(''); 
        }

        return allFilled && isEmailValid;
    }, [firstName, lastName, username, school, studentId, studentEmail, password]);


    // --- Filtered School List for Autocomplete ---
    const filteredSchools = useMemo(() => {
        if (!school) {
            // If the user hasn't typed anything, show the full list when the dropdown is clicked
            return SCHOOLS;
        }
        const lowerCaseQuery = school.toLowerCase();
        return SCHOOLS.filter(s => s.toLowerCase().includes(lowerCaseQuery));
    }, [school]);

    const handleSchoolSelect = (selectedSchool: string) => {
        setSchool(selectedSchool);
        setIsSchoolListVisible(false); // Close the list
        Keyboard.dismiss();
    };

    // --- API & Navigation Handler ---
    const handleSignUp = async () => {
        if (!isFormValid) {
            setError(error || "Please fill out all fields correctly.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // MOCK FOR DEVELOPMENT
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            router.replace('/(student)/verify-email');
        } catch {
            setError('Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <View style={COMMON_STYLES.container}>
            {/* We wrap the entire content in a TouchableOpacity to handle closing the dropdown on outside tap */}
            <TouchableOpacity 
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={() => isSchoolListVisible && setIsSchoolListVisible(false)}
            >
                <Header title="Sign Up" showBack={true} showMenu={false} />
                
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <Text style={styles.headerText}>Create your account and shuttle smart today!</Text>
                    
                    {/* --- Input Fields --- */}
                    
                    <Text style={styles.label}>First Name</Text>
                    <TextInput style={styles.input} placeholder="John" placeholderTextColor={'grey'} value={firstName} onChangeText={setFirstName} />
                    
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput style={styles.input} placeholder="Doe" placeholderTextColor={'grey'} value={lastName} onChangeText={setLastName} />
                    
                    <Text style={styles.label}>User Name</Text>
                    <TextInput style={styles.input} placeholder="johndoe12" placeholderTextColor={'grey'} value={username} onChangeText={setUsername} autoCapitalize="none" />
                    
                    {/* --- School Searchable Dropdown --- */}
                    <Text style={styles.label}>School</Text>
                    <View style={styles.searchableDropdownContainer}>
                        <TextInput 
                            ref={schoolInputRef}
                            style={styles.inputField} 
                            placeholder="Type or select your School" 
                            placeholderTextColor={'grey'} 
                            value={school} 
                            onChangeText={text => {
                                setSchool(text);
                                setIsSchoolListVisible(true); // Always show list when typing
                            }}
                            onFocus={() => setIsSchoolListVisible(true)}
                            // We don't use onBlur here because it fires when the dropdown item is pressed
                            autoCapitalize="words"
                        />
                        <TouchableOpacity 
                            style={styles.dropdownToggle} 
                            onPress={() => {
                                setIsSchoolListVisible(prev => !prev);
                                schoolInputRef.current?.focus();
                            }}
                        >
                            <Ionicons name="chevron-down" size={20} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Autocomplete Dropdown List */}
                    {isSchoolListVisible && (
                        <View style={styles.dropdownList}>
                            <FlatList
                                data={filteredSchools}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.schoolItem}
                                        onPress={() => handleSchoolSelect(item)}
                                    >
                                        <Text style={styles.schoolItemText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={() => (
                                    <Text style={styles.emptyListText}>No school matches &apos;{school}&apos;</Text>
                                )}
                                scrollEnabled={true}
                            />
                        </View>
                    )}
                    {/* ----------------------------------- */}
                    
                    <Text style={styles.label}>Student ID</Text>
                    <TextInput style={styles.input} placeholder="123456" placeholderTextColor={'grey'} keyboardType="number-pad" value={studentId} onChangeText={setStudentId} />
                    
                    <Text style={styles.label}>Student Email</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="your.email@university.edu" 
                        placeholderTextColor={'grey'} 
                        keyboardType="email-address" 
                        value={studentEmail} 
                        onChangeText={setStudentEmail} 
                        autoCapitalize="none"
                    />
                    
                    <Text style={styles.label}>Password</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="enter your password" 
                        placeholderTextColor={'grey'} 
                        secureTextEntry 
                        value={password} 
                        onChangeText={setPassword}
                    />
                    
                    {/* Error Display */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Sign Up Button */}
                    <TouchableOpacity 
                        style={[styles.primaryButton, (!isFormValid || isLoading) && styles.disabledButton]}
                        onPress={handleSignUp}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.secondary} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* Log In Link */}
                    <View style={styles.signUpRow}>
                        <Text style={styles.signUpText}>Have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/(student)/login')}>
                            <Text style={styles.signUpLink}> log in</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ height: 40 }} />
                </ScrollView>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerText: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 20,
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 15,
        marginBottom: 5,
    },
    // --- Standard Input Style ---
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: COLORS.background,
        color: COLORS.text,
    },
    // --- Searchable Dropdown Styles ---
    searchableDropdownContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.secondary,
        marginBottom: 5,
    },
    inputField: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    dropdownToggle: {
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: COLORS.border,
    },
    dropdownList: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginTop: 5,
        marginBottom: 10,
        maxHeight: 250,
        paddingVertical: 5,
    },
    schoolItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    schoolItemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    emptyListText: {
        padding: 10,
        textAlign: 'center',
        color: 'grey',
    },
    // --- Button & Link Styles ---
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 15,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 30,
    },
    disabledButton: {
        backgroundColor: COLORS.border,
        opacity: 0.6,
    },
    primaryButtonText: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signUpText: {
        color: COLORS.text,
        fontSize: 14,
    },
    signUpLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default StudentSignUpScreen;