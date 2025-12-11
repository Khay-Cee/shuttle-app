// app/(driver)/signup.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { COLORS, COMMON_STYLES } from '../../constants/Styles';
import { useSignupDriver } from '../../src/api/hooks/useAuth';

// Dummy schools list
const SCHOOLS = ['Kwame Nkrumah University of Science and Technology', 'University of Ghana', 'GIMPA', 'Academic City University College', 'Ashesi University'];

const SignUpScreen = () => {
  const router = useRouter();
  const { signupDriver, isLoading: apiLoading, error: apiError } = useSignupDriver();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSchoolListVisible, setIsSchoolListVisible] = useState(false);

  const schoolInputRef = useRef<TextInput>(null);

  const isFormValid = useMemo(() => {
    return firstName && lastName && school && email && password;
  }, [firstName, lastName, school, email, password]);

  const filteredSchools = useMemo(() => {
    if (!school) return SCHOOLS;
    const lowerCaseQuery = school.toLowerCase();
    return SCHOOLS.filter(s => s.toLowerCase().includes(lowerCaseQuery));
  }, [school]);

  const handleSchoolSelect = (selectedSchool: string) => {
    setSchool(selectedSchool);
    setIsSchoolListVisible(false);
    Keyboard.dismiss();
  };

  const handleSignUp = async () => {
    if (!isFormValid) {
      setError('Please fill out all fields.');
      return;
    }

    setError('');

    try {
      await signupDriver({
        firstName,
        lastName,
        schoolName: school,
        email,
        password,
      });

      Alert.alert('Success', 'Driver account created!', [
        { text: 'OK', onPress: () => router.replace('/(driver)/shuttle-select') }
      ]);
    } catch (err: any) {
      setError(apiError || 'Failed to sign up. Please try again.');
      console.error('Driver signup error:', err);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={COMMON_STYLES.container}
    >
      <View style={COMMON_STYLES.container}>
        <TouchableOpacity 
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => isSchoolListVisible && setIsSchoolListVisible(false)}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <Header title="Sign Up" showBack={false} showMenu={false} />
        
          {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John"
          value={firstName}
          onChangeText={setFirstName}
          editable={!apiLoading}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Doe"
          value={lastName}
          onChangeText={setLastName}
          editable={!apiLoading}
        />

        <Text style={styles.label}>School</Text>
        <View style={styles.searchableDropdownContainer}>
          <TextInput 
            ref={schoolInputRef}
            style={styles.inputField} 
            placeholder="Type or select your school" 
            placeholderTextColor={'grey'} 
            value={school} 
            onChangeText={text => {
              setSchool(text);
              setIsSchoolListVisible(true);
            }}
            onFocus={() => setIsSchoolListVisible(true)}
            autoCapitalize="words"
            editable={!apiLoading}
          />
          <TouchableOpacity 
            style={styles.dropdownToggle} 
            onPress={() => {
              setIsSchoolListVisible(prev => !prev);
              schoolInputRef.current?.focus();
            }}
            disabled={apiLoading}
          >
            <Ionicons name="chevron-down" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {isSchoolListVisible && filteredSchools.length > 0 && (
          <FlatList
            data={filteredSchools}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.schoolOption}
                onPress={() => handleSchoolSelect(item)}
              >
                <Text style={styles.schoolOptionText}>{item}</Text>
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

        <Text style={styles.label}>Personal Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@gmail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!apiLoading}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!apiLoading}
        />

        <TouchableOpacity
          style={[styles.primaryButton, !isFormValid || apiLoading ? styles.disabledButton : {}]}
          onPress={handleSignUp}
          disabled={!isFormValid || apiLoading}
        >
          {apiLoading ? (
            <ActivityIndicator color={COLORS.secondary} />
          ) : (
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        </ScrollView>
        </TouchableOpacity>
      </View>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(driver)/login')}>
          <Text style={styles.loginLink}>log in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    position: 'relative',
  },
  dropdownList: {
    backgroundColor: COLORS.secondary,
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
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: COLORS.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
  },
  selectedSchoolText: {
    fontSize: 16,
    color: COLORS.text,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textFaded,
  },
  schoolOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.secondary,
  },
  schoolOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  emptyListText: {
    padding: 10,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textFaded,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 10,
    marginTop: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textFaded,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default SignUpScreen;