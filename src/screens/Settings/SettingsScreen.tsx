// src/screens/Settings/SettingsScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
    Text,
    List,
    Switch,
    Divider,
    RadioButton,
    Dialog,
    Portal,
    Button
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../../types';

const SETTINGS_KEY = '@app_settings';

const SettingsScreen: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>({
        theme: 'auto',
        fontSize: 'medium',
        language: 'en',
        voiceEnabled: true,
        autoTranslate: false,
        notificationsEnabled: true
    });

    const [themeDialogVisible, setThemeDialogVisible] = useState(false);
    const [fontSizeDialogVisible, setFontSizeDialogVisible] = useState(false);
    const [languageDialogVisible, setLanguageDialogVisible] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                setSettings(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Load Settings Error:', error);
        }
    };

    const saveSettings = async (newSettings: AppSettings) => {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Save Settings Error:', error);
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    const updateSetting = <K extends keyof AppSettings>(
        key: K,
        value: AppSettings[K]
    ) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
    };

    const clearCache = async () => {
        Alert.alert(
            'Clear Cache',
            'This will clear all cached Bible content. You may need to download content again.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const keys = await AsyncStorage.getAllKeys();
                            const cacheKeys = keys.filter((key) =>
                                key.startsWith('@bible_cache_')
                            );
                            await AsyncStorage.multiRemove(cacheKeys);
                            Alert.alert('Success', 'Cache cleared successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear cache');
                        }
                    }
                }
            ]
        );
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ru', name: 'Russian' }
    ];

    const getCurrentLanguageName = () => {
        return (
            languages.find((lang) => lang.code === settings.language)?.name ||
            'English'
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Appearance */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appearance</Text>
                <List.Section>
                    <List.Item
                        title="Theme"
                        description={
                            settings.theme === 'auto'
                                ? 'System default'
                                : settings.theme === 'dark'
                                    ? 'Dark'
                                    : 'Light'
                        }
                        left={(props) => <List.Icon {...props} icon="palette" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => setThemeDialogVisible(true)}
                    />
                    <Divider />
                    <List.Item
                        title="Font Size"
                        description={
                            settings.fontSize.charAt(0).toUpperCase() +
                            settings.fontSize.slice(1)
                        }
                        left={(props) => <List.Icon {...props} icon="format-size" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => setFontSizeDialogVisible(true)}
                    />
                </List.Section>
            </View>

            {/* Language & Translation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Language & Translation</Text>
                <List.Section>
                    <List.Item
                        title="App Language"
                        description={getCurrentLanguageName()}
                        left={(props) => <List.Icon {...props} icon="translate" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => setLanguageDialogVisible(true)}
                    />
                    <Divider />
                    <List.Item
                        title="Auto-Translate AI Responses"
                        description="Translate responses to your language"
                        left={(props) => <List.Icon {...props} icon="google-translate" />}
                        right={() => (
                            <Switch
                                value={settings.autoTranslate}
                                onValueChange={(value) => updateSetting('autoTranslate', value)}
                            />
                        )}
                    />
                </List.Section>
            </View>

            {/* Voice & Audio */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Voice & Audio</Text>
                <List.Section>
                    <List.Item
                        title="Enable Voice Features"
                        description="Voice recognition and text-to-speech"
                        left={(props) => <List.Icon {...props} icon="microphone" />}
                        right={() => (
                            <Switch
                                value={settings.voiceEnabled}
                                onValueChange={(value) => updateSetting('voiceEnabled', value)}
                            />
                        )}
                    />
                </List.Section>
            </View>

            {/* Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <List.Section>
                    <List.Item
                        title="Enable Notifications"
                        description="Daily verse reminders and updates"
                        left={(props) => <List.Icon {...props} icon="bell" />}
                        right={() => (
                            <Switch
                                value={settings.notificationsEnabled}
                                onValueChange={(value) =>
                                    updateSetting('notificationsEnabled', value)
                                }
                            />
                        )}
                    />
                </List.Section>
            </View>

            {/* Storage */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Storage</Text>
                <List.Section>
                    <List.Item
                        title="Clear Cache"
                        description="Remove downloaded Bible content"
                        left={(props) => <List.Icon {...props} icon="delete" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={clearCache}
                    />
                </List.Section>
            </View>

            {/* About */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <List.Section>
                    <List.Item
                        title="Version"
                        description="1.0.0"
                        left={(props) => <List.Icon {...props} icon="information" />}
                    />
                    <Divider />
                    <List.Item
                        title="Privacy Policy"
                        left={(props) => <List.Icon {...props} icon="shield-check" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                    <Divider />
                    <List.Item
                        title="Terms of Service"
                        left={(props) => <List.Icon {...props} icon="file-document" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                    <Divider />
                    <List.Item
                        title="Contact Support"
                        left={(props) => <List.Icon {...props} icon="help-circle" />}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                </List.Section>
            </View>

            {/* Theme Dialog */}
            <Portal>
                <Dialog
                    visible={themeDialogVisible}
                    onDismiss={() => setThemeDialogVisible(false)}
                >
                    <Dialog.Title>Choose Theme</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                updateSetting('theme', value as 'light' | 'dark' | 'auto');
                                setThemeDialogVisible(false);
                            }}
                            value={settings.theme}
                        >
                            <RadioButton.Item label="Light" value="light" />
                            <RadioButton.Item label="Dark" value="dark" />
                            <RadioButton.Item label="System Default" value="auto" />
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>

            {/* Font Size Dialog */}
            <Portal>
                <Dialog
                    visible={fontSizeDialogVisible}
                    onDismiss={() => setFontSizeDialogVisible(false)}
                >
                    <Dialog.Title>Choose Font Size</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                updateSetting(
                                    'fontSize',
                                    value as 'small' | 'medium' | 'large' | 'xlarge'
                                );
                                setFontSizeDialogVisible(false);
                            }}
                            value={settings.fontSize}
                        >
                            <RadioButton.Item label="Small" value="small" />
                            <RadioButton.Item label="Medium" value="medium" />
                            <RadioButton.Item label="Large" value="large" />
                            <RadioButton.Item label="Extra Large" value="xlarge" />
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>

            {/* Language Dialog */}
            <Portal>
                <Dialog
                    visible={languageDialogVisible}
                    onDismiss={() => setLanguageDialogVisible(false)}
                >
                    <Dialog.Title>Choose Language</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView>
                            <RadioButton.Group
                                onValueChange={(value) => {
                                    updateSetting('language', value);
                                    setLanguageDialogVisible(false);
                                }}
                                value={settings.language}
                            >
                                {languages.map((lang) => (
                                    <RadioButton.Item
                                        key={lang.code}
                                        label={lang.name}
                                        value={lang.code}
                                    />
                                ))}
                            </RadioButton.Group>
                        </ScrollView>
                    </Dialog.ScrollArea>
                </Dialog>
            </Portal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    section: {
        marginTop: 16,
        backgroundColor: '#fff'
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        padding: 16,
        paddingBottom: 8,
        textTransform: 'uppercase'
    }
});

export default SettingsScreen;