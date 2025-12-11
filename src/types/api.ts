/**
 * TypeScript interfaces for backend API DTOs
 * Auto-generated from Java Spring Boot backend specification
 */

// ==================== Common Types ====================

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
  status?: number;
}

// ==================== Auth DTOs ====================

export interface JwtRequest {
  email: string;
  password: string;
  loginType?: string; // "driver" or "student" (optional)
}

export interface JwtResponse {
  accessToken: string;
  refreshToken?: string; // mobile may receive it in body; cookie also issued by server
  user: UserDto;
}

export interface RefreshRequest {
  refreshToken?: string; // optional when using cookie-based refresh
}

export interface UserDto {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  schoolId?: number;
  username?: string;
  createdAt?: string;
}

export interface StudentDto extends UserDto {
  studentIdNumber?: string;
  schoolName?: string;
}

export interface DriverDto extends UserDto {
  status?: string;
}

export interface RegisterStudentRequest {
  studentIdNumber?: string;
  firstName: string;
  lastName: string;
  schoolName: string;
  username?: string;
  email: string;
  password: string;
}

export interface RegisterDriverRequest {
  firstName: string;
  lastName: string;
  schoolName: string;
  email: string;
  password: string;
}

// ==================== Trip/Reminder DTOs ====================

export interface TripReminderRequestDto {
  studentId: number;
  shuttleId: number;
  pickupStopId: number;
  dropoffStopId: number;
  reminderOffsetMinutes: number; // must be one of 3,5,10,15
}

export interface TripActivityDto {
  tripId: number;
  studentId: number;
  shuttleId: number;
  departureStopId: number;
  arrivalStopId: number;
  routeId: number;
  estimatedTime?: string; // ISO timestamp
  actualTime?: string;
  status: string;
  reminderOffsetMinutes: number;
  reminderScheduledAt?: string;
  notificationSent?: boolean;
}

export interface TripMatchRequest {
  pickupStopId?: number;
  dropoffStopId?: number;
  pickupStopName?: string;
  dropoffStopName?: string;
}

export interface MatchedShuttleDto {
  shuttleId: number;
  shuttleExternalId?: string;
  status: string;
  latitude: number;
  longitude: number;
  etaToPickup?: number; // seconds, nullable
}

export interface MatchedRouteDto {
  routeId: number;
  routeName: string;
  activeShuttles: MatchedShuttleDto[];
}

export interface TripMatchResponse {
  routes: MatchedRouteDto[];
}

// ==================== Stop DTOs ====================

export interface StopSearchDto {
  id: number;
  stopName: string;
  latitude?: number;
  longitude?: number;
}

export interface StopDto {
  id: number;
  stopName: string;
  latitude: number;
  longitude: number;
  stopOrder?: number;
  arrivalTime?: string;
}

// ==================== Shuttle DTOs ====================

export interface ShuttleDto {
  shuttleId: number;
  licensePlate: string;
  capacity: number;
  status: string;
  schoolId: number;
}

export interface RegisterShuttleRequest {
  licensePlate: string;
  capacity: number;
  status?: string;
  schoolId: number;
}

export interface ShuttleLocationDto {
  shuttleId: number;
  latitude: number;
  longitude: number;
  createdAt?: string; // ISO timestamp
}

export interface LocationBroadcastDto {
  shuttleId: number;
  lat: number;
  lng: number;
  timestamp: string; // ISO timestamp
}

// ==================== Route DTOs ====================

export interface RouteDto {
  routeId: number;
  routeName: string;
  description?: string;
  schoolId?: number;
}

export interface RouteResponseDto {
  routeId: number;
  routeName?: string;
  stops?: StopDto[];
  coordinates?: RouteCoordinate[];
  polyline?: string;
}

export interface RouteCoordinate {
  latitude: number;
  longitude: number;
  order?: number;
}

// ==================== ETA DTOs ====================

export interface EtaResponseDto {
  shuttleId: number;
  pickupStopId: number;
  dropoffStopId: number;
  etaMillis: number;
  etaTimestamp: string;
  distanceShuttleToPickup: number;
  distancePickupToDrop: number;
  totalDistance: number;
  direction?: string | null;
  speedKph?: number | null;
  shuttleSegmentIndex?: number | null;
  pickupSegmentIndex?: number | null;
  dropoffSegmentIndex?: number | null;
  debug?: string | null;
}

// ==================== Driver Session DTOs ====================

export interface StartSessionRequest {
  shuttleId: number;
  routeId: number;
}

export interface DriverSessionResponse {
  sessionId: number;
  shuttleId: number;
  routeId?: number;
  startedAt: string;
}

export interface EndSessionRequest {
  sessionId?: number;
}

export interface EndSessionResponse {
  sessionId: number;
  endedAt: string;
}

export interface LocationUpdateDto {
  shuttleId: number;
  latitude: number;
  longitude: number;
  createdAt?: string;
}

// ==================== School DTOs ====================

export interface SchoolDto {
  id: number;
  schoolName: string;
  mapCenterLat?: number;
  mapCenterLon?: number;
  mapImageUrl?: string;
  address?: string;
}

export interface RegisterSchoolRequest {
  schoolName: string;
  mapCenterLat?: number;
  mapCenterLon?: number;
  mapImageUrl?: string;
}

// ==================== Device Token DTOs ====================

export interface DeviceRegisterRequest {
  studentId: number;
  token: string;
  platform?: string;
}

export interface DeviceUnregisterRequest {
  token: string;
}

export interface DeviceTokenResponse {
  id: number;
  studentId: number;
  token: string;
  platform?: string;
  createdAt: string;
}
