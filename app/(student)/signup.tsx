// app/(student)/signup.tsx (Student Sign Up Screen - FINAL AUTOSUGGEST VERSION)

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { COLORS, COMMON_STYLES } from '../../constants/Styles';
import { useSignupStudent } from '../../src/api/hooks/useAuth';

// --- DUMMY DATA ---
const SCHOOLS = ['KNUST', 'University of Ghana', 'GIMPA', 'Academic City University College', 'Ashesi University', 'Kwame Nkrumah University of Science and Technology', 'Central University', 'Accra Technical University'];

// Simple email regex for basic frontend validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_EMAIL_DOMAIN = /@(st\.)?knust\.edu\.gh|@ug\.edu\.gh|@gimpa\.edu\.gh|@ashesi\.edu\.gh$/i; 

// --- DUMMY BACKEND URL ---
// const BACKEND_URL = 'YOUR_BACKEND_URL'; // TODO: Replace with actual backend URL 

const StudentSignUpScreen = () => {
    const router = useRouter();
    const { signupStudent, isLoading: apiLoading, error: apiError } = useSignupStudent();
    
    // --- Form State Management ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [school, setSchool] = useState(''); // Selected or currently typed school name
    const [studentId, setStudentId] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // --- UI/Validation State ---
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

        setError('');

        try {
            await signupStudent({
                firstName,
                lastName,
                username,
                schoolName: school,
                studentIdNumber: studentId,
                email: studentEmail,
                password,
            });

            Alert.alert('Success', 'Account created! Redirecting to email verification...', [
                { text: 'OK', onPress: () => router.replace('/(student)/verify-email') }
            ]);
        } catch (err: any) {
            setError(apiError || 'Failed to sign up. Please try again.');
            console.error('Signup error:', err);
        }
    };
    
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={COMMON_STYLES.container}
        >
            <View style={COMMON_STYLES.container}>
                {/* We wrap the entire content in a TouchableOpacity to handle closing the dropdown on outside tap */}
                <TouchableOpacity 
                    activeOpacity={1}
                    style={{ flex: 1 }}
                    onPress={() => isSchoolListVisible && setIsSchoolListVisible(false)}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer} 
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                    <Header title="Sign Up" showBack={false} showMenu={false} />
                    
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
                    {isSchoolListVisible && filteredSchools.length > 0 && (
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
                            scrollEnabled={false}
                            nestedScrollEnabled={true}
                            style={styles.dropdownList}
                        />
                    )}
                    {isSchoolListVisible && filteredSchools.length === 0 && (
                        <View style={styles.dropdownList}>
                            <Text style={styles.emptyListText}>No school matches &apos;{school}&apos;</Text>
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
                        style={[styles.primaryButton, (!isFormValid || apiLoading) && styles.disabledButton]}
                        onPress={handleSignUp}
                        disabled={!isFormValid || apiLoading}
                    >
                        {apiLoading ? (
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 80,
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
        maxHeight: 200,
        paddingVertical: 5,
        position: 'relative',
        zIndex: 1000,
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