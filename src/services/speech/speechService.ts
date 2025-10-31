// src/services/speech/speechService.ts

import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { VoiceConfig } from '../../types';

class SpeechService {
    private isListening: boolean = false;
    private isSpeaking: boolean = false;

    constructor() {
        this.initializeTts();
        this.initializeVoice();
    }

    private initializeTts() {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
        Tts.setDefaultPitch(1.0);

        Tts.addEventListener('tts-start', () => {
            this.isSpeaking = true;
        });

        Tts.addEventListener('tts-finish', () => {
            this.isSpeaking = false;
        });

        Tts.addEventListener('tts-cancel', () => {
            this.isSpeaking = false;
        });
    }

    private initializeVoice() {
        Voice.onSpeechStart = () => {
            this.isListening = true;
        };

        Voice.onSpeechEnd = () => {
            this.isListening = false;
        };
    }

    async speak(text: string, config?: VoiceConfig): Promise<void> {
        try {
            if (this.isSpeaking) {
                await this.stopSpeaking();
            }

            if (config) {
                await Tts.setDefaultLanguage(config.language);
                await Tts.setDefaultRate(config.rate);
                await Tts.setDefaultPitch(config.pitch);
            }

            await Tts.speak(text);
        } catch (error) {
            console.error('TTS Error:', error);
            throw new Error('Failed to speak text');
        }
    }

    async stopSpeaking(): Promise<void> {
        try {
            await Tts.stop();
            this.isSpeaking = false;
        } catch (error) {
            console.error('Stop TTS Error:', error);
        }
    }

    async startListening(language: string = 'en-US'): Promise<void> {
        try {
            if (this.isListening) {
                await this.stopListening();
            }

            await Voice.start(language);
        } catch (error) {
            console.error('Voice Recognition Error:', error);
            throw new Error('Failed to start voice recognition');
        }
    }

    async stopListening(): Promise<void> {
        try {
            await Voice.stop();
            this.isListening = false;
        } catch (error) {
            console.error('Stop Voice Error:', error);
        }
    }

    onSpeechResults(callback: (results: string[]) => void): void {
        Voice.onSpeechResults = (e) => {
            if (e.value) {
                callback(e.value);
            }
        };
    }

    onSpeechError(callback: (error: any) => void): void {
        Voice.onSpeechError = callback;
    }

    async getAvailableVoices(): Promise<any[]> {
        try {
            const voices = await Tts.voices();
            return voices;
        } catch (error) {
            console.error('Get Voices Error:', error);
            return [];
        }
    }

    isCurrentlySpeaking(): boolean {
        return this.isSpeaking;
    }

    isCurrentlyListening(): boolean {
        return this.isListening;
    }

    async destroy(): Promise<void> {
        try {
            await this.stopSpeaking();
            await this.stopListening();
            Voice.destroy();
        } catch (error) {
            console.error('Destroy Speech Service Error:', error);
        }
    }
}

export default new SpeechService();