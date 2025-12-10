/**
 * Installation Script for Backend Integration Dependencies
 * Run this to install all required packages
 */

// Core dependencies to install:
// npm install axios @stomp/stompjs sockjs-client expo-secure-store expo-location

// Dev dependencies:
// npm install --save-dev @types/sockjs-client

export const REQUIRED_DEPENDENCIES = {
  dependencies: {
    "axios": "^1.6.0",
    "@stomp/stompjs": "^7.0.0",
    "sockjs-client": "^1.6.1",
    "expo-secure-store": "~13.0.1",
    "expo-location": "~17.0.1"
  },
  devDependencies: {
    "@types/sockjs-client": "^1.8.0"
  }
};

// Installation instructions:
console.log(`
🚀 Backend Integration Setup
============================

1. Install dependencies:
   npm install axios @stomp/stompjs sockjs-client expo-secure-store expo-location

2. Install dev dependencies:
   npm install --save-dev @types/sockjs-client

3. Copy .env.example to .env:
   cp .env.example .env

4. Update .env with your API URL:
   EXPO_PUBLIC_API_BASE_URL=https://your-api-url.com

5. Start development:
   npm start

✅ All set! Check INTEGRATION_README.md for usage examples.
`);
