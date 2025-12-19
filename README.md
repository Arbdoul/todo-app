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

**Note**: Voice feature requires running with `npx expo run:ios/android` (won't work with `npx expo start` due to native modules).

## Features

- Create, edit, delete tasks
- Mark tasks complete/incomplete
- Search and filter
- Due dates with overdue indicators
- Dark mode
- Voice input with speech recognition (iOS)

## Voice Feature

**Status**: Fully functional on iOS | iOS only

**Technology**: Device's native speech recognition

**Cost**: FREE - No API charges

### How It Works (iOS)

1. Tap the **microphone button** (purple FAB)
2. Speak naturally: "Buy groceries and call mom"
3. Device transcribes your speech automatically
4. App intelligently splits into separate tasks:
   - "Buy groceries"
   - "Call mom"
5. Tasks added to your list!

### Smart Task Splitting

The app recognizes natural language patterns:

- **"and"**: "Buy milk **and** call mom" → 2 tasks
- **Commas**: "Clean room**,** do laundry" → 2 tasks
- **"then"**: "Finish work **then** exercise" → 2 tasks

### Platform Support

| Platform    | Status  | Notes                                          |
| ----------- | ------- | ---------------------------------------------- |
| **iOS**     | Working | Fully functional on real devices and simulator |
| **Android** | Limited | Voice recognition not currently working        |

**Android Note**: While the app's core features work perfectly on Android, voice input is currently iOS-only. Android users can add tasks using the standard text input method.

### Requirements (iOS)

- iOS device (iPhone/iPad)
- Microphone permission
- Speech recognition permission
- Internet connection

## 🛠️ Tech Stack

- React Native + Expo SDK 51
- Expo Router (file-based navigation)
- TypeScript
- Zustand (state management)
- AsyncStorage (local storage)
- @react-native-voice/voice (speech recognition)
- expo-haptics (feedback)

## Requirements Met

All core features (CRUD, persistence, navigation)  
Voice input via FAB (iOS)  
Speech-to-text transcription (iOS)  
Natural language task splitting (iOS)  
All bonus features (due dates, search, dark mode)

## Troubleshooting

**Voice not working on iOS:**

- Make sure you're on a **real device** (not simulator)
- Check microphone permissions are granted
- Run `npx expo run:ios --device`

**Voice not working on Android:**

- Voice feature is currently iOS-only
- Use the standard "+" button to add tasks manually

**App crashes on iOS:**

```bash
npx expo prebuild --clean
npx expo run:ios
```

**Permissions denied:**

- Go to Settings → Your App → Enable Microphone & Speech Recognition

## Running on Device

### iOS (Real Device)

```bash
npx expo run:ios --device
```

### Android (Real Device)

```bash
npx expo run:android --device
```
