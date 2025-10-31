// src/screens/Home/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import authService from '../../services/auth/authService';
import bibleService from '../../services/api/bibleService';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const [verseOfDay, setVerseOfDay] = useState<any>(null);
    const [userName, setUserName] = useState('Guest');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            const user = authService.getCurrentUser();
            if (user) {
                const userData = await authService.getUserData(user.uid);
                setUserName(userData.name);
            }

            // Load verse of the day
            const verse = await bibleService.getVerse(
                'de4e12af7f28f599-02',
                'JHN',
                3,
                16
            );
            setVerseOfDay(verse);
        } catch (error) {
            console.error('Load Home Data Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        {
            title: 'AI Chat Assistant',
            description: 'Ask questions about the Bible',
            icon: 'robot',
            color: '#6200ee',
            onPress: () => navigation.navigate('Chat' as never)
        },
        {
            title: 'Read Bible',
            description: 'Access multiple translations',
            icon: 'book-open-variant',
            color: '#03dac6',
            onPress: () => navigation.navigate('Bible' as never)
        },
        {
            title: 'Voice Chat',
            description: 'Speak with the AI assistant',
            icon: 'microphone',
            color: '#ff6f00',
            onPress: () => navigation.navigate('Chat' as never)
        },
        {
            title: 'My Profile',
            description: 'View your reading progress',
            icon: 'account-circle',
            color: '#00897b',
            onPress: () => navigation.navigate('Profile' as never)
        }
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome, {userName}!</Text>
                <Text style={styles.subtitle}>Continue your spiritual journey</Text>
            </View>

            {/* Verse of the Day */}
            <Card style={styles.verseCard}>
                <Card.Content>
                    <Text style={styles.verseTitle}>Verse of the Day</Text>
                    {verseOfDay ? (
                        <>
                            <Text style={styles.verseText}>{verseOfDay.text}</Text>
                            <Text style={styles.verseReference}>
                                John 3:16
                            </Text>
                        </>
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </Card.Content>
            </Card>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.featureCard}
                            onPress={feature.onPress}
                        >
                            <View
                                style={[
                                    styles.featureIcon,
                                    { backgroundColor: feature.color }
                                ]}
                            >
                                <IconButton icon={feature.icon} iconColor="#fff" size={32} />
                            </View>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDesc}>{feature.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Continue Reading */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Continue Reading</Text>
                <Card style={styles.readingCard}>
                    <Card.Content>
                        <View style={styles.readingHeader}>
                            <View>
                                <Text style={styles.readingTitle}>Gospel of John</Text>
                                <Text style={styles.readingProgress}>Chapter 5 of 21</Text>
                            </View>
                            <Button mode="contained" onPress={() => navigation.navigate('Bible' as never)}>
                                Continue
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            {/* Popular Topics */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Explore Topics</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['Faith', 'Love', 'Hope', 'Forgiveness', 'Wisdom', 'Prayer'].map(
                        (topic, index) => (
                            <TouchableOpacity key={index} style={styles.topicChip}>
                                <Text style={styles.topicText}>{topic}</Text>
                            </TouchableOpacity>
                        )
                    )}
                </ScrollView>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Days Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>45</Text>
                    <Text style={styles.statLabel}>Chapters Read</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>AI Chats</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        padding: 20,
        backgroundColor: '#6200ee'
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9
    },
    verseCard: {
        margin: 16,
        backgroundColor: '#fff',
        elevation: 4
    },
    verseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ee',
        marginBottom: 12
    },
    verseText: {
        fontSize: 18,
        lineHeight: 28,
        color: '#333',
        marginBottom: 8,
        fontStyle: 'italic'
    },
    verseReference: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right'
    },
    section: {
        padding: 16
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    featureCard: {
        width: (width - 48) / 2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2
    },
    featureIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center'
    },
    featureDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    },
    readingCard: {
        backgroundColor: '#fff',
        elevation: 2
    },
    readingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    readingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    readingProgress: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },
    topicChip: {
        backgroundColor: '#6200ee',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 12
    },
    topicText: {
        color: '#fff',
        fontWeight: '600'
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        marginBottom: 20
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 4,
        elevation: 2
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6200ee'
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4
    }
});

export default HomeScreen;