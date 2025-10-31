// src/utils/index.ts

import { Platform, Dimensions } from 'react-native';

// Date formatting utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
};

export const removeHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Array utilities
export const chunk = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const shuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const unique = <T,>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const groupBy = <T,>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

// Number utilities
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Device utilities
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const getDeviceType = (): 'phone' | 'tablet' => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  return aspectRatio > 1.6 ? 'phone' : 'tablet';
};

export const isTablet = (): boolean => {
  return getDeviceType() === 'tablet';
};

// Bible reference utilities
export const parseBibleReference = (
  reference: string
): { book: string; chapter: number; verse?: number } | null => {
  const match = reference.match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+)(?::(\d+))?$/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verse: match[3] ? parseInt(match[3]) : undefined
  };
};

export const formatBibleReference = (
  book: string,
  chapter: number,
  verse?: number
): string => {
  return verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
};

// Storage size utilities
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Delay utility
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Retry utility
export const retry = async <T,>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await delay(delayMs * attempt);
      }
    }
  }

  throw lastError!;
};

// Deep clone
export const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Merge objects deeply
export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = output[key as keyof T];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      output[key as keyof T] = deepMerge(
        targetValue as any,
        sourceValue as any
      );
    } else {
      output[key as keyof T] = sourceValue as any;
    }
  });

  return output;
};

// Generate UUID
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Safe JSON parse
export const safeJSONParse = <T,>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

// Pluralize
export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
};