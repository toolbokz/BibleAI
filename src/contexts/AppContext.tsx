// src/contexts/AppContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AppSettings } from '../types';
import authService from '../services/auth/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
    user: User | null;
    settings: AppSettings;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
    signOut: () => Promise<void>;
}

const defaultSettings: AppSettings = {
    theme: 'auto',
    fontSize: 'medium',
    language: 'en',
    voiceEnabled: true,
    autoTranslate: false,
    notificationsEnabled: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            // Load settings
            const storedSettings = await AsyncStorage.getItem('@app_settings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }

            // Check authentication
            const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
                if (firebaseUser) {
                    try {
                        const userData = await authService.getUserData(firebaseUser.uid);
                        setUser(userData);
                        setIsAuthenticated(true);
                    } catch (error) {
                        console.error('Load User Data Error:', error);
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
                setIsLoading(false);
            });

            return unsubscribe;
        } catch (error) {
            console.error('Initialize App Error:', error);
            setIsLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);
            await AsyncStorage.setItem('@app_settings', JSON.stringify(updatedSettings));
        } catch (error) {
            console.error('Update Settings Error:', error);
            throw new Error('Failed to update settings');
        }
    };

    const signOut = async () => {
        try {
            await authService.signOut();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Sign Out Error:', error);
            throw new Error('Failed to sign out');
        }
    };

    const value: AppContextType = {
        user,
        settings,
        isAuthenticated,
        isLoading,
        setUser,
        updateSettings,
        signOut
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export default AppContext;