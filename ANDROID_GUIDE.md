# Maharaja's Bharat Odyssey — Android & Play Store Guide

## Project Summary

A complete open-world Indian-themed 3D platformer game built with:
- **React + Vite** (web frontend)
- **Three.js / @react-three/fiber** (3D rendering)
- **@react-three/rapier** (Rapier physics — open source)
- **Zustand** (state management — open source)
- **Capacitor** (Android wrapper — open source by Ionic)
- **Web Audio API** (procedural audio — no external files)

All tools are 100% open-source MIT-licensed.

---

## Running Locally

```bash
cd /home/vnx_7/Desktop/Game
npm run dev
# Open http://localhost:5173
```

## Building for Android (Play Store)

### Step 1: Prerequisites
```bash
# Install Android Studio from https://developer.android.com/studio
# Install Java JDK 17+
# Set ANDROID_HOME and JAVA_HOME environment variables
```

### Step 2: Build the Web App
```bash
npm run build
```

### Step 3: Initialize Capacitor Android
```bash
npx cap add android
```

### Step 4: Sync web build to Android
```bash
npx cap sync android
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

### Step 6: Build APK in Android Studio
1. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. For Play Store: **Build → Generate Signed Bundle/APK**
3. Choose **Android App Bundle (.aab)** for Play Store
4. Create or use existing keystore

### Step 7: Play Store Submission
1. Go to https://play.google.com/console
2. Create new app: "Maharaja's Bharat Odyssey"
3. Upload the `.aab` file
4. Add screenshots (use browser screenshots from the game)
5. Set category: **Games → Adventure**
6. Content rating: Everyone
7. Submit for review

---

## App Details for Play Store

- **App ID**: `com.akshit.maharajasbharatodyssey`
- **App Name**: Maharaja's Bharat Odyssey
- **Short Description**: An epic open-world Indian 3D platformer
- **Category**: Games → Adventure
- **Content Rating**: Everyone (E)

## Features to Highlight
- 🏰 6 Unique Indian Biomes
- 🗡️ Sword-wielding Maharaja character
- 💎 Regional gem collecting (Ruby, Diamond, Emerald, Sapphire)
- 🪙 Ashoka Chakra coins
- 🪷 Sacred Lotus collectibles
- 🏔️ Triple jump + Ground Pound mechanics
- 🌙 Dynamic day/night cycle
- 🌧️ Weather system (rain, snow, sandstorm)
- 📱 Full mobile touch controls with virtual joystick

---

## Tech Stack (All Open Source)
| Tool | License | Purpose |
|------|---------|---------|
| React | MIT | UI framework |
| Vite | MIT | Build tool |
| Three.js | MIT | 3D rendering |
| @react-three/fiber | MIT | React+Three.js |
| @react-three/rapier | MIT | Physics engine |
| @react-three/drei | MIT | 3D helpers |
| Zustand | MIT | State management |
| Capacitor | MIT | Android wrapper |
| Howler.js | MIT | Audio |
| Framer Motion | MIT | Animations |
