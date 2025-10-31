// src/services/translation/translationService.ts

import axios from 'axios';
import { GOOGLE_CLOUD_API_KEY } from '@env';

class TranslationService {
    private apiKey: string;
    private baseUrl: string = 'https://translation.googleapis.com/language/translate/v2';

    constructor() {
        this.apiKey = GOOGLE_CLOUD_API_KEY;
    }

    async translate(
        text: string,
        targetLanguage: string,
        sourceLanguage?: string
    ): Promise<string> {
        try {
            const params: any = {
                q: text,
                target: targetLanguage,
                key: this.apiKey,
                format: 'text'
            };

            if (sourceLanguage) {
                params.source = sourceLanguage;
            }

            const response = await axios.post(this.baseUrl, null, { params });

            return response.data.data.translations[0].translatedText;
        } catch (error) {
            console.error('Translation Error:', error);
            throw new Error('Failed to translate text');
        }
    }

    async detectLanguage(text: string): Promise<string> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/detect`,
                null,
                {
                    params: {
                        q: text,
                        key: this.apiKey
                    }
                }
            );

            return response.data.data.detections[0][0].language;
        } catch (error) {
            console.error('Language Detection Error:', error);
            return 'en';
        }
    }

    async getSupportedLanguages(): Promise<Array<{ language: string; name: string }>> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/languages`,
                {
                    params: {
                        key: this.apiKey,
                        target: 'en'
                    }
                }
            );

            return response.data.data.languages;
        } catch (error) {
            console.error('Get Languages Error:', error);
            return this.getDefaultLanguages();
        }
    }

    private getDefaultLanguages(): Array<{ language: string; name: string }> {
        return [
            { language: 'en', name: 'English' },
            { language: 'es', name: 'Spanish' },
            { language: 'fr', name: 'French' },
            { language: 'de', name: 'German' },
            { language: 'it', name: 'Italian' },
            { language: 'pt', name: 'Portuguese' },
            { language: 'zh', name: 'Chinese' },
            { language: 'ja', name: 'Japanese' },
            { language: 'ko', name: 'Korean' },
            { language: 'ar', name: 'Arabic' },
            { language: 'hi', name: 'Hindi' },
            { language: 'ru', name: 'Russian' }
        ];
    }

    getLanguageCode(languageName: string): string {
        const languages: { [key: string]: string } = {
            'English': 'en',
            'Spanish': 'es',
            'French': 'fr',
            'German': 'de',
            'Italian': 'it',
            'Portuguese': 'pt',
            'Chinese': 'zh',
            'Japanese': 'ja',
            'Korean': 'ko',
            'Arabic': 'ar',
            'Hindi': 'hi',
            'Russian': 'ru'
        };
        return languages[languageName] || 'en';
    }
}

export default new TranslationService();