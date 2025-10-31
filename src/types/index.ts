// src/types/index.ts

export interface User {
    id: string;
    email: string;
    name: string;
    language: string;
    preferredBibleVersion: string;
    isPremium: boolean;
    createdAt: Date;
}

export interface BibleVersion {
    id: string;
    name: string;
    abbreviation: string;
    language: string;
    languageCode: string;
}

export interface BibleBook {
    id: string;
    name: string;
    testament: 'old' | 'new';
    chapters: number;
}

export interface BibleVerse {
    id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
    version: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    language?: string;
    isVoice?: boolean;
}

export interface ChatSession {
    id: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface VoiceConfig {
    language: string;
    pitch: number;
    rate: number;
    volume: number;
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large' | 'xlarge';
    language: string;
    voiceEnabled: boolean;
    autoTranslate: boolean;
    notificationsEnabled: boolean;
}

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    BibleReader: { book: string; chapter: number };
    ChatDetail: { sessionId?: string };
    Settings: undefined;
    Profile: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Bible: undefined;
    Chat: undefined;
    Profile: undefined;
};