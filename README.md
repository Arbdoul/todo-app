# To-Do List App

A React Native to-do list app with AI-powered voice input, built with Expo Router and TypeScript.

## Installation

# Clone and install

git clone <your-repo-url>
cd todo-app
npm install

# Run the app

npx expo start

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for physical device

## Features

- Create, edit, delete tasks
- Mark tasks complete/incomplete
- Search and filter
- Due dates
- Dark mode
- Voice input (demo mode)

## Voice Feature

**Status**: Demo mode (returns mock data)

**Why**: OpenAI Whisper + GPT APIs require **paid subscription**

**How it works now**:

- Tap microphone → Tap "Done" → Creates 3 sample tasks

**Full implementation**: Available in `services/openai.ts` (commented out)

**To enable real voice**:

1. Get paid OpenAI API key
2. Add to `.env`: `EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key`
3. Uncomment code in `services/openai.ts`
4. Restart: `npx expo start -c`

## Tech Stack

1. React Native
2. Expo Router
3. TypeScript
4. Zustand
5. AsyncStorage
6. expo-av
7. OpenAI APIs
