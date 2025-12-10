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
  loginType?: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken?: string; // May be returned in body for mobile
  user: UserDto;
}

export interface RefreshRequest {
  refreshToken?: string; // Optional if cookie present
}

export interface UserDto {
  id: number;
  email: string;
  fullName: string;
  role: string;
  schoolId?: number;
  createdAt?: string;
}

export interface StudentDto extends UserDto {
  studentId?: string;
  phoneNumber?: string;
}

export interface DriverDto extends UserDto {
  licenseNumber: string;
  phoneNumber?: string;
  status?: string;
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  fullName: string;
  schoolId: number;
  phoneNumber?: string;
  studentId?: string;
}

export interface RegisterDriverRequest {
  email: string;
  password: string;
  fullName: string;
  licenseNumber: string;
  schoolId: number;
  phoneNumber?: string;
}

// ==================== Trip/Reminder DTOs ====================

export interface TripReminderRequestDto {
  studentId: number;
  shuttleId: number;
  pickupStopId: number;
  dropoffStopId: number;
  reminderOffsetMinutes?: number; // 3, 5, 10, or 15
}

export interface TripActivityDto {
  tripId: number;
  studentId: number;
  shuttleId: number;
  departureStopId: number;
  arrivalStopId: number;
  estimatedTime?: string;
  status: string;
  reminderOffsetMinutes?: number;
  reminderScheduledAt?: string;
  notificationSent?: boolean;
}

export interface TripMatchRequest {
  pickupStopId?: number;
  dropoffStopId?: number;
  pickupStopName?: string;
  dropoffStopName?: string;
}

export interface MatchedRouteDto {
  routeId: number;
  shuttleId: number;
  shuttleName?: string;
  pickupStop?: StopDto;
  dropoffStop?: StopDto;
  estimatedDuration?: number;
  distance?: number;
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
  id: number;
  licensePlate: string;
  capacity: number;
  status?: string;
  schoolId: number;
  driverId?: number;
  currentLocation?: ShuttleLocationDto;
}

export interface RegisterShuttleRequest {
  licensePlate: string;
  capacity: number;
  status?: string;
  schoolId: number;
}

export interface ShuttleLocationDto {
  shuttleId: number;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  createdAt?: string;
}

export interface LocationBroadcastDto {
  shuttleId: number;
  latitude: number;
  longitude: number;
  timestamp?: string;
  createdAt?: string;
}

// ==================== Route DTOs ====================

export interface RouteDto {
  id: number;
  routeName: string;
  schoolId: number;
  stops?: StopDto[];
  isActive?: boolean;
}

export interface RouteResponseDto {
  routeId: number;
  routeName?: string;
  stops: StopDto[];
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
  etaMillis: number;
  etaTimestamp: string;
  distanceMeters: number;
  debug?: any;
}

// ==================== Driver Session DTOs ====================

export interface StartSessionRequest {
  shuttleId: number;
  routeId?: number;
}

export interface DriverSessionResponse {
  id: number;
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
  accuracy?: number;
  heading?: number;
  speed?: number;
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
