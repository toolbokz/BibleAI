// src/stores/chatStore.ts

import { create } from 'zustand';
import { ChatMessage, ChatSession } from '../types';
import llamaService from '../services/api/llamaService';
import firestore from '@react-native-firebase/firestore';

interface ChatState {
    sessions: ChatSession[];
    currentSession: ChatSession | null;
    isLoading: boolean;
    error: string | null;

    createSession: (userId: string) => Promise<void>;
    loadSessions: (userId: string) => Promise<void>;
    setCurrentSession: (sessionId: string) => void;
    sendMessage: (content: string, language: string, isVoice?: boolean) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    sessions: [],
    currentSession: null,
    isLoading: false,
    error: null,

    createSession: async (userId: string) => {
        try {
            set({ isLoading: true, error: null });

            const newSession: ChatSession = {
                id: firestore().collection('chatSessions').doc().id,
                userId,
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await firestore()
                .collection('chatSessions')
                .doc(newSession.id)
                .set(newSession);

            set((state) => ({
                sessions: [newSession, ...state.sessions],
                currentSession: newSession,
                isLoading: false
            }));
        } catch (error) {
            console.error('Create Session Error:', error);
            set({ error: 'Failed to create chat session', isLoading: false });
        }
    },

    loadSessions: async (userId: string) => {
        try {
            set({ isLoading: true, error: null });

            const snapshot = await firestore()
                .collection('chatSessions')
                .where('userId', '==', userId)
                .orderBy('updatedAt', 'desc')
                .limit(50)
                .get();

            const sessions: ChatSession[] = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                messages: doc.data().messages.map((msg: any) => ({
                    ...msg,
                    timestamp: msg.timestamp?.toDate()
                }))
            })) as ChatSession[];

            set({ sessions, isLoading: false });
        } catch (error) {
            console.error('Load Sessions Error:', error);
            set({ error: 'Failed to load chat sessions', isLoading: false });
        }
    },

    setCurrentSession: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        set({ currentSession: session || null });
    },

    sendMessage: async (content: string, language: string, isVoice = false) => {
        const { currentSession } = get();
        if (!currentSession) return;

        try {
            set({ isLoading: true, error: null });

            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                role: 'user',
                content,
                timestamp: new Date(),
                language,
                isVoice
            };

            const updatedMessages = [...currentSession.messages, userMessage];

            set((state) => ({
                currentSession: state.currentSession
                    ? { ...state.currentSession, messages: updatedMessages }
                    : null
            }));

            const aiResponse = await llamaService.generateResponse(
                updatedMessages,
                language
            );

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
                language
            };

            const finalMessages = [...updatedMessages, assistantMessage];

            const updatedSession: ChatSession = {
                ...currentSession,
                messages: finalMessages,
                updatedAt: new Date()
            };

            await firestore()
                .collection('chatSessions')
                .doc(currentSession.id)
                .update({
                    messages: finalMessages,
                    updatedAt: new Date()
                });

            set((state) => ({
                currentSession: updatedSession,
                sessions: state.sessions.map((s) =>
                    s.id === updatedSession.id ? updatedSession : s
                ),
                isLoading: false
            }));
        } catch (error) {
            console.error('Send Message Error:', error);
            set({ error: 'Failed to send message', isLoading: false });
        }
    },

    deleteSession: async (sessionId: string) => {
        try {
            await firestore().collection('chatSessions').doc(sessionId).delete();

            set((state) => ({
                sessions: state.sessions.filter((s) => s.id !== sessionId),
                currentSession:
                    state.currentSession?.id === sessionId ? null : state.currentSession
            }));
        } catch (error) {
            console.error('Delete Session Error:', error);
            set({ error: 'Failed to delete session' });
        }
    },

    clearError: () => set({ error: null })
}));