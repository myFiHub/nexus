import { ConnectionManager } from "./connectionManager";
import { JoinRequestManager } from "./joinRequestManager";
import { WebSocketMessageRouter } from "./messageRouter";
import {
  ConnectionState,
  ConnectionStatus,
  OutgoingMessage,
  OutgoingMessageType,
} from "./types";

const isDev = process.env.NODE_ENV === "development";

/**
 * WebSocketService manages the WebSocket connection for the application.
 * It handles connection, reconnection, message sending, and message receiving.
 */
export class WebSocketService {
  // Singleton instance
  private static _instance: WebSocketService | null = null;

  static get instance(): WebSocketService {
    if (!WebSocketService._instance) {
      WebSocketService._instance = new WebSocketService();
    }
    return WebSocketService._instance;
  }

  // Core components
  private readonly connectionManager = new ConnectionManager();
  private readonly joinManager = new JoinRequestManager();

  // Connection state
  private channel: WebSocket | null = null;
  private _connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private token = "";

  // Timers and subscriptions
  private pongTimer?: number;

  // Private constructor for singleton
  private constructor() {
    // Set up the join message sender
    this.joinManager.setSendJoinMessage(async (outpostId) => {
      return await this.send({
        message_type: OutgoingMessageType.JOIN,
        outpost_uuid: outpostId,
      });
    });
  }

  // Public getters
  get connectionState(): ConnectionState {
    return this._connectionState;
  }

  get isConnecting(): boolean {
    return this._connectionState === ConnectionState.CONNECTING;
  }

  get connected(): boolean {
    return this._connectionState === ConnectionState.CONNECTED;
  }

  get joinStream(): EventTarget {
    return this.joinManager.joinStream;
  }

  get connectionStatus(): ConnectionStatus {
    return {
      state: this._connectionState,
      isConnecting: this.isConnecting,
      connected: this.connected,
      hasChannel: this.channel !== null,
      hasToken: this.token.length > 0,
    };
  }

  // Public methods
  async connect(newToken: string, websocketAddress: string): Promise<boolean> {
    this.token = newToken;
    return await this.connectionManager.connect({
      token: this.token,
      updateConnectionState: this.updateConnectionState.bind(this),
      closeChannel: this.closeChannel.bind(this),
      setupPongTimer: this.setupPongTimer.bind(this),
      setupMessageListener: this.setupMessageListener.bind(this),
      setChannel: (channel) => (this.channel = channel),
      websocketAddress,
    });
  }

  async send(message: OutgoingMessage): Promise<boolean> {
    if (this._connectionState !== ConnectionState.CONNECTED || !this.channel) {
      if (!this.token) {
        if (isDev) {
          console.warn(
            "%c[WARN] Cannot send message: token is empty",
            "color: #FF9800; font-weight: bold;"
          );
        }
        return false;
      }

      if (isDev) {
        console.warn(
          "%c[WARN] Cannot send message: WebSocket not connected, attempting to reconnect",
          "color: #FF9800; font-weight: bold;"
        );
      }
      const reconnectSuccess = await this.reconnect();

      if (
        !reconnectSuccess ||
        this._connectionState !== ConnectionState.CONNECTED ||
        !this.channel
      ) {
        if (isDev) {
          console.error(
            "%c[ERROR] Failed to reconnect, cannot send message",
            "color: #F44336; font-weight: bold;"
          );
        }
        return false;
      }
    }

    try {
      const jsoned = message as any;
      if (!jsoned.data) jsoned.data = {};
      const stringified = JSON.stringify(jsoned);
      if (isDev) {
        console.log(
          `%c[DEBUG] Sending message: ${stringified}`,
          "color: #2196F3; font-weight: bold;"
        );
      }
      this.channel.send(stringified);
      if (isDev) {
        console.log(
          "%c[DEBUG] Message sent successfully",
          "color: #4CAF50; font-weight: bold;"
        );
      }
      return true;
    } catch (error) {
      if (isDev) {
        console.error(
          `%c[ERROR] Error sending message: ${error}`,
          "color: #F44336; font-weight: bold;"
        );
      }
      this.updateConnectionState(ConnectionState.DISCONNECTED);
      await this.reconnectWithRetry();
      return false;
    }
  }

  async asyncJoinOutpost(outpostId: string, force = false): Promise<boolean> {
    return this.joinManager.joinOutpost(outpostId, force);
  }

  async asyncJoinOutpostWithRetry(outpostId: string): Promise<boolean> {
    return this.joinManager.joinOutpostWithRetry(outpostId);
  }

  /**
   * Attempts to reconnect to the WebSocket server
   */
  async reconnect(): Promise<boolean> {
    return await this.connectionManager.reconnect({
      token: this.token,
      updateConnectionState: this.updateConnectionState.bind(this),
      cleanup: this.cleanup.bind(this),
      connect: () => this.connect(this.token, this.getWebSocketAddress()),
    });
  }

  /**
   * Attempts to reconnect to the WebSocket server with automatic retries
   */
  async reconnectWithRetry(): Promise<boolean> {
    return await this.connectionManager.reconnectWithRetry({
      token: this.token,
      updateConnectionState: this.updateConnectionState.bind(this),
      cleanup: this.cleanup.bind(this),
      connect: () => this.connect(this.token, this.getWebSocketAddress()),
    });
  }

  close(): void {
    this.token = "";
    this.cleanup();
  }

  forceResetConnection(): void {
    if (isDev) {
      console.warn(
        "%c[WARN] Force resetting connection state",
        "color: #FF9800; font-weight: bold;"
      );
    }
    this.connectionManager.reset();
    this.cleanup();
  }

  // Internal methods
  private updateConnectionState(newState: ConnectionState): void {
    const oldState = this._connectionState;
    this._connectionState = newState;
    if (isDev) {
      console.log(
        `%c[DEBUG] Connection state changed: ${oldState} -> ${newState}`,
        "color: #2196F3; font-weight: bold;"
      );
    }
  }

  private async closeChannel(): Promise<void> {
    if (this.channel) {
      try {
        this.channel.close();
      } catch (error) {
        if (isDev) {
          console.warn(
            `%c[WARN] Error closing existing channel: ${error}`,
            "color: #FF9800; font-weight: bold;"
          );
        }
      }
      this.channel = null;
    }
  }

  private cleanup(): void {
    if (this.pongTimer) {
      clearInterval(this.pongTimer);
      this.pongTimer = undefined;
    }

    this.closeChannel();
    this.updateConnectionState(ConnectionState.DISCONNECTED);
    this.joinManager.cleanup();
  }

  private setupPongTimer(): void {
    if (this.pongTimer) {
      clearInterval(this.pongTimer);
    }
    this.pong();
    this.pongTimer = window.setInterval(() => this.pong(), 10000); // 19 seconds
  }

  private setupMessageListener(): void {
    if (!this.channel) return;

    if (isDev) {
      console.log(
        "%c[DEBUG] Setting up message listener",
        "color: #2196F3; font-weight: bold;"
      );
    }

    this.channel.onmessage = (event) => {
      const messageStr = event.data.toString();
      if (isDev) {
        console.log(
          `%c[DEBUG] Received message: ${
            messageStr.length > 100
              ? `${messageStr.substring(0, 100)}...`
              : messageStr
          }`,
          "color: #2196F3; font-weight: bold;"
        );
      }
      this.handleIncomingMessageString(messageStr);
    };

    this.channel.onerror = (error) => {
      if (isDev) {
        console.error(
          `%c[ERROR] WebSocket Error: ${error}`,
          "color: #F44336; font-weight: bold;"
        );
      }
      this.updateConnectionState(ConnectionState.DISCONNECTED);
      setTimeout(() => this.reconnectWithRetry(), 0);
    };

    this.channel.onclose = () => {
      if (isDev) {
        console.warn(
          "%c[WARN] WebSocket connection closed",
          "color: #FF9800; font-weight: bold;"
        );
      }
      this.updateConnectionState(ConnectionState.DISCONNECTED);
      setTimeout(() => this.reconnectWithRetry(), 0);
    };

    if (isDev) {
      console.log(
        "%c[DEBUG] Message listener set up successfully",
        "color: #4CAF50; font-weight: bold;"
      );
    }
  }

  private handleIncomingMessageString(message: string): void {
    try {
      const jsoned = JSON.parse(message);
      if (jsoned.name === "error") {
        if (isDev) {
          console.error(
            `%c[ERROR] Error: ${jsoned.data?.message || "Unknown error"}`,
            "color: #F44336; font-weight: bold;"
          );
        }
        return;
      }
      WebSocketMessageRouter.routeMessage(jsoned);
    } catch (error) {
      if (isDev) {
        console.error(
          `%c[ERROR] Error parsing message: ${error}`,
          "color: #F44336; font-weight: bold;"
        );
      }
    }
  }

  private async pong(): Promise<void> {
    if (this._connectionState !== ConnectionState.CONNECTING && this.token) {
      if (this._connectionState === ConnectionState.CONNECTED && this.channel) {
        try {
          // Send pong frame (0x8A)
          this.channel.send(new Uint8Array([0x8a]));
        } catch (error) {
          if (isDev) {
            console.error(
              `%c[ERROR] Error sending pong: ${error}`,
              "color: #F44336; font-weight: bold;"
            );
          }
          this.updateConnectionState(ConnectionState.DISCONNECTED);
          await this.reconnectWithRetry();
        }
      } else {
        if (isDev) {
          console.warn(
            "%c[WARN] Not connected, attempting to reconnect before sending pong",
            "color: #FF9800; font-weight: bold;"
          );
        }
        await this.reconnectWithRetry();
      }
    }
  }

  // This method is called by the message router
  completeJoinRequest(joinId: string): void {
    this.joinManager.completeJoinRequest(joinId);
  }

  // Helper method to get WebSocket address
  private getWebSocketAddress(): string {
    // TODO: Replace with your actual WebSocket server configuration
    // You can use environment variables, config files, or any other method
    if (typeof window !== "undefined") {
      // Browser environment - use relative URL or environment variable
      return process.env.NEXT_PUBLIC_WEBSOCKET_ADDRESS!;
    } else {
      // Node.js environment
      return process.env.WEBSOCKET_URL || "wss://localhost:8080/ws";
    }
  }
}

export const wsClient = WebSocketService.instance;
