# React Native + Spring Boot Integration

Complete TypeScript integration layer for connecting the React Native Expo app with the Java Spring Boot backend.

## 📁 Generated Files

### Type Definitions
- **`src/types/api.ts`** - All TypeScript interfaces matching backend DTOs

### Core API Infrastructure
- **`src/utils/authStorage.ts`** - Secure token storage using Expo SecureStore
- **`src/api/axios.ts`** - Axios instance with auto-refresh and 401 handling
- **`src/api/stomp.ts`** - WebSocket/STOMP client for real-time updates

### API Hooks
- **`src/api/hooks/useAuth.ts`** - Authentication (login, signup, logout, refresh)
- **`src/api/hooks/useStudent.ts`** - Student features (search stops, match trips, reminders)
- **`src/api/hooks/useDriver.ts`** - Driver features (sessions, location updates, routes)
- **`src/api/hooks/useShuttle.ts`** - Shuttle operations (shuttles, routes, ETA, schools)

### Example Screens
- **`src/screens/LoginScreen.tsx`** - Login with token management
- **`src/screens/StudentSearchScreen.tsx`** - Stop search and trip matching
- **`src/screens/MapScreen.tsx`** - Real-time shuttle tracking with STOMP
- **`src/screens/DriverDashboardScreen.tsx`** - Driver session and location tracking

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install axios @stomp/stompjs sockjs-client expo-secure-store expo-location
npm install --save-dev @types/sockjs-client
```

### 2. Environment Configuration

Create `.env` file in the project root:

```bash
cp .env.example .env
```

Update the API base URL:

```
EXPO_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

### 3. Integration Steps

#### Import hooks in your components:

```typescript
import { useLogin } from '../api/hooks/useAuth';
import { useSearchStops } from '../api/hooks/useStudent';
import { useGetEta } from '../api/hooks/useShuttle';
```

#### Use the hooks:

```typescript
const { login, data, isLoading, error } = useLogin();

const handleLogin = async () => {
  const result = await login({ email, password });
  // Navigate on success
};
```

## 🔑 Authentication Flow

### Login Process
1. User enters credentials
2. Call `useLogin()` hook
3. Receive `accessToken` and `refreshToken`
4. Tokens automatically saved to SecureStore
5. `Authorization` header automatically added to all requests

### Token Refresh
- Automatic refresh on 401 responses
- Queues concurrent requests during refresh
- Retries failed requests after successful refresh
- Force logout on refresh failure

### Logout Process
1. Call `useLogout()` hook
2. Backend clears httpOnly cookie
3. Local tokens cleared from SecureStore
4. Navigate to login screen

## 📡 Real-Time Location Tracking

### Student Map (Subscribe to Location Updates)

```typescript
import { useStompClient } from '../api/stomp';

const { connect, disconnect, subscribe, isConnected } = useStompClient();

useEffect(() => {
  // Connect on mount
  connect();
  
  return () => disconnect();
}, []);

useEffect(() => {
  if (isConnected) {
    const unsubscribe = subscribe(shuttleId, (location) => {
      console.log('New location:', location);
      // Update map marker
    });
    
    return unsubscribe;
  }
}, [isConnected, shuttleId]);
```

### Driver App (Publish Location Updates)

```typescript
import { useStompClient } from '../api/stomp';
import { usePostDriverLocation } from '../api/hooks/useDriver';

const { publish, isConnected } = useStompClient();
const { postLocation } = usePostDriverLocation();

// Send location via REST
await postLocation({
  shuttleId,
  latitude,
  longitude,
});

// Also broadcast via WebSocket
if (isConnected) {
  publish({ shuttleId, latitude, longitude });
}
```

## 🎯 API Endpoints Coverage

### Authentication (`/auth`)
- ✅ `POST /auth/signup/student`
- ✅ `POST /auth/signup/driver`
- ✅ `POST /auth/login`
- ✅ `POST /auth/refresh`
- ✅ `POST /auth/logout`
- ✅ `POST /auth/logout/all`

### Student Features
- ✅ `GET /stops/search`
- ✅ `POST /student/trip/match`
- ✅ `POST /api/trips/reminders`
- ✅ `POST /api/devices/register`
- ✅ `POST /api/devices/unregister`

### Driver Features
- ✅ `GET /driver/shuttles`
- ✅ `GET /driver/routes`
- ✅ `POST /driver/session/start`
- ✅ `POST /driver/session/end`
- ✅ `POST /driver/location`

### Shuttle & Routes
- ✅ `POST /shuttles/add`
- ✅ `GET /shuttles/{id}/location`
- ✅ `GET /api/routes/{shuttleId}`
- ✅ `GET /api/shuttles/{shuttleId}/eta`

### Schools
- ✅ `GET /schools`
- ✅ `POST /schools`

### WebSocket
- ✅ Connect to `/ws` with Authorization header
- ✅ Subscribe to `/topic/shuttle/{shuttleId}/location`
- ✅ Publish to `/app/driver/location`

## 🛠️ Usage Examples

### Login Screen
```typescript
const { login, isLoading, error } = useLogin();

const handleLogin = async () => {
  try {
    const result = await login({ email, password, loginType: 'student' });
    router.replace('/(student)/home-search');
  } catch (err) {
    Alert.alert('Login Failed', error);
  }
};
```

### Search Stops
```typescript
const { searchStops, data, isLoading } = useSearchStops();

const handleSearch = async (query: string) => {
  const results = await searchStops(query);
  // Display results
};
```

### Get ETA
```typescript
const { getEta, data } = useGetEta();

const fetchEta = async () => {
  const eta = await getEta(shuttleId, pickupStopId, dropoffStopId);
  const minutes = Math.ceil(eta.etaMillis / 60000);
  // Display ETA
};
```

### Create Reminder
```typescript
const { createReminder } = useCreateReminder();

const setReminder = async () => {
  await createReminder({
    studentId: 123,
    shuttleId: 456,
    pickupStopId: 789,
    dropoffStopId: 101,
    reminderOffsetMinutes: 5,
  });
};
```

### Start Driver Session
```typescript
const { startSession } = useStartSession();

const handleStart = async () => {
  const session = await startSession({
    shuttleId: selectedShuttle.id,
    routeId: selectedRoute?.id,
  });
  // Start location tracking
};
```

## 🔧 Configuration

### Axios Instance
- Base URL from environment variable
- 30-second timeout
- Auto-retry on 401 with token refresh
- Request queuing during refresh

### STOMP Client
- Automatic reconnection (5s delay)
- Heartbeat every 10s
- Bearer token in connection headers
- SockJS fallback for compatibility

### SecureStore
- Encrypted storage for tokens
- Separate keys for access/refresh tokens
- User data persistence
- Auto-cleanup on logout

## 🧪 Testing

### Test Token Refresh
1. Set short token expiration on backend
2. Make API request after expiration
3. Verify automatic refresh and request retry
4. Check no duplicate refresh calls for concurrent requests

### Test WebSocket
1. Start driver session
2. Publish location updates
3. Verify student map receives updates
4. Test reconnection on disconnect

### Test Error Handling
1. Invalid credentials → Show error message
2. Network failure → Retry with backoff
3. Refresh failure → Force logout

## 📝 Notes

- Backend sets `httpOnly` refresh token cookie
- Mobile app stores refresh token in SecureStore
- Refresh token sent in request body to `/auth/refresh`
- All authenticated requests include `Authorization: Bearer <token>` header
- STOMP connection includes Authorization header
- Location updates sent via both REST and WebSocket for reliability

## 🔒 Security Best Practices

1. ✅ Tokens stored in SecureStore (encrypted)
2. ✅ HTTPS for all API calls (production)
3. ✅ WSS for WebSocket connections (production)
4. ✅ Automatic token refresh
5. ✅ Token cleanup on logout
6. ✅ No sensitive data in logs (production)

## 🚨 Common Issues

### "WebSocket connection failed"
- Check API_BASE_URL in `.env`
- Ensure backend `/ws` endpoint is accessible
- Verify Authorization header is valid

### "401 Unauthorized" loop
- Check token expiration settings
- Verify refresh endpoint works
- Clear app data and re-login

### "Location permission denied"
- Request permissions before starting session
- Handle permission rejection gracefully

## 📚 Additional Resources

- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [STOMP.js Documentation](https://stomp-js.github.io/stomp-websocket/)
- [Axios Documentation](https://axios-http.com/)
