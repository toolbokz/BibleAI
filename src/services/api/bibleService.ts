// src/services/api/bibleService.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BibleVersion, BibleBook, BibleVerse } from '../../types';
import { BIBLE_API_KEY } from '@env';

class BibleService {
    private apiKey: string;
    private baseUrl: string = 'https://api.scripture.api.bible/v1';
    private cachePrefix: string = '@bible_cache_';

    constructor() {
        this.apiKey = BIBLE_API_KEY;
    }

    async getBibleVersions(): Promise<BibleVersion[]> {
        try {
            const cached = await this.getFromCache('versions');
            if (cached) return cached;

            const response = await axios.get(`${this.baseUrl}/bibles`, {
                headers: { 'api-key': this.apiKey }
            });

            const versions: BibleVersion[] = response.data.data.map((bible: any) => ({
                id: bible.id,
                name: bible.name,
                abbreviation: bible.abbreviation,
                language: bible.language.name,
                languageCode: bible.language.id
            }));

            await this.saveToCache('versions', versions);
            return versions;
        } catch (error) {
            console.error('Get Bible Versions Error:', error);
            return this.getDefaultVersions();
        }
    }

    async getBooks(versionId: string): Promise<BibleBook[]> {
        try {
            const cacheKey = `books_${versionId}`;
            const cached = await this.getFromCache(cacheKey);
            if (cached) return cached;

            const response = await axios.get(
                `${this.baseUrl}/bibles/${versionId}/books`,
                { headers: { 'api-key': this.apiKey } }
            );

            const books: BibleBook[] = response.data.data.map((book: any) => ({
                id: book.id,
                name: book.name,
                testament: book.id.startsWith('GEN') || parseInt(book.id) < 40 ? 'old' : 'new',
                chapters: book.chapters?.length || 0
            }));

            await this.saveToCache(cacheKey, books);
            return books;
        } catch (error) {
            console.error('Get Books Error:', error);
            return [];
        }
    }

    async getChapter(
        versionId: string,
        bookId: string,
        chapterNumber: number
    ): Promise<BibleVerse[]> {
        try {
            const cacheKey = `chapter_${versionId}_${bookId}_${chapterNumber}`;
            const cached = await this.getFromCache(cacheKey);
            if (cached) return cached;

            const chapterId = `${bookId}.${chapterNumber}`;
            const response = await axios.get(
                `${this.baseUrl}/bibles/${versionId}/chapters/${chapterId}`,
                {
                    headers: { 'api-key': this.apiKey },
                    params: { 'include-verse-spans': false }
                }
            );

            const content = response.data.data.content;
            const verses = this.parseVerses(content, bookId, chapterNumber, versionId);

            await this.saveToCache(cacheKey, verses);
            return verses;
        } catch (error) {
            console.error('Get Chapter Error:', error);
            return [];
        }
    }

    async getVerse(
        versionId: string,
        bookId: string,
        chapterNumber: number,
        verseNumber: number
    ): Promise<BibleVerse | null> {
        try {
            const verseId = `${bookId}.${chapterNumber}.${verseNumber}`;
            const response = await axios.get(
                `${this.baseUrl}/bibles/${versionId}/verses/${verseId}`,
                { headers: { 'api-key': this.apiKey } }
            );

            const verse = response.data.data;
            return {
                id: verse.id,
                book: bookId,
                chapter: chapterNumber,
                verse: verseNumber,
                text: this.cleanText(verse.content),
                version: versionId
            };
        } catch (error) {
            console.error('Get Verse Error:', error);
            return null;
        }
    }

    async searchVerses(
        versionId: string,
        query: string,
        limit: number = 20
    ): Promise<BibleVerse[]> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/bibles/${versionId}/search`,
                {
                    headers: { 'api-key': this.apiKey },
                    params: { query, limit }
                }
            );

            return response.data.data.verses.map((verse: any) => ({
                id: verse.id,
                book: verse.bookId,
                chapter: verse.chapterId,
                verse: verse.verseId,
                text: this.cleanText(verse.text),
                version: versionId
            }));
        } catch (error) {
            console.error('Search Verses Error:', error);
            return [];
        }
    }

    private parseVerses(
        content: string,
        bookId: string,
        chapter: number,
        version: string
    ): BibleVerse[] {
        const verses: BibleVerse[] = [];
        const verseRegex = /<span class="v">(\d+)<\/span>(.*?)(?=<span class="v">|$)/gs;
        let match;

        while ((match = verseRegex.exec(content)) !== null) {
            verses.push({
                id: `${bookId}.${chapter}.${match[1]}`,
                book: bookId,
                chapter,
                verse: parseInt(match[1]),
                text: this.cleanText(match[2]),
                version
            });
        }

        return verses;
    }

    private cleanText(html: string): string {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
    }

    private async saveToCache(key: string, data: any): Promise<void> {
        try {
            await AsyncStorage.setItem(
                `${this.cachePrefix}${key}`,
                JSON.stringify(data)
            );
        } catch (error) {
            console.error('Cache Save Error:', error);
        }
    }

    private async getFromCache(key: string): Promise<any> {
        try {
            const cached = await AsyncStorage.getItem(`${this.cachePrefix}${key}`);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('Cache Get Error:', error);
            return null;
        }
    }

    private getDefaultVersions(): BibleVersion[] {
        return [
            {
                id: 'de4e12af7f28f599-02',
                name: 'King James Version',
                abbreviation: 'KJV',
                language: 'English',
                languageCode: 'eng'
            },
            {
                id: '592420522e16049f-01',
                name: 'Reina Valera 1909',
                abbreviation: 'RVR09',
                language: 'Spanish',
                languageCode: 'spa'
            }
        ];
    }
}

export default new BibleService();