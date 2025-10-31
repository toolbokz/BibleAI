# Bible AI - React Native Application

A comprehensive Bible study application with AI chatbot integration powered by Meta Llama 3.

## Features

- **AI Chatbot**: Powered by Meta Llama 3 for Bible study assistance
- **Voice Chat**: Speech recognition for hands-free interaction
- **Text-to-Speech**: Listen to Bible verses
- **Multi-Language**: Support for 12+ languages
- **Multiple Bible Versions**: Access various translations
- **User Authentication**: Firebase-based secure login
- **Cloud Sync**: Save your progress across devices
- **Offline Mode**: Read Bible offline with caching

## Quick Start

### Prerequisites
- Node.js 18+
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation

1. Clone or extract the project
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your API keys
```

4. Run the application:
```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios
```

## Configuration

### Required API Keys

1. **Llama AI API**: Get from [Together AI](https://api.together.xyz/)
2. **Bible API**: Get from [Scripture API Bible](https://scripture.api.bible/)
3. **Firebase**: Create project at [Firebase Console](https://console.firebase.google.com/)
4. **Google Cloud**: Enable Translation API at [Google Cloud](https://console.cloud.google.com/)

Add all keys to your `.env` file.

## Project Structure

```
BibleAI/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── services/       # API and service integrations
│   ├── stores/         # State management (Zustand)
│   ├── navigation/     # Navigation configuration
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript definitions
│   └── constants/      # App constants
├── android/            # Android native code
├── ios/                # iOS native code
└── App.tsx            # App entry point
```

## Building for Production

### Android

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### iOS

1. Open `ios/BibleAI.xcworkspace` in Xcode
2. Select "Product" > "Archive"
3. Follow the distribution wizard

## Documentation

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `DEPLOYMENT_GUIDE.md` for publishing to app stores

## Tech Stack

- React Native 0.72
- TypeScript
- Firebase (Auth & Firestore)
- Meta Llama 3 (AI Model)
- Zustand (State Management)
- React Navigation
- React Native Paper (UI)

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.
