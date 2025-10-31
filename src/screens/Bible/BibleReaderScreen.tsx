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
import bibleService from '../../services/api/bibleService';
import speechService from '../../services/speech/speechService';
import { BibleVerse, BibleVersion } from '../../types';

interface BibleReaderScreenProps {
    bookId: string;
    chapter: number;
    versionId: string;
    onChapterChange: (chapter: number) => void;
}

const BibleReaderScreen: React.FC<BibleReaderScreenProps> = ({
    bookId,
    chapter,
    versionId,
    onChapterChange
}) => {
    const [verses, setVerses] = useState<BibleVerse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        loadChapter();
    }, [bookId, chapter, versionId]);

    const loadChapter = async () => {
        try {
            setIsLoading(true);
            const chapterVerses = await bibleService.getChapter(
                versionId,
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
                language: 'en-US',
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
            onChapterChange(chapter - 1);
        }
    };

    const goToNextChapter = () => {
        onChapterChange(chapter + 1);
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
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
        backgroundColor: '#fff'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666'
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
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
        color: '#333'
    },
    verseContainer: {
        flexDirection: 'row',
        marginBottom: 16
    },
    verseNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6200ee',
        marginRight: 8,
        marginTop: 2,
        minWidth: 24
    },
    verseText: {
        flex: 1,
        lineHeight: 24,
        color: '#333'
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0'
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
        color: '#6200ee'
    }
});

export default BibleReaderScreen;