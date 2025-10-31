// src/constants/index.ts

// App Configuration
export const APP_NAME = 'Bible AI';
export const APP_VERSION = '1.0.0';
export const APP_BUILD = '1';

// API Endpoints
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  RECENT_SEARCHES: 'recent_searches',
  BOOKMARKS: 'bookmarks',
  HIGHLIGHTS: 'highlights',
  NOTES: 'notes',
  READING_PROGRESS: 'reading_progress',
  LAST_READ: 'last_read',
  CHAT_HISTORY: 'chat_history'
};

// Cache Configuration
export const CACHE_EXPIRY = {
  BIBLE_VERSIONS: 7 * 24 * 60 * 60 * 1000, // 7 days
  BIBLE_BOOKS: 7 * 24 * 60 * 60 * 1000, // 7 days
  BIBLE_CHAPTERS: 30 * 24 * 60 * 60 * 1000, // 30 days
  USER_DATA: 24 * 60 * 60 * 1000 // 1 day
};

// Theme Colors
export const COLORS = {
  primary: '#0A2540',
  primaryDark: '#071C2F',
  primaryLight: '#3E5E7E',
  secondary: '#00A3A3',
  secondaryDark: '#007A7A',
  secondaryLight: '#66D9D9',
  background: '#F6F9FC',
  backgroundDark: '#121212',
  surface: '#FFFFFF',
  surfaceDark: '#1e1e1e',
  error: '#b00020',
  errorDark: '#cf6679',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  text: '#32325D',
  textDark: '#ffffff',
  textSecondary: '#6B7C93',
  textSecondaryDark: '#b3b3b3',
  border: '#E6E6E6',
  borderDark: '#3d3d3d',
  disabled: '#cccccc',
  placeholder: '#9e9e9e'
};

// Font Sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  heading1: 32,
  heading2: 28,
  heading3: 24,
  heading4: 20,
  heading5: 18,
  heading6: 16
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999
};

// Bible Books
export const OLD_TESTAMENT_BOOKS = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Solomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi'
];

export const NEW_TESTAMENT_BOOKS = [
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation'
];

export const ALL_BIBLE_BOOKS = [
  ...OLD_TESTAMENT_BOOKS,
  ...NEW_TESTAMENT_BOOKS
];

// Language Codes
export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
  ITALIAN: 'it',
  PORTUGUESE: 'pt',
  CHINESE: 'zh',
  JAPANESE: 'ja',
  KOREAN: 'ko',
  ARABIC: 'ar',
  HINDI: 'hi',
  RUSSIAN: 'ru'
};

// Voice Language Codes
export const VOICE_LANGUAGE_CODES = {
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

// Popular Bible Versions
export const POPULAR_VERSIONS = [
  {
    id: 'de4e12af7f28f599-02',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'English'
  },
  {
    id: '592420522e16049f-01',
    name: 'Reina Valera 1909',
    abbreviation: 'RVR09',
    language: 'Spanish'
  },
  {
    id: 'c315fa9f71d4af3a-01',
    name: 'Louis Segond 1910',
    abbreviation: 'LSG',
    language: 'French'
  }
];

// AI Model Configuration
export const AI_CONFIG = {
  MODEL_NAME: 'meta-llama/Meta-Llama-3-70B-Instruct',
  MAX_TOKENS: 1024,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  STREAM: false
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_HISTORY_MESSAGES: 50,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_BATCH_SIZE: 20
};

// Reading Configuration
export const READING_CONFIG = {
  MIN_FONT_SIZE: 12,
  MAX_FONT_SIZE: 24,
  DEFAULT_FONT_SIZE: 16,
  FONT_SIZE_STEP: 2,
  VERSES_PER_PAGE: 50
};

// Feature Flags
export const FEATURE_FLAGS = {
  VOICE_CHAT_ENABLED: true,
  TTS_ENABLED: true,
  AUTO_TRANSLATE_ENABLED: true,
  OFFLINE_MODE_ENABLED: true,
  PREMIUM_FEATURES_ENABLED: true,
  ANALYTICS_ENABLED: true,
  CRASH_REPORTING_ENABLED: true
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  PERMISSION_DENIED: 'Permission denied. Please grant necessary permissions.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Saved successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SENT: 'Sent successfully!',
  COPIED: 'Copied to clipboard!'
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 254,
  MAX_MESSAGE_LENGTH: 500,
  MAX_NOTE_LENGTH: 5000
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Notification Types
export const NOTIFICATION_TYPES = {
  DAILY_VERSE: 'daily_verse',
  READING_REMINDER: 'reading_reminder',
  CHAT_RESPONSE: 'chat_response',
  UPDATE_AVAILABLE: 'update_available'
};

// Deep Links
export const DEEP_LINKS = {
  HOME: 'bibleai://home',
  BIBLE: 'bibleai://bible',
  CHAT: 'bibleai://chat',
  PROFILE: 'bibleai://profile',
  SETTINGS: 'bibleai://settings'
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/bibleai',
  TWITTER: 'https://twitter.com/bibleai',
  INSTAGRAM: 'https://instagram.com/bibleai',
  YOUTUBE: 'https://youtube.com/@bibleai'
};

// Support Links
export const SUPPORT_LINKS = {
  EMAIL: 'support@bibleai.app',
  PRIVACY_POLICY: 'https://bibleai.app/privacy',
  TERMS_OF_SERVICE: 'https://bibleai.app/terms',
  FAQ: 'https://bibleai.app/faq',
  FEEDBACK: 'https://bibleai.app/feedback'
};