// src/screens/Bible/BibleReaderScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Text, IconButton, Menu, Divider } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import bibleService from '../../services/api/bibleService';
import speechService from '../../services/speech/speechService';
import { BibleVerse } from '../../types';
import { COLORS } from '../../constants';
import { useUserStore } from '../../stores/userStore';

type Props = StackScreenProps<RootStackParamList, 'BibleReader'>;

const BibleReaderScreen: React.FC<Props> = ({ route, navigation }) => {
    const { bookId, chapter, versionId } = route.params;
    const [verses, setVerses] = useState<BibleVerse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const { user } = useUserStore();

    useEffect(() => {
        loadChapter();
        navigation.setOptions({ title: `${bookId} ${chapter}` });
    }, [bookId, chapter, versionId]);

    const loadChapter = async () => {
        try {
            setIsLoading(true);
            const resolvedVersionId = versionId || user?.preferredBibleVersion || 'de4e12af7f28f599-02';
            const chapterVerses = await bibleService.getChapter(
                resolvedVersionId,
                bookId,
                chapter
            );
            setVerses(chapterVerses);
        } catch (error) {
            console.error('Load Chapter Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReadAloud = async () => {
        if (isReading) {
            await speechService.stopSpeaking();
            setIsReading(false);
            return;
        }

        setIsReading(true);
        const text = verses.map((v) => `Verse ${v.verse}. ${v.text}`).join('. ');

        try {
            await speechService.speak(text, {
                language: user?.language || 'en-US',
                pitch: 1.0,
                rate: 0.5,
                volume: 1.0
            });
        } catch (error) {
            console.error('Read Aloud Error:', error);
        } finally {
            setIsReading(false);
        }
    };

    const increaseFontSize = () => {
        if (fontSize < 24) {
            setFontSize(fontSize + 2);
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > 12) {
            setFontSize(fontSize - 2);
        }
    };

    const goToPreviousChapter = () => {
        if (chapter > 1) {
            navigation.replace('BibleReader', {
                ...route.params,
                chapter: chapter - 1
            });
        }
    };

    const goToNextChapter = () => {
        navigation.replace('BibleReader', {
            ...route.params,
            chapter: chapter + 1
        });
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading chapter...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                <View style={styles.toolbarLeft}>
                    <IconButton icon="minus" size={20} onPress={decreaseFontSize} />
                    <Text style={styles.fontSizeText}>{fontSize}</Text>
                    <IconButton icon="plus" size={20} onPress={increaseFontSize} />
                </View>

                <View style={styles.toolbarRight}>
                    <IconButton
                        icon={isReading ? 'stop' : 'volume-high'}
                        size={24}
                        onPress={handleReadAloud}
                    />
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                size={24}
                                onPress={() => setMenuVisible(true)}
                            />
                        }
                    >
                        <Menu.Item onPress={() => { }} title="Bookmark" />
                        <Menu.Item onPress={() => { }} title="Highlight" />
                        <Menu.Item onPress={() => { }} title="Share" />
                        <Divider />
                        <Menu.Item onPress={() => { }} title="Notes" />
                    </Menu>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.chapterTitle}>
                    {bookId.replace(/[0-9]/g, '')} Chapter {chapter}
                </Text>

                {verses.map((verse) => (
                    <View key={verse.id} style={styles.verseContainer}>
                        <Text style={styles.verseNumber}>{verse.verse}</Text>
                        <Text style={[styles.verseText, { fontSize }]}>{verse.text}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.navigation}>
                <TouchableOpacity
                    style={[styles.navButton, chapter === 1 && styles.disabledNav]}
                    onPress={goToPreviousChapter}
                    disabled={chapter === 1}
                >
                    <IconButton icon="chevron-left" size={24} />
                    <Text>Previous</Text>
                </TouchableOpacity>

                <Text style={styles.chapterIndicator}>Chapter {chapter}</Text>

                <TouchableOpacity style={styles.navButton} onPress={goToNextChapter}>
                    <Text>Next</Text>
                    <IconButton icon="chevron-right" size={24} />
                </TouchableOpacity>
            </View>
        </View>
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
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textSecondary
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    toolbarLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    toolbarRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    fontSizeText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 8
    },
    content: {
        flex: 1
    },
    contentContainer: {
        padding: 16
    },
    chapterTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: COLORS.text
    },
    verseContainer: {
        flexDirection: 'row',
        marginBottom: 16
    },
    verseNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: 8,
        marginTop: 2,
        minWidth: 24
    },
    verseText: {
        flex: 1,
        lineHeight: 24,
        color: COLORS.text
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8
    },
    disabledNav: {
        opacity: 0.3
    },
    chapterIndicator: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary
    }
});

export default BibleReaderScreen;