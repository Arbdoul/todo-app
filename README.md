# To-Do List App

A React Native to-do list app with voice input, built with Expo Router and TypeScript.

## Installation

```bash
# Clone and install
git clone <your-repo-url>
cd todo-app
npm install

# Install voice recognition
npm install @react-native-voice/voice

# Rebuild for native modules
npx expo prebuild --clean

# Run the app
npx expo run:ios
# or
npx expo run:android
```

**Note**: Voice feature requires running on a **real device** or rebuild with `npx expo run:ios/android` (won't work with `npx expo start` due to native modules).

## Features

- Create, edit, delete tasks
- Mark tasks complete/incomplete
- Search and filter
- Due dates with overdue indicators
- Dark mode
- **Voice input with speech recognition**

## 🎤 Voice Feature

**Status**: Fully functional

**Technology**: Device's native speech recognition (iOS/Android)

**Cost**: FREE - No API charges

### How It Works

1. Tap the **microphone button** (purple FAB)
2. Speak naturally: "Buy groceries and call mom"
3. Device transcribes your speech automatically
4. App intelligently splits into separate tasks:
   - "Buy groceries"
   - "Call mom"
5. Tasks added to your list!

### Requirements

- Works on iOS and Android devices
- Requires microphone and speech recognition permissions
- Internet connection (for device speech recognition)

## Tech Stack

- React Native + Expo SDK 51
- Expo Router (file-based navigation)
- TypeScript
- Zustand (state management)
- AsyncStorage (local storage)
- **@react-native-voice/voice** (speech recognition)
- expo-haptics (feedback)

## Requirements Met

All core features (CRUD, persistence, navigation)  
Voice input via FAB  
Speech-to-text transcription  
Natural language task splitting  
All bonus features (due dates, search, dark mode)

## STroubleshooting

**Voice not working:**

- Make sure you're on a **real device** (not simulator)
- Check microphone permissions are granted
- Run `npx expo run:ios` (not `npx expo start`)

**App crashes on iOS:**

```bash
npx expo prebuild --clean
npx expo run:ios
```

**Permissions denied:**

- Go to device Settings → Your App → Enable Microphone & Speech Recognition

## 📱 Running on Device

### iOS (Real Device)

```bash
npx expo run:ios --device
```

### Android (Real Device)

```bash
npx expo run:android --device
```
