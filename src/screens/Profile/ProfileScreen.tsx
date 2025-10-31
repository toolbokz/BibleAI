// src/screens/Profile/ProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import {
    Text,
    Avatar,
    List,
    Divider,
    Button,
    Dialog,
    Portal,
    TextInput
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import authService from '../../services/auth/authService';
import { User, RootStackParamList, MainTabParamList } from '../../types';
import { COLORS } from '../../constants';

const ProfileScreen: React.FC<BottomTabScreenProps<MainTabParamList, 'Profile'>> = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const userData = await authService.getUserData(currentUser.uid);
                setUser(userData);
                setEditName(userData.name);
            }
        } catch (error) {
            console.error('Load Profile Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!user || !editName.trim()) return;

        try {
            await authService.updateProfile(user.id, { name: editName });
            setUser({ ...user, name: editName });
            setEditDialogVisible(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await authService.signOut();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to sign out');
                    }
                }
            }
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure? This action cannot be undone. All your data will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (!user) return;
                        try {
                            await authService.deleteAccount(user.id);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete account');
                        }
                    }
                }
            ]
        );
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <Avatar.Text
                    size={80}
                    label={user ? getInitials(user.name) : 'U'}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email || ''}</Text>
                {user?.isPremium && (
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>Premium Member</Text>
                    </View>
                )}
                <Button
                    mode="outlined"
                    onPress={() => setEditDialogVisible(true)}
                    style={styles.editButton}
                >
                    Edit Profile
                </Button>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>45</Text>
                    <Text style={styles.statLabel}>Chapters Read</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Days Streak</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>AI Chats</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.section}>
                <List.Section>
                    <List.Item
                        title="Reading History"
                        description="View your reading progress"
                        left={(props) => <List.Icon {...props} icon="history" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('ReadingHistory')}
                    />
                    <Divider />
                    <List.Item
                        title="Bookmarks"
                        description="Your saved verses"
                        left={(props) => <List.Icon {...props} icon="bookmark" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('Bookmarks')}
                    />
                    <Divider />
                    <List.Item
                        title="Highlights"
                        description="Highlighted passages"
                        left={(props) => <List.Icon {...props} icon="marker" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('Highlights')}
                    />
                    <Divider />
                    <List.Item
                        title="Notes"
                        description="Your study notes"
                        left={(props) => <List.Icon {...props} icon="notebook" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { /* Implement navigation to Notes screen */ }}
                    />
                </List.Section>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <List.Section>
                    <List.Item
                        title="Settings"
                        description="App preferences"
                        left={(props) => <List.Icon {...props} icon="cog" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('Settings')}
                    />
                    <Divider />
                    <List.Item
                        title="Language"
                        description={user?.language || 'English'}
                        left={(props) => <List.Icon {...props} icon="translate" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => {}}
                    />
                    <Divider />
                    <List.Item
                        title="Bible Version"
                        description={user?.preferredBibleVersion || 'KJV'}
                        left={(props) => <List.Icon {...props} icon="book-open-variant" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => {}}
                    />
                </List.Section>
            </View>

            {/* Account Actions */}
            <View style={styles.section}>
                <Button
                    mode="contained"
                    onPress={handleSignOut}
                    style={styles.signOutButton}
                >
                    Sign Out
                </Button>
                <Button
                    mode="text"
                    onPress={handleDeleteAccount}
                    textColor={COLORS.error}
                    style={styles.deleteButton}
                >
                    Delete Account
                </Button>
            </View>

            {/* Edit Profile Dialog */}
            <Portal>
                <Dialog
                    visible={editDialogVisible}
                    onDismiss={() => setEditDialogVisible(false)}
                >
                    <Dialog.Title>Edit Profile</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Name"
                            value={editName}
                            onChangeText={setEditName}
                            mode="outlined"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleUpdateName}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 24,
        alignItems: 'center'
    },
    avatar: {
        backgroundColor: '#fff',
        marginBottom: 16
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4
    },
    email: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 12
    },
    premiumBadge: {
        backgroundColor: '#ffd700',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16
    },
    premiumText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333'
    },
    editButton: {
        marginTop: 8,
        borderColor: '#fff'
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: 16,
        justifyContent: 'space-around'
    },
    statItem: {
        alignItems: 'center',
        flex: 1
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.border
    },
    section: {
        marginTop: 16,
        backgroundColor: COLORS.surface
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        padding: 16,
        paddingBottom: 8
    },
    signOutButton: {
        margin: 16
    },
    deleteButton: {
        marginBottom: 24
    }
});

export default ProfileScreen;
