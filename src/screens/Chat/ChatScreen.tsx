// src/screens/Chat/ChatScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { useChatStore } from '../../stores/chatStore';
import speechService from '../../services/speech/speechService';
import { ChatMessage } from '../../types';

interface ChatScreenProps {
    userId: string;
    userLanguage: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ userId, userLanguage }) => {
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const {
        currentSession,
        isLoading,
        error,
        createSession,
        sendMessage,
        clearError
    } = useChatStore();

    useEffect(() => {
        if (!currentSession) {
            createSession(userId);
        }

        speechService.onSpeechResults((results) => {
            if (results && results.length > 0) {
                setInputText(results[0]);
                setIsRecording(false);
            }
        });

        speechService.onSpeechError((error) => {
            console.error('Speech Error:', error);
            setIsRecording(false);
        });

        return () => {
            speechService.destroy();
        };
    }, []);

    useEffect(() => {
        if (currentSession?.messages.length) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [currentSession?.messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const message = inputText.trim();
        setInputText('');

        await sendMessage(message, userLanguage, false);
    };

    const handleVoicePress = async () => {
        if (isRecording) {
            await speechService.stopListening();
            setIsRecording(false);
        } else {
            try {
                setIsRecording(true);
                await speechService.startListening(getVoiceLanguageCode(userLanguage));
            } catch (error) {
                console.error('Voice Error:', error);
                setIsRecording(false);
            }
        }
    };

    const handleSpeakMessage = async (text: string) => {
        try {
            await speechService.speak(text, {
                language: getVoiceLanguageCode(userLanguage),
                pitch: 1.0,
                rate: 0.5,
                volume: 1.0
            });
        } catch (error) {
            console.error('Speak Error:', error);
        }
    };

    const getVoiceLanguageCode = (lang: string): string => {
        const codes: { [key: string]: string } = {
            en: 'en-US',
            es: 'es-ES',
            fr: 'fr-FR',
            de: 'de-DE',
            it: 'it-IT',
            pt: 'pt-BR',
            zh: 'zh-CN',
            ja: 'ja-JP',
            ko: 'ko-KR',
            ar: 'ar-SA',
            hi: 'hi-IN',
            ru: 'ru-RU'
        };
        return codes[lang] || 'en-US';
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View
            style={[
                styles.messageContainer,
                item.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
        >
            <View style={styles.messageContent}>
                <Text style={styles.messageText}>{item.content}</Text>
                {item.role === 'assistant' && (
                    <IconButton
                        icon="volume-high"
                        size={20}
                        onPress={() => handleSpeakMessage(item.content)}
                    />
                )}
            </View>
            <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bible AI Assistant</Text>
                <Text style={styles.headerSubtitle}>
                    Ask me anything about the Bible
                </Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <IconButton icon="close" size={20} onPress={clearError} />
                </View>
            )}

            <FlatList
                ref={flatListRef}
                data={currentSession?.messages || []}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#6200ee" />
                    <Text style={styles.loadingText}>Thinking...</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask about the Bible..."
                    multiline
                    maxLength={500}
                    mode="outlined"
                />
                <TouchableOpacity
                    style={[styles.voiceButton, isRecording && styles.recordingButton]}
                    onPress={handleVoicePress}
                >
                    <IconButton
                        icon={isRecording ? 'stop' : 'microphone'}
                        iconColor="#fff"
                        size={24}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
                    onPress={handleSend}
                    disabled={!inputText.trim() || isLoading}
                >
                    <IconButton icon="send" iconColor="#fff" size={24} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        padding: 16,
        backgroundColor: '#6200ee',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffebee',
        padding: 8,
        margin: 8,
        borderRadius: 4
    },
    errorText: {
        flex: 1,
        color: '#c62828'
    },
    messageList: {
        padding: 16,
        flexGrow: 1
    },
    messageContainer: {
        marginBottom: 16,
        maxWidth: '80%',
        borderRadius: 12,
        padding: 12
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#6200ee'
    },
    assistantMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        elevation: 2
    },
    messageContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    messageText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 4
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    },
    loadingText: {
        marginLeft: 8,
        color: '#666'
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'flex-end'
    },
    input: {
        flex: 1,
        maxHeight: 100,
        marginRight: 8
    },
    voiceButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    recordingButton: {
        backgroundColor: '#c62828'
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: '#ccc'
    }
});

export default ChatScreen;