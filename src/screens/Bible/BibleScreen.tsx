import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Text, Searchbar, Menu, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import bibleService from '../../services/api/bibleService';
import { BibleVersion, BibleBook, RootStackParamList, MainTabParamList } from '../../types';
import { COLORS } from '../../constants';

const BibleScreen: React.FC<BottomTabScreenProps<MainTabParamList, 'Bible'>> = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [versions, setVersions] = useState<BibleVersion[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<BibleVersion | null>(null);
    const [books, setBooks] = useState<BibleBook[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<BibleBook[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [versionMenuVisible, setVersionMenuVisible] = useState(false);
    const [testament, setTestament] = useState<'all' | 'old' | 'new'>('all');

    useEffect(() => {
        loadVersions();
    }, []);

    useEffect(() => {
        if (selectedVersion) {
            loadBooks();
        }
    }, [selectedVersion]);

    useEffect(() => {
        filterBooks();
    }, [searchQuery, books, testament]);

    const loadVersions = async () => {
        try {
            const bibleVersions = await bibleService.getBibleVersions();
            setVersions(bibleVersions);
            if (bibleVersions.length > 0) {
                setSelectedVersion(bibleVersions[0]);
            }
        } catch (error) {
            console.error('Load Versions Error:', error);
        }
    };

    const loadBooks = async () => {
        if (!selectedVersion) return;

        try {
            setIsLoading(true);
            const bibleBooks = await bibleService.getBooks(selectedVersion.id);
            setBooks(bibleBooks);
            setFilteredBooks(bibleBooks);
        } catch (error) {
            console.error('Load Books Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterBooks = () => {
        let filtered = books;

        if (testament !== 'all') {
            filtered = filtered.filter((book) => book.testament === testament);
        }

        if (searchQuery) {
            filtered = filtered.filter((book) =>
                book.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBooks(filtered);
    };

    const handleBookPress = (book: BibleBook) => {
        navigation.navigate('BibleReader', {
            bookId: book.id,
            chapter: 1,
            versionId: selectedVersion?.id
        });
    };

    const renderBook = ({ item }: { item: BibleBook }) => (
        <TouchableOpacity
            style={styles.bookCard}
            onPress={() => handleBookPress(item)}
        >
            <View style={styles.bookContent}>
                <Text style={styles.bookName}>{item.name}</Text>
                <Text style={styles.bookChapters}>{item.chapters} chapters</Text>
            </View>
            <Text style={styles.testament}>
                {item.testament === 'old' ? 'OT' : 'NT'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Version Selector */}
            <View style={styles.header}>
                <Menu
                    visible={versionMenuVisible}
                    onDismiss={() => setVersionMenuVisible(false)}
                    anchor={
                        <Button
                            mode="contained"
                            onPress={() => setVersionMenuVisible(true)}
                            icon="chevron-down"
                        >
                            {selectedVersion?.abbreviation || 'Select Version'}
                        </Button>
                    }
                >
                    {versions.map((version) => (
                        <Menu.Item
                            key={version.id}
                            onPress={() => {
                                setSelectedVersion(version);
                                setVersionMenuVisible(false);
                            }}
                            title={`${version.name} (${version.abbreviation})`}
                        />
                    ))}
                </Menu>
            </View>

            {/* Search Bar */}
            <Searchbar
                placeholder="Search books..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            {/* Testament Filter */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        testament === 'all' && styles.activeFilter
                    ]}
                    onPress={() => setTestament('all')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            testament === 'all' && styles.activeFilterText
                        ]}
                    >
                        All Books
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        testament === 'old' && styles.activeFilter
                    ]}
                    onPress={() => setTestament('old')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            testament === 'old' && styles.activeFilterText
                        ]}
                    >
                        Old Testament
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        testament === 'new' && styles.activeFilter
                    ]}
                    onPress={() => setTestament('new')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            testament === 'new' && styles.activeFilterText
                        ]}
                    >
                        New Testament
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Books List */}
            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading books...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredBooks}
                    renderItem={renderBook}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    header: {
        padding: 16,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    searchBar: {
        margin: 16,
        elevation: 2
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    activeFilter: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary
    },
    filterText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600'
    },
    activeFilterText: {
        color: '#fff'
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
    listContainer: {
        padding: 8
    },
    bookCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        margin: 8,
        elevation: 2
    },
    bookContent: {
        flex: 1
    },
    bookName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4
    },
    bookChapters: {
        fontSize: 12,
        color: COLORS.textSecondary
    },
    testament: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
        backgroundColor: COLORS.primaryLight + '33', // Add alpha for transparency
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12
    }
});

export default BibleScreen;
