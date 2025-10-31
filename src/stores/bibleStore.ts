// src/stores/bibleStore.ts

import { create } from 'zustand';
import { BibleVersion, BibleBook, BibleVerse } from '../types';
import bibleService from '../services/api/bibleService';

interface ReadingProgress {
    bookId: string;
    chapter: number;
    verse?: number;
    timestamp: Date;
}

interface Bookmark {
    id: string;
    bookId: string;
    chapter: number;
    verse: number;
    versionId: string;
    note?: string;
    createdAt: Date;
}

interface BibleState {
    versions: BibleVersion[];
    selectedVersion: BibleVersion | null;
    books: BibleBook[];
    currentBook: BibleBook | null;
    currentChapter: number;
    verses: BibleVerse[];
    readingProgress: ReadingProgress[];
    bookmarks: Bookmark[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadVersions: () => Promise<void>;
    setSelectedVersion: (version: BibleVersion) => void;
    loadBooks: (versionId: string) => Promise<void>;
    loadChapter: (versionId: string, bookId: string, chapter: number) => Promise<void>;
    setCurrentBook: (book: BibleBook) => void;
    setCurrentChapter: (chapter: number) => void;
    addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => Promise<void>;
    removeBookmark: (bookmarkId: string) => Promise<void>;
    updateReadingProgress: (progress: Omit<ReadingProgress, 'timestamp'>) => void;
    searchVerses: (versionId: string, query: string) => Promise<BibleVerse[]>;
    clearError: () => void;
}

export const useBibleStore = create<BibleState>((set, get) => ({
    versions: [],
    selectedVersion: null,
    books: [],
    currentBook: null,
    currentChapter: 1,
    verses: [],
    readingProgress: [],
    bookmarks: [],
    isLoading: false,
    error: null,

    loadVersions: async () => {
        try {
            set({ isLoading: true, error: null });
            const versions = await bibleService.getBibleVersions();
            set({
                versions,
                selectedVersion: versions.length > 0 ? versions[0] : null,
                isLoading: false
            });
        } catch (error) {
            console.error('Load Versions Error:', error);
            set({ error: 'Failed to load Bible versions', isLoading: false });
        }
    },

    setSelectedVersion: (version: BibleVersion) => {
        set({ selectedVersion: version });
    },

    loadBooks: async (versionId: string) => {
        try {
            set({ isLoading: true, error: null });
            const books = await bibleService.getBooks(versionId);
            set({ books, isLoading: false });
        } catch (error) {
            console.error('Load Books Error:', error);
            set({ error: 'Failed to load books', isLoading: false });
        }
    },

    loadChapter: async (versionId: string, bookId: string, chapter: number) => {
        try {
            set({ isLoading: true, error: null });
            const verses = await bibleService.getChapter(versionId, bookId, chapter);
            set({ verses, currentChapter: chapter, isLoading: false });

            // Update reading progress
            get().updateReadingProgress({ bookId, chapter });
        } catch (error) {
            console.error('Load Chapter Error:', error);
            set({ error: 'Failed to load chapter', isLoading: false });
        }
    },

    setCurrentBook: (book: BibleBook) => {
        set({ currentBook: book });
    },

    setCurrentChapter: (chapter: number) => {
        set({ currentChapter: chapter });
    },

    addBookmark: async (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
        const newBookmark: Bookmark = {
            ...bookmark,
            id: Date.now().toString(),
            createdAt: new Date()
        };

        set((state) => ({
            bookmarks: [...state.bookmarks, newBookmark]
        }));

        // TODO: Save to Firestore
    },

    removeBookmark: async (bookmarkId: string) => {
        set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId)
        }));

        // TODO: Remove from Firestore
    },

    updateReadingProgress: (progress: Omit<ReadingProgress, 'timestamp'>) => {
        const newProgress: ReadingProgress = {
            ...progress,
            timestamp: new Date()
        };

        set((state) => {
            const existingIndex = state.readingProgress.findIndex(
                (p) => p.bookId === progress.bookId
            );

            if (existingIndex >= 0) {
                const updated = [...state.readingProgress];
                updated[existingIndex] = newProgress;
                return { readingProgress: updated };
            }

            return {
                readingProgress: [...state.readingProgress, newProgress]
            };
        });

        // TODO: Save to AsyncStorage or Firestore
    },

    searchVerses: async (versionId: string, query: string) => {
        try {
            set({ isLoading: true, error: null });
            const verses = await bibleService.searchVerses(versionId, query);
            set({ isLoading: false });
            return verses;
        } catch (error) {
            console.error('Search Verses Error:', error);
            set({ error: 'Failed to search verses', isLoading: false });
            return [];
        }
    },

    clearError: () => set({ error: null })
}));