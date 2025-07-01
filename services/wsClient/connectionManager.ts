import { toast } from "app/lib/toast";
import { isDev } from "app/lib/utils";
import { Lock } from "./lock";
import { ConnectionState } from "./types";

/**
 * Manages connection lifecycle and reconnection logic
 */
export class ConnectionManager {
  private static readonly MAX_RECONNECT_ATTEMPTS = 20;
  private static readonly INITIAL_RECONNECT_DELAY = 1000; // 1 second
  private static readonly MAX_RECONNECT_DELAY = 5000; // 5 seconds
  private static readonly CONNECTION_TIMEOUT = 30000; // 30 seconds
  private static toastId: string | number = 0;
  private reconnectAttempts = 0;
  private connectionTimeoutTimer?: number;
  private readonly connectionLock = new Lock();

  private getReconnectDelay(): number {
    if (this.reconnectAttempts >= ConnectionManager.MAX_RECONNECT_ATTEMPTS) {
      return ConnectionManager.MAX_RECONNECT_DELAY;
    }

    const exponentialDelay =
      ConnectionManager.INITIAL_RECONNECT_DELAY * (1 << this.reconnectAttempts);
    const jitter = Math.floor(exponentialDelay * 0.1 * (Date.now() % 10));
    const delay = exponentialDelay + jitter;

    return delay > ConnectionManager.MAX_RECONNECT_DELAY
      ? ConnectionManager.MAX_RECONNECT_DELAY
      : delay;
  }

  async connect(params: {
    token: string;
    updateConnectionState: (state: ConnectionState) => void;
    closeChannel: () => Promise<void>;
    setupPongTimer: () => void;
    setupMessageListener: () => void;
    setChannel: (channel: WebSocket) => void;
    websocketAddress: string;
  }): Promise<boolean> {
    try {
      params.updateConnectionState(ConnectionState.CONNECTING);
      if (isDev) {
        console.log(
          `%c[DEBUG] Starting connection attempt #${
            this.reconnectAttempts + 1
          }`,
          "color: #4CAF50; font-weight: bold;"
        );
      }

      // Close existing connection
      await params.closeChannel();

      // Set up timeout
      this.setupConnectionTimeout(params.updateConnectionState);

      // Connect
      const uri = `${params.websocketAddress}?token=${params.token}`;
      if (isDev) {
        console.log(
          `%c[DEBUG] Connecting to WebSocket at ${uri.replace(
            params.token,
            "***"
          )}`,
          "color: #2196F3; font-weight: bold;"
        );
      }

      const channel = new WebSocket(uri);

      return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          if (isDev) {
            console.error(
              "%c[ERROR] Connection timeout",
              "color: #F44336; font-weight: bold;"
            );
          }
          params.updateConnectionState(ConnectionState.DISCONNECTED);
          if (ConnectionManager.toastId) {
            ConnectionManager.toastId = toast.error("check your connection", {
              permanent: true,
            });
          }
          resolve(false);
        }, ConnectionManager.CONNECTION_TIMEOUT);

        channel.onopen = () => {
          clearTimeout(timeout);
          if (this.connectionTimeoutTimer) {
            clearTimeout(this.connectionTimeoutTimer);
            this.connectionTimeoutTimer = undefined;
          }
          params.updateConnectionState(ConnectionState.CONNECTED);
          this.reconnectAttempts = 0;
          if (isDev) {
            console.log(
              `%c[DEBUG] Connected to websocket: ${channel.readyState}`,
              "color: #4CAF50; font-weight: bold;"
            );
          }

          params.setChannel(channel);
          params.setupPongTimer();
          params.setupMessageListener();
          toast.dismiss(ConnectionManager.toastId);
          ConnectionManager.toastId = 0;
          resolve(true);
        };

        channel.onerror = (error) => {
          clearTimeout(timeout);
          if (isDev) {
            console.error(
              `%c[ERROR] Error connecting to websocket: ${error}`,
              "color: #F44336; font-weight: bold;"
            );
          }
          if (this.connectionTimeoutTimer) {
            clearTimeout(this.connectionTimeoutTimer);
            this.connectionTimeoutTimer = undefined;
          }
          params.updateConnectionState(ConnectionState.DISCONNECTED);
          resolve(false);
        };
      });
    } catch (error) {
      if (isDev) {
        console.error(
          `%c[ERROR] Error connecting to websocket: ${error}`,
          "color: #F44336; font-weight: bold;"
        );
      }
      if (this.connectionTimeoutTimer) {
        clearTimeout(this.connectionTimeoutTimer);
        this.connectionTimeoutTimer = undefined;
      }
      params.updateConnectionState(ConnectionState.DISCONNECTED);
      return false;
    }
  }

  private setupConnectionTimeout(
    updateConnectionState: (state: ConnectionState) => void
  ): void {
    if (this.connectionTimeoutTimer) {
      clearTimeout(this.connectionTimeoutTimer);
    }
    this.connectionTimeoutTimer = window.setTimeout(() => {
      updateConnectionState(ConnectionState.DISCONNECTED);
    }, ConnectionManager.CONNECTION_TIMEOUT);
  }

  async reconnect(params: {
    token: string;
    updateConnectionState: (state: ConnectionState) => void;
    cleanup: () => void;
    connect: () => Promise<boolean>;
  }): Promise<boolean> {
    if (!params.token) {
      if (isDev) {
        console.warn(
          "%c[WARN] Cannot reconnect: token is empty",
          "color: #FF9800; font-weight: bold;"
        );
      }
      return false;
    }

    if (this.reconnectAttempts >= ConnectionManager.MAX_RECONNECT_ATTEMPTS) {
      if (isDev) {
        console.error(
          "%c[ERROR] Max reconnection attempts reached. Please check your connection.",
          "color: #F44336; font-weight: bold;"
        );
      }
      // TODO: Show toast error message
      return false;
    }

    const delay = this.getReconnectDelay();
    if (isDev) {
      console.log(
        `%c[DEBUG] Attempting to reconnect in ${
          delay / 1000
        } seconds (attempt ${this.reconnectAttempts + 1}/${
          ConnectionManager.MAX_RECONNECT_ATTEMPTS
        })`,
        "color: #2196F3; font-weight: bold;"
      );
    }
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.connectionLock.synchronized(async () => {
      if (this.reconnectAttempts >= ConnectionManager.MAX_RECONNECT_ATTEMPTS) {
        if (isDev) {
          console.error(
            "%c[ERROR] Max reconnection attempts reached while waiting for lock",
            "color: #F44336; font-weight: bold;"
          );
        }
        return false;
      }

      if (isDev) {
        console.warn(
          "%c[WARN] WebSocket closed, reconnecting...",
          "color: #FF9800; font-weight: bold;"
        );
      }
      params.updateConnectionState(ConnectionState.CONNECTING);
      params.cleanup();

      try {
        this.reconnectAttempts++;
        if (isDev) {
          console.log(
            `%c[DEBUG] Starting reconnection attempt #${this.reconnectAttempts}`,
            "color: #2196F3; font-weight: bold;"
          );
        }
        const success = await params.connect();

        if (success) {
          if (isDev) {
            console.log(
              `%c[DEBUG] Reconnection attempt #${this.reconnectAttempts} succeeded`,
              "color: #4CAF50; font-weight: bold;"
            );
          }
          toast.dismiss(ConnectionManager.toastId);
          ConnectionManager.toastId = 0;
          return true;
        } else {
          if (isDev) {
            console.warn(
              `%c[WARN] Connection attempt #${this.reconnectAttempts} failed`,
              "color: #FF9800; font-weight: bold;"
            );
          }
          params.updateConnectionState(ConnectionState.DISCONNECTED);
          return false;
        }
      } catch (error) {
        if (isDev) {
          console.error(
            `%c[ERROR] Error during reconnection attempt #${this.reconnectAttempts}: ${error}`,
            "color: #F44336; font-weight: bold;"
          );
        }
        params.updateConnectionState(ConnectionState.DISCONNECTED);
        return false;
      }
    });
  }

  async reconnectWithRetry(params: {
    token: string;
    updateConnectionState: (state: ConnectionState) => void;
    cleanup: () => void;
    connect: () => Promise<boolean>;
  }): Promise<boolean> {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (isDev) {
        console.log(
          `%c[DEBUG] Reconnection attempt ${attempt}/${maxRetries}`,
          "color: #2196F3; font-weight: bold;"
        );
      }

      try {
        const success = await this.reconnect(params);
        if (success) {
          if (isDev) {
            console.log(
              `%c[DEBUG] Reconnection succeeded on attempt ${attempt}`,
              "color: #4CAF50; font-weight: bold;"
            );
          }
          toast.dismiss(ConnectionManager.toastId);
          ConnectionManager.toastId = 0;
          return true;
        }

        if (attempt < maxRetries) {
          if (isDev) {
            console.warn(
              `%c[WARN] Reconnection attempt ${attempt} failed, will retry...`,
              "color: #FF9800; font-weight: bold;"
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        if (isDev) {
          console.error(
            `%c[ERROR] Error during reconnection attempt ${attempt}: ${error}`,
            "color: #F44336; font-weight: bold;"
          );
        }
        if (attempt >= maxRetries) {
          if (isDev) {
            console.error(
              "%c[ERROR] Max retry attempts reached, giving up",
              "color: #F44336; font-weight: bold;"
            );
          }
          ConnectionManager.toastId = toast.error("check your connection", {
            permanent: true,
          });
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (isDev) {
      console.error(
        `%c[ERROR] Failed to reconnect after ${maxRetries} attempts`,
        "color: #F44336; font-weight: bold;"
      );
    }
    return false;
  }

  reset(): void {
    this.reconnectAttempts = 0;
    if (this.connectionTimeoutTimer) {
      clearTimeout(this.connectionTimeoutTimer);
      this.connectionTimeoutTimer = undefined;
    }
  }
}
