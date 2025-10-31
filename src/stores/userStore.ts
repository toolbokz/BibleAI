// src/stores/userStore.ts

import { create } from 'zustand';
import { User } from '../types';
import authService from '../services/auth/authService';

interface UserStats {
    chaptersRead: number;
    daysStreak: number;
    aiChats: number;
    bookmarksCount: number;
    highlightsCount: number;
    notesCount: number;
}

interface UserState {
    user: User | null;
    stats: UserStats;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    loadUserData: (userId: string) => Promise<void>;
    updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
    signOut: () => Promise<void>;
    deleteAccount: (userId: string) => Promise<void>;
    updateStats: (stats: Partial<UserStats>) => void;
    clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    stats: {
        chaptersRead: 0,
        daysStreak: 0,
        aiChats: 0,
        bookmarksCount: 0,
        highlightsCount: 0,
        notesCount: 0
    },
    isAuthenticated: false,
    isLoading: false,
    error: null,

    setUser: (user: User | null) => {
        set({
            user,
            isAuthenticated: !!user
        });
    },

    loadUserData: async (userId: string) => {
        try {
            set({ isLoading: true, error: null });
            const userData = await authService.getUserData(userId);
            set({
                user: userData,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            console.error('Load User Data Error:', error);
            set({ error: 'Failed to load user data', isLoading: false });
        }
    },

    updateProfile: async (userId: string, updates: Partial<User>) => {
        try {
            set({ isLoading: true, error: null });
            await authService.updateProfile(userId, updates);

            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: { ...currentUser, ...updates },
                    isLoading: false
                });
            }
        } catch (error) {
            console.error('Update Profile Error:', error);
            set({ error: 'Failed to update profile', isLoading: false });
            throw error;
        }
    },

    signOut: async () => {
        try {
            set({ isLoading: true, error: null });
            await authService.signOut();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                stats: {
                    chaptersRead: 0,
                    daysStreak: 0,
                    aiChats: 0,
                    bookmarksCount: 0,
                    highlightsCount: 0,
                    notesCount: 0
                }
            });
        } catch (error) {
            console.error('Sign Out Error:', error);
            set({ error: 'Failed to sign out', isLoading: false });
            throw error;
        }
    },

    deleteAccount: async (userId: string) => {
        try {
            set({ isLoading: true, error: null });
            await authService.deleteAccount(userId);
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                stats: {
                    chaptersRead: 0,
                    daysStreak: 0,
                    aiChats: 0,
                    bookmarksCount: 0,
                    highlightsCount: 0,
                    notesCount: 0
                }
            });
        } catch (error) {
            console.error('Delete Account Error:', error);
            set({ error: 'Failed to delete account', isLoading: false });
            throw error;
        }
    },

    updateStats: (stats: Partial<UserStats>) => {
        set((state) => ({
            stats: { ...state.stats, ...stats }
        }));
    },

    clearError: () => set({ error: null })
}));