import { globalActions } from "app/containers/global/slice";
import {
  NOTIFICATIONS_UPDATED,
  notificationsEventBus,
} from "app/containers/notifications/eventBus";
import { notificationsActions } from "app/containers/notifications/slice";
import { onGoingOutpostActions } from "app/containers/ongoingOutpost/slice";
import { AppPages } from "app/lib/routes";
import { toast } from "app/lib/toast";
import { isDev } from "app/lib/utils";
import { getStore } from "app/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { v4 as uuidv4 } from "uuid";
import podiumApi from "../api";
import {
  ConnectionState,
  ConnectionStatus,
  IncomingMessage,
  IncomingMessageType,
  OutgoingMessage,
  OutgoingMessageType,
} from "./types";

export type IncomingReactionType =
  | IncomingMessageType.USER_BOOED
  | IncomingMessageType.USER_CHEERED
  | IncomingMessageType.USER_DISLIKED
  | IncomingMessageType.USER_LIKED;

/**
 * Simplified WebSocket client that handles all WebSocket operations in one class
 */
export class WebSocketService {
  private static _instance: WebSocketService | null = null;

  // Connection state
  private socket: WebSocket | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private token: string = "";
  private websocketAddress: string = "";

  // Reconnection logic
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private reconnectTimer?: number;
  private connectionTimeout?: number;

  // Keep alive
  private pingTimer?: number;
  private readonly pingInterval = 30000; // 30 seconds

  // Join requests
  private joinRequests = new Map<
    string,
    { resolve: (success: boolean) => void; timeout: number }
  >();
  private readonly joinTimeout = 15000; // 15 seconds (increased)
  private joinQueue: Array<{
    outpostId: string;
    resolve: (success: boolean) => void;
    retryCount: number;
  }> = [];

  // Health check requests
  private healthCheckRequests = new Map<
    string,
    { resolve: (success: boolean) => void; timeout: number }
  >();
  private readonly healthCheckTimeout = 5000; // 5 seconds

  // Connection health
  private lastMessageReceived = 0;
  private connectionHealthy = false;

  // Toast management
  private connectionToastId?: string | number;

  private constructor() {}

  static get instance(): WebSocketService {
    if (!WebSocketService._instance) {
      WebSocketService._instance = new WebSocketService();
    }
    return WebSocketService._instance;
  }

  // Public getters
  get connected(): boolean {
    return this.connectionState === ConnectionState.CONNECTED;
  }

  get isConnecting(): boolean {
    return this.connectionState === ConnectionState.CONNECTING;
  }

  get connectionStatus(): ConnectionStatus {
    return {
      state: this.connectionState,
      isConnecting: this.isConnecting,
      connected: this.connected,
      hasChannel: this.socket !== null,
      hasToken: this.token.length > 0,
    };
  }

  get isHealthy(): boolean {
    return this.connectionHealthy && this.connected;
  }

  /**
   * Get detailed connection health information
   */
  getHealthInfo(): {
    connected: boolean;
    healthy: boolean;
    lastMessageAge: number;
    joinQueueLength: number;
    activeJoinRequests: number;
  } {
    const now = Date.now();
    return {
      connected: this.connected,
      healthy: this.connectionHealthy,
      lastMessageAge:
        this.lastMessageReceived > 0 ? now - this.lastMessageReceived : -1,
      joinQueueLength: this.joinQueue.length,
      activeJoinRequests: this.joinRequests.size,
    };
  }

  /**
   * Test connection health by checking if we can send messages
   */
  async testConnectionHealth(): Promise<boolean> {
    if (!this.isConnectionValid()) {
      return false;
    }

    try {
      // Simple test: if socket is open and we received messages recently, consider it healthy
      const timeSinceLastMessage = Date.now() - this.lastMessageReceived;

      // If we received a message in the last 2 minutes, connection is likely healthy
      if (timeSinceLastMessage < 120000) {
        this.connectionHealthy = true;
        if (isDev)
          console.log(
            "[WebSocket] Health check passed - recent message activity"
          );
        return true;
      }

      // If no recent messages, just check if socket is still open
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.connectionHealthy = true;
        if (isDev)
          console.log("[WebSocket] Health check passed - socket is open");
        return true;
      }

      this.connectionHealthy = false;
      if (isDev)
        console.warn("[WebSocket] Health check failed - socket not open");
      return false;
    } catch (error) {
      this.connectionHealthy = false;
      if (isDev) console.error(`[WebSocket] Health check error: ${error}`);
      return false;
    }
  }

  /**
   * Connect to WebSocket server
   */
  async connect(token: string, address?: string): Promise<boolean> {
    if (!token) {
      if (isDev) console.warn("[WebSocket] Cannot connect: token is empty");
      return false;
    }

    this.token = token;
    this.websocketAddress = address || this.getWebSocketAddress();

    if (this.connectionState === ConnectionState.CONNECTING) {
      if (isDev) console.log("[WebSocket] Already connecting, waiting...");
      return this.waitForConnection();
    }

    return this.performConnection();
  }

  /**
   * Send message to WebSocket server
   */
  async send(message: OutgoingMessage): Promise<boolean> {
    if (!this.isConnectionValid()) {
      if (isDev)
        console.warn(
          "[WebSocket] Connection invalid, attempting to reconnect..."
        );
      const reconnected = await this.reconnect();
      if (!reconnected) {
        if (isDev)
          console.error("[WebSocket] Failed to reconnect, cannot send message");
        return false;
      }
    }

    try {
      // Ensure message has a data field (server expects this)
      const messageWithData = { ...message } as any;
      if (!messageWithData.data) {
        messageWithData.data = {};
      }

      const payload = JSON.stringify(messageWithData);
      this.socket!.send(payload);
      if (isDev) console.log(`[WebSocket] Sent: ${payload}`);
      return true;
    } catch (error) {
      if (isDev) console.error(`[WebSocket] Send error: ${error}`);
      this.handleConnectionError();
      return false;
    }
  }

  /**
   * Async join outpost with timeout and retry
   */
  async asyncJoinOutpost(outpostId: string, force = false): Promise<boolean> {
    const isAlreadyJoined = await this.isAlreadyJoined(outpostId);
    if (!force && isAlreadyJoined) {
      if (isDev)
        console.log(`[WebSocket] Already joined outpost: ${outpostId}`);
      return true;
    }

    const joinId = this.generateJoinId(outpostId);
    if (isDev)
      console.log(`[WebSocket] Joining outpost: ${outpostId} (${joinId})`);

    return new Promise<boolean>((resolve) => {
      // Set up timeout
      const timeoutId = window.setTimeout(() => {
        if (this.joinRequests.has(joinId)) {
          if (isDev) console.warn(`[WebSocket] Join timeout for: ${outpostId}`);
          this.joinRequests.delete(joinId);
          resolve(false);
        }
      }, this.joinTimeout);

      // Store request
      this.joinRequests.set(joinId, { resolve, timeout: timeoutId });

      // Send join message
      this.send({
        message_type: OutgoingMessageType.JOIN,
        outpost_uuid: outpostId,
      }).then((success) => {
        if (!success) {
          clearTimeout(timeoutId);
          this.joinRequests.delete(joinId);
          resolve(false);
        }
      });
    });
  }

  /**
   * Most reliable join method - recommended for all outpost joins
   * Uses health checking and intelligent retry logic
   */
  async asyncJoin(outpostId: string): Promise<boolean> {
    if (isDev)
      console.log(`[WebSocket] Reliable join requested for: ${outpostId}`);

    // Step 1: Ensure connection is established
    if (!this.connected) {
      if (isDev)
        console.log("[WebSocket] Not connected, attempting to connect...");
      if (this.token) {
        const connected = await this.reconnect();
        if (!connected) {
          if (isDev)
            console.error("[WebSocket] Failed to establish connection");
          return false;
        }
      } else {
        if (isDev)
          console.error("[WebSocket] No token available for connection");
        return false;
      }
    }

    // Step 2: Verify connection health
    if (isDev) console.log("[WebSocket] Testing connection health...");
    const isHealthy = await this.testConnectionHealth();
    if (!isHealthy) {
      if (isDev)
        console.warn(
          "[WebSocket] Connection unhealthy, attempting to reconnect..."
        );
      const reconnected = await this.reconnect();
      if (!reconnected) {
        if (isDev)
          console.error("[WebSocket] Failed to reconnect for reliable join");
        return false;
      }

      // Test health again after reconnection
      const isHealthyAfterReconnect = await this.testConnectionHealth();
      if (!isHealthyAfterReconnect) {
        if (isDev)
          console.error(
            "[WebSocket] Connection still unhealthy after reconnect"
          );
        return false;
      }
    }

    // Step 3: Attempt to join with retry
    if (isDev)
      console.log(
        "[WebSocket] Connection verified healthy, attempting join..."
      );
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (isDev)
        console.log(
          `[WebSocket] Reliable join attempt ${attempt}/${maxAttempts}`
        );

      const success = await this.asyncJoinOutpost(outpostId);
      if (success) {
        if (isDev)
          console.log(`[WebSocket] Reliable join successful for: ${outpostId}`);
        return true;
      }

      if (attempt < maxAttempts) {
        // Test health before retry
        const stillHealthy = await this.testConnectionHealth();
        if (!stillHealthy) {
          if (isDev)
            console.warn(
              "[WebSocket] Connection became unhealthy during join, reconnecting..."
            );
          await this.reconnect();
        }

        // Progressive delay between attempts
        const delay = Math.min(1000 * attempt, 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (isDev)
      console.error(
        `[WebSocket] Reliable join failed after ${maxAttempts} attempts`
      );
    return false;
  }

  /**
   * Health check method that sends an echo message and waits for response
   * Retries up to 2 times (3 total attempts) with 5-second timeout
   */
  async healthCheck(): Promise<boolean> {
    if (isDev) console.log("[WebSocket] Health check requested");

    // Step 1: Ensure connection is established
    if (!this.connected) {
      if (isDev)
        console.log("[WebSocket] Not connected, attempting to connect...");
      if (this.token) {
        const connected = await this.reconnect();
        if (!connected) {
          if (isDev)
            console.error(
              "[WebSocket] Failed to establish connection for health check"
            );
          return false;
        }
      } else {
        if (isDev)
          console.error("[WebSocket] No token available for connection");
        return false;
      }
    }

    // Step 2: Attempt health check with retry (max 3 attempts)
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (isDev)
        console.log(
          `[WebSocket] Health check attempt ${attempt}/${maxAttempts}`
        );

      const success = await this.performHealthCheck();
      if (success) {
        if (isDev) console.log(`[WebSocket] Health check successful`);
        return true;
      }

      if (attempt < maxAttempts) {
        // Test connection before retry
        if (!this.isConnectionValid()) {
          if (isDev)
            console.warn(
              "[WebSocket] Connection became invalid during health check, reconnecting..."
            );
          await this.reconnect();
        }

        // Progressive delay between attempts
        const delay = Math.min(1000 * attempt, 3000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (isDev)
      console.error(
        `[WebSocket] Health check failed after ${maxAttempts} attempts`
      );
    return false;
  }

  /**
   * Perform a single health check attempt
   */
  private async performHealthCheck(): Promise<boolean> {
    // Verify connection is valid
    if (!this.isConnectionValid()) {
      if (isDev)
        console.warn("[WebSocket] Connection invalid for health check");
      return false;
    }

    // Generate unique UUID for this health check
    const healthCheckId = uuidv4();
    if (isDev) console.log(`[WebSocket] Health check ID: ${healthCheckId}`);

    return new Promise<boolean>((resolve) => {
      // Set up timeout
      const timeoutId = window.setTimeout(() => {
        if (this.healthCheckRequests.has(healthCheckId)) {
          if (isDev)
            console.warn(`[WebSocket] Health check timeout: ${healthCheckId}`);
          this.healthCheckRequests.delete(healthCheckId);
          resolve(false);
        }
      }, this.healthCheckTimeout);

      // Store request
      this.healthCheckRequests.set(healthCheckId, {
        resolve,
        timeout: timeoutId,
      });

      // Send echo message
      this.send({
        message_type: OutgoingMessageType.ECHO,
        outpost_uuid: "00000000-0000-0000-0000-000000000000", // Not needed for health check
        data: { uuid: healthCheckId } as any,
      }).then((success) => {
        if (!success) {
          clearTimeout(timeoutId);
          this.healthCheckRequests.delete(healthCheckId);
          resolve(false);
        }
      });
    });
  }

  /**
   * Close connection and cleanup
   */
  close(): void {
    if (isDev) console.log("[WebSocket] Closing connection");
    this.cleanup();
    this.token = "";
    this.websocketAddress = "";
  }

  /**
   * Force reset connection
   */
  forceResetConnection(): void {
    if (isDev) console.warn("[WebSocket] Force reset connection");
    this.reconnectAttempts = 0;
    this.cleanup();
    this.dismissConnectionToast();
  }

  // Internal methods
  private async performConnection(): Promise<boolean> {
    this.updateConnectionState(ConnectionState.CONNECTING);

    try {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }

      const uri = `${this.websocketAddress}?token=${this.token}`;
      this.socket = new WebSocket(uri);

      return new Promise<boolean>((resolve) => {
        const connectionTimeout = setTimeout(() => {
          if (isDev) console.error("[WebSocket] Connection timeout");
          this.handleConnectionError();
          resolve(false);
        }, 15000);

        this.socket!.onopen = () => {
          clearTimeout(connectionTimeout);
          this.updateConnectionState(ConnectionState.CONNECTED);
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.connectionHealthy = true; // Initially healthy
          this.lastMessageReceived = Date.now();
          this.setupPingTimer();
          this.processJoinQueue();
          this.dismissConnectionToast();
          if (isDev) console.log("[WebSocket] Connected successfully");
          resolve(true);
        };

        this.socket!.onerror = (error) => {
          clearTimeout(connectionTimeout);
          if (isDev) console.error(`[WebSocket] Connection error: ${error}`);
          this.handleConnectionError();
          resolve(false);
        };

        this.socket!.onmessage = (event) => {
          // Update health tracking
          this.lastMessageReceived = Date.now();
          this.connectionHealthy = true; // Any message means connection is healthy

          this.handleMessage(event.data);
        };

        this.socket!.onclose = () => {
          if (isDev) console.warn("[WebSocket] Connection closed", new Date());
          this.handleConnectionError();
        };
      });
    } catch (error) {
      if (isDev) console.error(`[WebSocket] Connection error: ${error}`);
      this.handleConnectionError();
      return false;
    }
  }

  private async waitForConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (this.connected) {
          resolve(true);
        } else if (this.connectionState === ConnectionState.DISCONNECTED) {
          resolve(false);
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  private async reconnect(): Promise<boolean> {
    if (this.connectionState === ConnectionState.CONNECTING) {
      return this.waitForConnection();
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (isDev) console.error("[WebSocket] Max reconnection attempts reached");
      this.showConnectionError();
      return false;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    if (isDev)
      console.log(
        `[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return this.performConnection();
  }

  private handleConnectionError(): void {
    this.updateConnectionState(ConnectionState.DISCONNECTED);
    this.clearTimers();

    // Auto-reconnect after a delay
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = window.setTimeout(() => {
      if (this.token && this.connectionState === ConnectionState.DISCONNECTED) {
        this.reconnect();
      }
    }, 2000);
  }

  private handleMessage(data: string): void {
    try {
      const rawMessage = JSON.parse(data);

      if (isDev) console.log(`[WebSocket] Received: ${rawMessage.name}`);

      // Handle server error messages
      if (rawMessage.name === "error") {
        if (isDev)
          console.error(
            `[WebSocket] Server error: ${
              rawMessage.data?.message || "Unknown error"
            }`
          );
        return;
      }

      // Type-safe message handling
      const message = rawMessage as IncomingMessage;
      this.routeMessage(message);
    } catch (error) {
      if (isDev) console.error(`[WebSocket] Message parsing error: ${error}`);
    }
  }

  private routeMessage(message: IncomingMessage): void {
    const store = getStore();

    switch (message.name) {
      case IncomingMessageType.USER_JOINED:
        this.handleUserJoined(message, store);
        break;
      case IncomingMessageType.USER_LEFT:
        this.handleUserLeft(message, store);
        break;
      case IncomingMessageType.REMAINING_TIME_UPDATED:
        store.dispatch(
          onGoingOutpostActions.updateRemainingTime({
            userAddress: message.data.address!,
            remainingTime: message.data.remaining_time!,
          })
        );
        break;
      case IncomingMessageType.USER_STARTED_SPEAKING:
      case IncomingMessageType.USER_STOPPED_SPEAKING:
        store.dispatch(
          onGoingOutpostActions.updateUserIsTalking({
            userAddress: message.data.address!,
            isTalking:
              message.name === IncomingMessageType.USER_STARTED_SPEAKING,
          })
        );
        break;
      case IncomingMessageType.USER_LIKED:
      case IncomingMessageType.USER_DISLIKED:
      case IncomingMessageType.USER_BOOED:
      case IncomingMessageType.USER_CHEERED:
        store.dispatch(
          onGoingOutpostActions.incomingUserReaction({
            userAddress: message.data.react_to_user_address!,
            reaction: message.name as IncomingReactionType,
          })
        );
        break;
      case IncomingMessageType.TIME_IS_UP:
        store.dispatch(
          onGoingOutpostActions.handleTimeIsUp({
            userAddress: message.data.address!,
          })
        );
        break;
      case IncomingMessageType.USER_INVITED:
      case IncomingMessageType.USER_FOLLOWED:
        notificationsEventBus.next(NOTIFICATIONS_UPDATED);
        store.dispatch(notificationsActions.getNotifications());
        break;
      case IncomingMessageType.WAITLIST_UPDATED:
        store.dispatch(onGoingOutpostActions.getLiveMembers({ silent: true }));
        break;
      case IncomingMessageType.CREATOR_JOINED:
        const currentOutpost = store.getState().onGoingOutpost.outpost;
        if (message.data.outpost_uuid === currentOutpost?.uuid) {
          store.dispatch(onGoingOutpostActions.setCreatorJoined(true));
        }
        break;
      case IncomingMessageType.USER_STARTED_RECORDING:
      case IncomingMessageType.USER_STOPPED_RECORDING:
        store.dispatch(
          onGoingOutpostActions.setIsRecording(
            message.name === IncomingMessageType.USER_STARTED_RECORDING
          )
        );
        break;
      case IncomingMessageType.MESSAGE_ECHOED:
        this.handleMessageEchoed(message);
        break;
    }
  }

  private handleUserJoined(message: IncomingMessage, store: any): void {
    const myUser = store.getState().global.podiumUserInfo!;
    const myUserAddress = myUser.address;

    if (message.data.address === myUserAddress) {
      console.log("user joined!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! from ws");
      const joinId = this.generateJoinId(message.data.outpost_uuid!);
      const store = getStore();
      const router: AppRouterInstance | undefined =
        store.getState().global.router;

      this.completeJoinRequest({
        joinId,
      });

      if (router) {
        router.push(AppPages.ongoingOutpost(message.data.outpost_uuid!));
        setTimeout(() => {
          store.dispatch(
            onGoingOutpostActions.getLiveMembers({ silent: true })
          );
        }, 5000);
      }
    }
  }

  private handleUserLeft(message: IncomingMessage, store: any): void {
    const myUser = store.getState().global.podiumUserInfo!;
    if (message.data.address !== myUser.address) {
      store.dispatch(onGoingOutpostActions.getLiveMembers({ silent: true }));
    }
  }

  private handleMessageEchoed(message: IncomingMessage): void {
    const healthCheckId = message.data.uuid;
    if (healthCheckId) {
      if (isDev) console.log(`[WebSocket] Message echoed: ${healthCheckId}`);
      this.completeHealthCheckRequest(healthCheckId);
    }
  }

  private completeJoinRequest({ joinId }: { joinId: string }): void {
    const request = this.joinRequests.get(joinId);
    if (request) {
      if (isDev) console.log(`[WebSocket] Join completed: ${joinId}`);
      clearTimeout(request.timeout);
      request.resolve(true);
      this.joinRequests.delete(joinId);
    }
  }

  private completeHealthCheckRequest(healthCheckId: string): void {
    const request = this.healthCheckRequests.get(healthCheckId);
    if (request) {
      if (isDev)
        console.log(`[WebSocket] Health check completed: ${healthCheckId}`);
      clearTimeout(request.timeout);
      request.resolve(true);
      this.healthCheckRequests.delete(healthCheckId);
    }
  }

  private generateJoinId(outpostId: string): string {
    const store = getStore();
    const myUser = store.getState().global.podiumUserInfo!;
    return `join-${myUser.address}-${outpostId}`;
  }

  private async isAlreadyJoined(outpostId: string): Promise<boolean> {
    try {
      const store = getStore();
      const myUser = store.getState().global.podiumUserInfo!;
      const liveData = await podiumApi.getLatestLiveData(outpostId);
      if (!liveData) {
        return false;
      }
      const { members } = liveData;
      const memberKeys = members.map((member) => member.address);
      if (memberKeys.length > 0) {
        if (memberKeys.includes(myUser.address)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      if (isDev)
        console.warn(`[WebSocket] Error checking join status: ${error}`);
      return false; // Default to false if we can't check
    }
  }

  private isConnectionValid(): boolean {
    return (
      this.socket !== null &&
      this.socket.readyState === WebSocket.OPEN &&
      this.connectionState === ConnectionState.CONNECTED
    );
  }

  private updateConnectionState(newState: ConnectionState): void {
    this.connectionState = newState;
    const store = getStore();

    store.dispatch(
      globalActions.setWsConnectionStatus({
        state: newState,
        isConnecting: this.isConnecting,
        connected: this.connected,
        hasChannel: this.socket !== null,
        hasToken: this.token.length > 0,
      })
    );

    if (isDev) console.log(`[WebSocket] State changed to: ${newState}`);
  }

  private setupPingTimer(): void {
    this.clearPingTimer();
    this.pingTimer = window.setInterval(() => {
      if (this.isConnectionValid()) {
        this.pong();
      }
    }, this.pingInterval);
  }

  private processJoinQueue(): void {
    if (this.joinQueue.length === 0) return;

    if (isDev)
      console.log(
        `[WebSocket] Processing ${this.joinQueue.length} queued join requests`
      );

    const queuedJoins = [...this.joinQueue];
    this.joinQueue = [];

    queuedJoins.forEach(async (queuedJoin) => {
      try {
        const success = await this.asyncJoinOutpost(queuedJoin.outpostId);
        queuedJoin.resolve(success);
      } catch (error) {
        if (isDev)
          console.error(`[WebSocket] Error processing queued join: ${error}`);
        queuedJoin.resolve(false);
      }
    });
  }

  private clearTimers(): void {
    this.clearPingTimer();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = undefined;
    }
  }

  private clearPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = undefined;
    }
  }

  private cleanup(): void {
    this.clearTimers();

    // Close socket
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // Clear join requests
    this.joinRequests.forEach((request) => {
      clearTimeout(request.timeout);
      request.resolve(false);
    });
    this.joinRequests.clear();

    // Clear health check requests
    this.healthCheckRequests.forEach((request) => {
      clearTimeout(request.timeout);
      request.resolve(false);
    });
    this.healthCheckRequests.clear();

    // Clear join queue
    this.joinQueue.forEach((queuedJoin) => {
      queuedJoin.resolve(false);
    });
    this.joinQueue = [];

    // Reset health status
    this.connectionHealthy = false;
    this.lastMessageReceived = 0;

    this.updateConnectionState(ConnectionState.DISCONNECTED);
  }

  private showConnectionError(): void {
    if (this.connectionToastId) {
      toast.dismiss(this.connectionToastId);
    }

    this.connectionToastId = toast.error(
      "Connection lost. Check your internet connection.",
      {
        permanent: true,
        action: {
          label: "Reload",
          onClick: () => window.location.reload(),
        },
      }
    );
  }

  private dismissConnectionToast(): void {
    if (this.connectionToastId) {
      toast.dismiss(this.connectionToastId);
      this.connectionToastId = undefined;
    }
  }

  private getWebSocketAddress(): string {
    const address = process.env.NEXT_PUBLIC_WEBSOCKET_ADDRESS;
    if (!address) {
      throw new Error(
        "NEXT_PUBLIC_WEBSOCKET_ADDRESS environment variable is not set"
      );
    }
    return address;
  }

  private async pong(): Promise<void> {
    if (this.connectionState !== ConnectionState.CONNECTING && this.token) {
      if (this.isConnectionValid()) {
        try {
          // Send pong frame (0x8A)
          this.socket!.send(new Uint8Array([0x8a]));
        } catch (error) {
          if (isDev) {
            console.error(
              `%c[ERROR] Error sending pong: ${error}`,
              "color: #F44336; font-weight: bold;"
            );
          }
          this.updateConnectionState(ConnectionState.DISCONNECTED);
          await this.reconnect();
        }
      } else if (this.token) {
        if (isDev) {
          console.warn(
            "%c[WARN] Not connected, attempting to reconnect before sending pong",
            "color: #FF9800; font-weight: bold;"
          );
        }
        await this.reconnect();
      }
    }
  }
}

export const wsClient = WebSocketService.instance;
