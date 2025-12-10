// app/(student)/account.tsx (Main Profile/Account Screen)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON_STYLES } from '../constants/Styles';
import Header from '../../components/Header';

// --- MOCK DATA ---
const MOCK_USER = {
    name: 'John Doe',
    username: 'johndoe12',
    email: 'john.doe@st.knust.edu.gh',
    school: 'KNUST',
    profilePic: 'https://via.placeholder.com/150/0000FF/808080?text=JD', // Mock profile pic
};

// --- Sub-Component: Settings Item ---
interface SettingsItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    isDestructive?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, onPress, isDestructive = false }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
        <Ionicons name={icon} size={24} color={isDestructive ? '#FF6347' : COLORS.primary} style={{ width: 30 }} />
        <Text style={[styles.settingsTitle, isDestructive && { color: '#FF6347' }]}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
    </TouchableOpacity>
);

// --- Main Screen Component ---
const AccountScreen = () => {
    const router = useRouter();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        setIsLoggedOut(true);
        setTimeout(() => {
            router.replace('/role-select');
        }, 1500);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <View style={COMMON_STYLES.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Header title="My Account" showBack={true} showMenu={false} />
                
                {/* Profile Summary Card */}
                <View style={styles.profileCard}>
                    <Image source={{ uri: MOCK_USER.profilePic }} style={styles.profileImage} />
                    <Text style={styles.profileName}>{MOCK_USER.name}</Text>
                    <Text style={styles.profileDetail}>@{MOCK_USER.username}</Text>
                    <Text style={styles.profileDetail}>{MOCK_USER.email}</Text>
                    <Text style={styles.profileSchool}>{MOCK_USER.school}</Text>
                </View>

                {/* Account Settings Section */}
                <Text style={styles.sectionHeader}>Account</Text>
                <View style={styles.settingsGroup}>
                    <SettingsItem 
                        icon="person-circle-outline" 
                        title="Personal Information" 
                        onPress={() => router.push('/(student)/account/personal-info')} 
                    />
                    <SettingsItem 
                        icon="lock-closed-outline" 
                        title="Privacy" 
                        onPress={() => router.push('/(student)/account/privacy')} 
                    />
                    <SettingsItem 
                        icon="notifications-outline" 
                        title="Notifications" 
                        onPress={() => router.push('/(student)/account/notifications')} 
                    />
                </View>

                {/* Support & Logout Section */}
                <Text style={styles.sectionHeader}>Other</Text>
                <View style={styles.settingsGroup}>
                    <SettingsItem 
                        icon="help-circle-outline" 
                        title="Help & Support" 
                        onPress={() => Alert.alert("Support", "Contact support@shuttlesmart.com")} 
                    />
                    <SettingsItem 
                        icon="log-out-outline" 
                        title="Log Out" 
                        onPress={handleLogout} 
                        isDestructive 
                    />
                </View>

                {/* Logged Out Message (for visual feedback before navigation) */}
                {isLoggedOut && (
                    <View style={styles.loggedOutMessage}>
                        <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.text} style={{ marginRight: 8 }} />
                        <Text style={{ color: COLORS.text }}>Logged out successfully</Text>
                    </View>
                )}
                
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLogoutModal}
                onRequestClose={cancelLogout}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={cancelLogout}
                >
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Log Out?</Text>
                        <Text style={styles.modalBody}>
                            Are you sure you want to log out of your account?
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalButton, styles.noButton]} onPress={cancelLogout}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.yesButton]} onPress={confirmLogout}>
                                <Text style={styles.modalButtonText}>Yes</Text>
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
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(student)/activity')}>
                    <Ionicons name="time-outline" size={24} color={COLORS.text} />
                    <Text style={styles.navText}>Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person" size={24} color={COLORS.primary} />
                    <Text style={[styles.navText, { color: COLORS.primary }]}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 100,
    },
    // --- Profile Card ---
    profileCard: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    profileDetail: {
        fontSize: 16,
        color: COLORS.text,
        marginTop: 2,
    },
    profileSchool: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
    },
    // --- Settings Group ---
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 20,
        marginBottom: 10,
    },
    settingsGroup: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingsTitle: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 15,
    },
    loggedOutMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FFEBEE',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EF5350',
    },
    // --- Modal Styles ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        width: '85%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
        textAlign: 'center',
    },
    modalBody: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 25,
        textAlign: 'center',
        lineHeight: 22,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    noButton: {
        backgroundColor: COLORS.border,
    },
    yesButton: {
        backgroundColor: '#EF5350',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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

export default AccountScreen;
