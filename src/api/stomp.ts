/**
 * STOMP WebSocket helper for real-time shuttle location updates
 * Uses @stomp/stompjs and SockJS for WebSocket communication
 */

import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAccessToken } from '../utils/authStorage';
import { LocationBroadcastDto, ShuttleLocationDto } from '../types/api';

// Get API base URL from environment
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';
// Backend exposes SockJS/STOMP at /ws-stomp
const WS_ENDPOINT = `${API_BASE_URL}/ws-stomp`;

/**
 * STOMP Client wrapper for shuttle location tracking
 */
export class ShuttleLocationClient {
  private client: Client | null = null;
  private isConnected: boolean = false;
  private subscriptions: Map<string, any> = new Map();

  /**
   * Connect to WebSocket server with authentication
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to WebSocket');
      return;
    }

    return new Promise(async (resolve, reject) => {
      try {
        const accessToken = await getAccessToken();

        this.client = new Client({
          // Use SockJS for better compatibility
          webSocketFactory: () => new SockJS(WS_ENDPOINT) as any,
          
          // Connection headers with Authorization
          connectHeaders: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
            access_token: accessToken || '',
          },

          // Heartbeat intervals (ms)
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,

          // Reconnection settings
          reconnectDelay: 5000,

          // Debug logging (disable in production)
          debug: (str) => {
            if (__DEV__) {
              console.log('[STOMP]', str);
            }
          },

          // Connection callbacks
          onConnect: (frame) => {
            console.log('Connected to WebSocket:', frame);
            this.isConnected = true;
            resolve();
          },

          onStompError: (frame) => {
            console.error('STOMP error:', frame.headers['message']);
            console.error('Details:', frame.body);
            reject(new Error(frame.headers['message']));
          },

          onWebSocketError: (event) => {
            console.error('WebSocket error:', event);
            reject(event);
          },

          onDisconnect: () => {
            console.log('Disconnected from WebSocket');
            this.isConnected = false;
            this.subscriptions.clear();
          },
        });

        // Activate the client
        this.client.activate();
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.subscriptions.clear();
      console.log('Disconnected from WebSocket');
    }
  }

  /**
   * Subscribe to shuttle location updates
   * @param shuttleId - ID of the shuttle to track
   * @param callback - Function to call when location update is received
   * @returns Unsubscribe function
   */
  subscribeToShuttleLocation(
    shuttleId: number,
    callback: (location: LocationBroadcastDto) => void
  ): () => void {
    if (!this.client || !this.isConnected) {
      throw new Error('Not connected to WebSocket. Call connect() first.');
    }

    const destination = `/topic/shuttle/${shuttleId}/location`;

    // Check if already subscribed
    if (this.subscriptions.has(destination)) {
      console.log('Already subscribed to:', destination);
      return () => this.unsubscribe(destination);
    }

    // Subscribe to topic
    const subscription = this.client.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const location: LocationBroadcastDto = JSON.parse(message.body);
          callback(location);
        } catch (error) {
          console.error('Error parsing location update:', error);
        }
      }
    );

    this.subscriptions.set(destination, subscription);
    console.log('Subscribed to:', destination);

    // Return unsubscribe function
    return () => this.unsubscribe(destination);
  }

  /**
   * Unsubscribe from shuttle location updates
   */
  private unsubscribe(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log('Unsubscribed from:', destination);
    }
  }

  /**
   * Publish driver location (for driver app)
   * @param location - Location data to publish
   */
  publishDriverLocation(location: ShuttleLocationDto): void {
    if (!this.client || !this.isConnected) {
      throw new Error('Not connected to WebSocket. Call connect() first.');
    }

    this.client.publish({
      destination: '/app/driver/location',
      body: JSON.stringify(location),
    });

    console.log('Published driver location:', location);
  }

  /**
   * Check if connected
   */
  isActive(): boolean {
    return this.isConnected && this.client !== null;
  }
}

/**
 * Create a singleton instance of the STOMP client
 */
let stompClient: ShuttleLocationClient | null = null;

/**
 * Get or create the STOMP client instance
 */
export function getStompClient(): ShuttleLocationClient {
  if (!stompClient) {
    stompClient = new ShuttleLocationClient();
  }
  return stompClient;
}

/**
 * Hook-friendly wrapper for using STOMP in React components
 * Example usage in a component:
 * 
 * const { subscribe, publish, connect, disconnect, isConnected } = useStompClient();
 * 
 * useEffect(() => {
 *   connect();
 *   return () => disconnect();
 * }, []);
 * 
 * useEffect(() => {
 *   if (isConnected) {
 *     const unsubscribe = subscribe(shuttleId, (location) => {
 *       console.log('Location update:', location);
 *     });
 *     return unsubscribe;
 *   }
 * }, [isConnected, shuttleId]);
 */
export function useStompClient() {
  const client = getStompClient();

  return {
    connect: () => client.connect(),
    disconnect: () => client.disconnect(),
    subscribe: (shuttleId: number, callback: (location: LocationBroadcastDto) => void) =>
      client.subscribeToShuttleLocation(shuttleId, callback),
    publish: (location: ShuttleLocationDto) => client.publishDriverLocation(location),
    isConnected: client.isActive(),
  };
}
