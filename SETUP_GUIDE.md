# Bible AI - Complete Setup Guide

## Step 1: System Requirements

### Ubuntu/Linux
- Ubuntu 20.04 or later
- 8GB RAM minimum (16GB recommended)
- 50GB free disk space

### Required Software
- Node.js 18+
- Java JDK 11
- Android Studio
- Git

## Step 2: Install Dependencies

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

### Install Java
```bash
sudo apt install openjdk-11-jdk -y
java -version
```

### Install Android Studio
1. Download from: https://developer.android.com/studio
2. Extract and run: `./android-studio/bin/studio.sh`
3. Follow setup wizard
4. Install Android SDK

### Set Environment Variables
```bash
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

## Step 3: Project Setup

### Clone/Extract Project
```bash
cd BibleAI
npm install
```

### Configure Environment
```bash
cp .env.example .env
nano .env
```

Add your API keys:
- LLAMA_API_KEY
- BIBLE_API_KEY
- FIREBASE_* credentials
- GOOGLE_CLOUD_API_KEY

## Step 4: Firebase Setup

1. Go to https://console.firebase.google.com/
2. Create new project
3. Add Android app (package: com.bibleai)
4. Download google-services.json
5. Place in: android/app/google-services.json
6. Enable Authentication (Email/Password)
7. Create Firestore database

## Step 5: Run Application

### Start Metro Bundler
```bash
npm start
```

### Run on Android (new terminal)
```bash
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..
```

### Permission Errors
```bash
chmod +x android/gradlew
```

## Next Steps

1. Test all features
2. Customize app branding
3. Add your content
4. Build for production
5. Submit to app stores

For deployment guide, see DEPLOYMENT_GUIDE.md
