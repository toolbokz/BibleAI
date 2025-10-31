// src/services/storage/storageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
    private prefix: string = '@bible_ai_';

    async setItem(key: string, value: string): Promise<void> {
        try {
            await AsyncStorage.setItem(`${this.prefix}${key}`, value);
        } catch (error) {
            console.error('Storage Set Error:', error);
            throw new Error('Failed to save data');
        }
    }

    async getItem(key: string): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(`${this.prefix}${key}`);
        } catch (error) {
            console.error('Storage Get Error:', error);
            return null;
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(`${this.prefix}${key}`);
        } catch (error) {
            console.error('Storage Remove Error:', error);
            throw new Error('Failed to remove data');
        }
    }

    async setObject<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await this.setItem(key, jsonValue);
        } catch (error) {
            console.error('Storage Set Object Error:', error);
            throw new Error('Failed to save object');
        }
    }

    async getObject<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await this.getItem(key);
            return jsonValue ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Storage Get Object Error:', error);
            return null;
        }
    }

    async getAllKeys(): Promise<string[]> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            return keys.filter((key) => key.startsWith(this.prefix));
        } catch (error) {
            console.error('Storage Get Keys Error:', error);
            return [];
        }
    }

    async clear(): Promise<void> {
        try {
            const keys = await this.getAllKeys();
            await AsyncStorage.multiRemove(keys);
        } catch (error) {
            console.error('Storage Clear Error:', error);
            throw new Error('Failed to clear storage');
        }
    }

    async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
        try {
            const prefixedPairs = keyValuePairs.map(
                ([key, value]) => [`${this.prefix}${key}`, value] as [string, string]
            );
            await AsyncStorage.multiSet(prefixedPairs);
        } catch (error) {
            console.error('Storage Multi Set Error:', error);
            throw new Error('Failed to save multiple items');
        }
    }

    async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
        try {
            const prefixedKeys = keys.map((key) => `${this.prefix}${key}`);
            const results = await AsyncStorage.multiGet(prefixedKeys);
            return results.map(([key, value]) => [
                key.replace(this.prefix, ''),
                value
            ]);
        } catch (error) {
            console.error('Storage Multi Get Error:', error);
            return [];
        }
    }

    async multiRemove(keys: string[]): Promise<void> {
        try {
            const prefixedKeys = keys.map((key) => `${this.prefix}${key}`);
            await AsyncStorage.multiRemove(prefixedKeys);
        } catch (error) {
            console.error('Storage Multi Remove Error:', error);
            throw new Error('Failed to remove multiple items');
        }
    }

    // Cache-specific methods
    async setCache(key: string, value: any, expiryMinutes?: number): Promise<void> {
        const cacheData = {
            value,
            timestamp: Date.now(),
            expiry: expiryMinutes ? Date.now() + expiryMinutes * 60000 : null
        };
        await this.setObject(`cache_${key}`, cacheData);
    }

    async getCache<T>(key: string): Promise<T | null> {
        const cacheData = await this.getObject<{
            value: T;
            timestamp: number;
            expiry: number | null;
        }>(`cache_${key}`);

        if (!cacheData) return null;

        if (cacheData.expiry && Date.now() > cacheData.expiry) {
            await this.removeItem(`cache_${key}`);
            return null;
        }

        return cacheData.value;
    }

    async clearCache(): Promise<void> {
        try {
            const keys = await this.getAllKeys();
            const cacheKeys = keys.filter((key) => key.includes('cache_'));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Clear Cache Error:', error);
            throw new Error('Failed to clear cache');
        }
    }
}

export default new StorageService();