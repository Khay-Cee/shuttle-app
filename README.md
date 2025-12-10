# 🚐 Shuttle App - Real-Time Campus Transportation System

A comprehensive React Native mobile application built with Expo for managing campus shuttle services. The app provides real-time shuttle tracking, route management, and seamless communication between students and drivers.

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Application Flow](#application-flow)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Real-Time Communication](#real-time-communication)
- [Authentication Flow](#authentication-flow)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Shuttle App is a mobile platform designed to streamline campus transportation by connecting students and drivers in real-time. Students can track shuttle locations, search for stops, and set reminders, while drivers can manage live sessions, update locations, and communicate with passengers.

### Core Capabilities

- **Dual User Roles**: Separate interfaces for students and drivers
- **Real-Time Tracking**: Live shuttle location updates via WebSocket (STOMP)
- **Smart Route Management**: Dynamic route selection and ETA calculations
- **Secure Authentication**: JWT-based auth with automatic token refresh
- **Cross-Platform**: Runs on iOS, Android, and Web

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│                    (React Native + Expo)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │    Driver    │  │    Common    │      │
│  │   Screens    │  │   Screens    │  │  Components  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│  ┌──────┴──────────────────┴──────────────────┴───────┐     │
│  │           API Layer (React Query Hooks)            │     │
│  └──────┬──────────────────────────────────────┬──────┘     │
│         │                                       │             │
│  ┌──────┴───────┐                      ┌───────┴──────┐     │
│  │ Axios Client │                      │ STOMP Client │     │
│  │ (REST API)   │                      │ (WebSocket)  │     │
│  └──────┬───────┘                      └───────┬──────┘     │
│         │                                       │             │
└─────────┼───────────────────────────────────────┼─────────────┘
          │                                       │
          │                                       │
          ▼                                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API Server                          │
│                (Spring Boot + Java)                          │
├─────────────────────────────────────────────────────────────┤
│  • JWT Authentication      • Real-time Location Updates     │
│  • Route Management        • Session Management             │
│  • ETA Calculations        • Database Operations            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Application Flow

### Initial Launch Flow

```
1. App Launch
   ↓
2. Splash Screen (Typing Animation: "Your time, tracked in a minute")
   ↓
3. Chat/Onboarding Screen
   ↓
4. Role Selection Screen
   ├─→ Student Path → Student Login → Student Home
   └─→ Driver Path → Driver Login → Driver Dashboard
```

### Student Flow

```
Login/Signup
   ↓
Home Search (Search Stops & Destinations)
   ↓
Available Shuttles (View Matching Shuttles)
   ↓
Set Reminder (Get Notified When Shuttle Arrives)
   ↓
Activity (Track Shuttle in Real-Time)
   ↓
Account Management (Profile, Notifications, Privacy)
```

### Driver Flow

```
Login/Signup
   ↓
Shuttle Selection (Choose Assigned Shuttle)
   ↓
Route Selection (Select Today's Route)
   ↓
Confirm Live Session
   ↓
Live Session (Real-Time Location Broadcasting)
   ├─→ Live Map Display
   ├─→ Session Controls
   └─→ End Session
   ↓
Account Management
```

---

## ✨ Key Features

### For Students

- 🔍 **Stop Search**: Find pickup and drop-off locations
- 🚍 **Shuttle Tracking**: Real-time location updates on map
- ⏰ **Smart Reminders**: Get notified when shuttle is nearby
- 📊 **Activity History**: Track past and current rides
- 🔔 **Push Notifications**: Stay updated on shuttle status
- 👤 **Profile Management**: Update personal information and preferences

### For Drivers

- 🗺️ **Route Management**: View and select daily routes
- 📍 **Live Location Sharing**: Broadcast position to students
- ⏱️ **Session Control**: Start, pause, and end live sessions
- 🔄 **Real-Time Updates**: See passenger activity
- 📱 **Session Monitoring**: Track active ride sessions
- 🚦 **Status Management**: Online/Offline availability

### Technical Features

- 🔐 **Secure Authentication**: JWT tokens with httpOnly cookies
- 🔄 **Auto Token Refresh**: Seamless session management
- 🌐 **Real-Time Communication**: WebSocket/STOMP integration
- 📱 **Offline Support**: Graceful degradation without connection
- 🗺️ **Maps Integration**: React Native Maps for location display
- 🎨 **Modern UI**: Clean, intuitive interface design

---

## 🛠️ Tech Stack

### Core Framework
- **React Native** (v0.81.5) - Mobile app framework
- **Expo** (SDK 54) - Development platform
- **TypeScript** - Type-safe development

### Navigation & Routing
- **Expo Router** (v6.0.17) - File-based routing
- **React Navigation** (v7.1.8) - Native navigation

### State Management & Data Fetching
- **TanStack React Query** (v5.90.12) - Server state management
- **Custom Hooks** - Organized API layer

### Real-Time Communication
- **STOMP.js** (v7.2.1) - WebSocket protocol
- **SockJS Client** (v1.6.1) - WebSocket fallback

### HTTP & API
- **Axios** (v1.13.2) - HTTP client with interceptors

### Location & Maps
- **React Native Maps** (v1.20.1) - Map display
- **Expo Location** (v19.0.8) - GPS tracking

### Storage & Security
- **Expo SecureStore** (v15.0.8) - Encrypted token storage

### UI & Animations
- **React Native Reanimated** (v4.1.1) - Smooth animations
- **Expo Haptics** (v15.0.8) - Tactile feedback

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (installed globally or via npx)
- **Android Studio** (for Android emulator) or **Xcode** (for iOS simulator)
- **Expo Go App** (optional, for physical device testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shuttle-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   EXPO_PUBLIC_API_BASE_URL=https://your-backend-api.com
   ```

   Replace with your actual backend API URL (e.g., `http://localhost:8080` for local development).

4. **Start the development server**

   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on your platform**

   After starting the server, choose your platform:

   - Press `a` - Open on Android emulator
   - Press `i` - Open on iOS simulator
   - Press `w` - Open in web browser
   - Scan QR code with Expo Go app for physical device

### Platform-Specific Commands

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 📁 Project Structure

```
shuttle-app/
├── app/                          # Expo Router screens (file-based routing)
│   ├── _layout.tsx              # Root layout component
│   ├── index.tsx                # Entry point (redirects to splash)
│   ├── splash.tsx               # Animated splash screen
│   ├── chat.tsx                 # Onboarding chat screen
│   ├── role-select.tsx          # Student/Driver role selection
│   │
│   ├── (student)/               # Student-specific screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── home-search.tsx      # Search stops & destinations
│   │   ├── available-shuttles.tsx
│   │   ├── set-reminder.tsx
│   │   ├── activity.tsx         # Real-time tracking
│   │   ├── verify-email.tsx
│   │   ├── verified.tsx
│   │   ├── account.tsx
│   │   └── account/
│   │       ├── notifications.tsx
│   │       ├── personal-info.tsx
│   │       └── privacy.tsx
│   │
│   ├── (driver)/                # Driver-specific screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── shuttle-select.tsx   # Choose shuttle
│   │   ├── route-select.tsx     # Select route
│   │   ├── confirm-live.tsx     # Confirm session start
│   │   ├── live-session.tsx     # Active tracking session
│   │   └── account.tsx
│   │
│   └── constants/
│       └── Styles.ts            # Global styles & colors
│
├── src/
│   ├── api/                     # API integration layer
│   │   ├── axios.ts             # Axios instance with interceptors
│   │   ├── stomp.ts             # WebSocket/STOMP client
│   │   └── hooks/               # React Query API hooks
│   │       ├── useAuth.ts       # Login, signup, logout, refresh
│   │       ├── useStudent.ts    # Student operations
│   │       ├── useDriver.ts     # Driver operations
│   │       └── useShuttle.ts    # Shuttle & route operations
│   │
│   ├── types/
│   │   └── api.ts               # TypeScript interfaces for DTOs
│   │
│   ├── utils/
│   │   └── authStorage.ts       # Secure token management
│   │
│   └── screens/                 # Example/reference screens
│       ├── LoginScreen.tsx
│       ├── StudentSearchScreen.tsx
│       ├── MapScreen.tsx
│       └── DriverDashboardScreen.tsx
│
├── components/                  # Reusable UI components
│   ├── Header.tsx
│   ├── LiveMap.tsx
│   ├── ProgressIndicator.tsx
│   ├── SelectionCard.tsx
│   ├── PermissionModal.tsx
│   ├── SessionEndModal.tsx
│   ├── LogoutSuccessModal.tsx
│   ├── WarningModal.tsx
│   └── TypingIndicator.tsx
│
├── assets/                      # Images, fonts, etc.
│   ├── logo.png
│   ├── logo1.png
│   ├── bus_interior.jpg
│   └── images/
│
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── babel.config.js              # Babel config
├── metro.config.js              # Metro bundler config
└── README.md                    # This file
```

---

## 🔌 API Integration

### Backend Connection

The app communicates with a Spring Boot backend via:
- **REST API**: CRUD operations via Axios
- **WebSocket**: Real-time updates via STOMP

### API Hooks Architecture

All API calls are abstracted into custom React hooks using React Query pattern:

```typescript
// Example: Login hook
import { useLogin } from '@/src/api/hooks/useAuth';

const { login, data, isLoading, error } = useLogin();

const handleLogin = async () => {
  const result = await login({ 
    email: 'student@example.com', 
    password: 'password123' 
  });
  
  if (result) {
    // Navigate to home screen
  }
};
```

### Available Hooks

**Authentication** (`useAuth.ts`)
- `useLogin()` - Student/Driver login
- `useDriverLogin()` - Driver-specific login
- `useStudentSignup()` - Student registration
- `useDriverSignup()` - Driver registration
- `useLogout()` - Clear session
- `useRefreshToken()` - Refresh access token

**Student Operations** (`useStudent.ts`)
- `useSearchStops()` - Search pickup/dropoff locations
- `useMatchTrips()` - Find available shuttles for route
- `useSetReminder()` - Create arrival notifications
- `useGetStudentProfile()` - Fetch profile data

**Driver Operations** (`useDriver.ts`)
- `useStartSession()` - Begin live tracking session
- `useEndSession()` - Stop active session
- `useSendLocation()` - Broadcast GPS coordinates
- `useGetDriverProfile()` - Fetch driver details

**Shuttle Operations** (`useShuttle.ts`)
- `useGetAllShuttles()` - List available shuttles
- `useGetRoutes()` - Fetch routes by school
- `useGetEta()` - Calculate arrival time
- `useGetSchools()` - List registered schools

### HTTP Client Configuration

The Axios instance (`src/api/axios.ts`) includes:

- **Base URL**: Set via `EXPO_PUBLIC_API_BASE_URL` env variable
- **Auto Token Injection**: Adds `Authorization: Bearer <token>` to all requests
- **Token Refresh**: Automatically refreshes expired tokens on 401 responses
- **Request Queuing**: Holds requests during token refresh
- **Error Handling**: Centralized error processing

---

## 🔴 Real-Time Communication

### STOMP WebSocket Integration

The app uses STOMP protocol over WebSocket for real-time features.

**Client Setup** (`src/api/stomp.ts`)

```typescript
import { useStompClient } from '@/src/api/stomp';

const { connect, disconnect, subscribe, publish, isConnected } = useStompClient();
```

### Student: Subscribe to Shuttle Location

```typescript
useEffect(() => {
  // Connect to WebSocket
  connect();

  // Subscribe to shuttle location updates
  const unsubscribe = subscribe(
    `/topic/shuttle/${shuttleId}/location`,
    (message) => {
      const location = JSON.parse(message.body);
      updateMapMarker(location.latitude, location.longitude);
    }
  );

  return () => {
    unsubscribe();
    disconnect();
  };
}, [shuttleId]);
```

### Driver: Broadcast Location Updates

```typescript
useEffect(() => {
  const locationInterval = setInterval(() => {
    if (isConnected) {
      publish(`/app/driver/${driverId}/location`, {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        timestamp: new Date().toISOString(),
      });
    }
  }, 5000); // Update every 5 seconds

  return () => clearInterval(locationInterval);
}, [isConnected, currentPosition]);
```

### WebSocket Endpoints

- **Subscribe** (Student): `/topic/shuttle/{shuttleId}/location`
- **Publish** (Driver): `/app/driver/{driverId}/location`
- **ETA Updates**: `/topic/shuttle/{shuttleId}/eta`

---

## 🔐 Authentication Flow

### Token-Based Authentication

The app uses JWT (JSON Web Tokens) for secure authentication:

1. **Login**: User provides credentials → Receives `accessToken` and `refreshToken`
2. **Storage**: Tokens saved to `SecureStore` (encrypted)
3. **Request Authorization**: `accessToken` added to `Authorization` header
4. **Token Expiry**: On 401 error, `refreshToken` used to get new `accessToken`
5. **Logout**: Tokens cleared from storage

### Secure Storage

```typescript
// src/utils/authStorage.ts
import * as SecureStore from 'expo-secure-store';

// Save tokens
await saveAccessToken(token);
await saveRefreshToken(refreshToken);

// Retrieve tokens
const token = await getAccessToken();

// Clear on logout
await clearTokens();
```

### Auto-Refresh Mechanism

The Axios interceptor automatically:
1. Detects 401 Unauthorized responses
2. Pauses all outgoing requests
3. Calls `/auth/refresh` with `refreshToken`
4. Updates stored `accessToken`
5. Retries failed requests with new token
6. Logs out user if refresh fails

---

## 💻 Development Guide

### Running the App Locally

1. **Start Backend Server**
   - Ensure Spring Boot backend is running (default: `http://localhost:8080`)
   - Update `.env` with backend URL

2. **Start Expo Dev Server**
   ```bash
   npm start
   ```

3. **Choose Platform**
   - Android Emulator: Press `a`
   - iOS Simulator: Press `i`
   - Web Browser: Press `w`

### Development Workflow

```bash
# Start development server
npm start

# Clear cache if needed
npx expo start --clear

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

### Adding New Screens

Expo Router uses file-based routing. To add a new screen:

1. Create file in `app/` directory: `app/new-screen.tsx`
2. Export default component
3. Access via `router.push('/new-screen')`

**Example:**

```tsx
// app/settings.tsx
import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View>
      <Text>Settings</Text>
    </View>
  );
}
```

Navigate: `router.push('/settings')`

### Adding New API Hooks

1. Define TypeScript interface in `src/types/api.ts`
2. Create hook in appropriate file (`useAuth.ts`, `useStudent.ts`, etc.)
3. Use Axios client from `src/api/axios.ts`
4. Handle loading, error, and success states

---

## 🐛 Troubleshooting

### Common Issues

**1. Metro Bundler Cache Issues**
```bash
npx expo start --clear
```

**2. Backend Connection Failed**
- Check `.env` has correct `EXPO_PUBLIC_API_BASE_URL`
- Verify backend server is running
- Use `10.0.2.2:8080` for Android emulator (not `localhost`)

**3. WebSocket Connection Errors**
- Ensure backend WebSocket endpoint is accessible
- Check STOMP broker configuration
- Verify network connectivity

**4. Token Refresh Infinite Loop**
- Clear stored tokens: Go to Account → Logout
- Check backend `/auth/refresh` endpoint

**5. Location Permission Denied**
```typescript
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
  // Handle permission denied
}
```

**6. Build Errors**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Reset Expo
npx expo install --fix
```

---

## 📚 Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Query Docs](https://tanstack.com/query/latest)

### Backend Integration
- See `INTEGRATION_README.md` for detailed API integration guide
- TypeScript types in `src/types/api.ts` match backend DTOs

### Community & Support
- [Expo Discord](https://chat.expo.dev)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Contributors

Developed for campus transportation management.

For questions or support, contact the development team.

---

**Built with ❤️ using React Native & Expo**
