import { EasyAccess } from "app/containers/global/effects/quickAccess";
import { WebSocketService } from "./client";
import { isDev } from "app/lib/utils";

/**
 * Manages join requests and their lifecycle
 */
export class JoinRequestManager {
  private joinRequests = new Map<
    string,
    { resolve: (value: boolean) => void; reject: (reason?: any) => void }
  >();
  private joinSubject = new EventTarget();

  get joinStream(): EventTarget {
    return this.joinSubject;
  }

  generateJoinId(): string {
    const userAddress = EasyAccess.getInstance().myUser?.address;
    return `join-${userAddress}`;
  }

  async joinOutpost(outpostId: string, force = false): Promise<boolean> {
    // Check if already joined
    if (!force && this.isAlreadyJoined(outpostId)) {
      if (isDev) {
        console.log(
          `%c[DEBUG] Already joined outpost: ${outpostId}`,
          "color: #4CAF50; font-weight: bold;"
        );
      }
      return true;
    }

    const joinId = this.generateJoinId();
    if (isDev) {
      console.log(
        `%c[DEBUG] Starting async join for outpost: ${outpostId}, joinId: ${joinId}`,
        "color: #2196F3; font-weight: bold;"
      );
    }

    const timeoutDuration = this.getAdaptiveTimeout();
    if (isDev) {
      console.log(
        `%c[DEBUG] Setting join request timeout to ${
          timeoutDuration / 1000
        } seconds for outpost: ${outpostId}`,
        "color: #2196F3; font-weight: bold;"
      );
    }

    return new Promise<boolean>((resolve, reject) => {
      this.joinRequests.set(joinId, { resolve, reject });

      const timeout = setTimeout(() => {
        if (this.joinRequests.has(joinId)) {
          if (isDev) {
            console.warn(
              `%c[WARN] Join request timed out for outpost: ${outpostId} after ${
                timeoutDuration / 1000
              } seconds`,
              "color: #FF9800; font-weight: bold;"
            );
          }
          this.joinRequests.get(joinId)!.resolve(false);
          this.joinRequests.delete(joinId);
        } else {
          if (isDev) {
            console.log(
              `%c[DEBUG] Join request timeout fired but request was already completed for outpost: ${outpostId}`,
              "color: #4CAF50; font-weight: bold;"
            );
          }
        }
      }, timeoutDuration);

      // Send join message
      this.sendJoinMessage(outpostId)
        .then((success) => {
          if (!success) {
            if (isDev) {
              console.error(
                `%c[ERROR] Failed to send join message for outpost: ${outpostId}`,
                "color: #F44336; font-weight: bold;"
              );
            }
            clearTimeout(timeout);
            if (isDev) {
              console.log(
                `%c[DEBUG] Cancelled timeout due to send failure for outpost: ${outpostId}`,
                "color: #2196F3; font-weight: bold;"
              );
            }
            this.joinRequests.delete(joinId);
            resolve(false);
          } else {
            if (isDev) {
              console.log(
                "%c[DEBUG] Join message sent successfully, waiting for confirmation",
                "color: #4CAF50; font-weight: bold;"
              );
            }
            // The timeout will be cleared when the request is completed
          }
        })
        .catch((error) => {
          if (isDev) {
            console.error(
              `%c[ERROR] Error during join process for outpost: ${outpostId} - ${error}`,
              "color: #F44336; font-weight: bold;"
            );
          }
          clearTimeout(timeout);
          if (isDev) {
            console.log(
              `%c[DEBUG] Cancelled timeout due to error for outpost: ${outpostId}`,
              "color: #2196F3; font-weight: bold;"
            );
          }
          this.joinRequests.delete(joinId);
          resolve(false);
        });
    });
  }

  async joinOutpostWithRetry(outpostId: string): Promise<boolean> {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (isDev) {
        console.log(
          `%c[DEBUG] Attempting to join outpost (attempt ${attempt}/${maxRetries}): ${outpostId}`,
          "color: #2196F3; font-weight: bold;"
        );
      }

      try {
        const result = await this.joinOutpost(outpostId);
        if (result) {
          if (isDev) {
            console.log(
              `%c[DEBUG] Successfully joined outpost on attempt ${attempt}: ${outpostId}`,
              "color: #4CAF50; font-weight: bold;"
            );
          }
          return true;
        }

        if (attempt < maxRetries) {
          if (isDev) {
            console.warn(
              `%c[WARN] Failed to join outpost on attempt ${attempt}, retrying...`,
              "color: #FF9800; font-weight: bold;"
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        if (isDev) {
          console.error(
            `%c[ERROR] Error joining outpost on attempt ${attempt}: ${error}`,
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
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (isDev) {
      console.error(
        `%c[ERROR] Failed to join outpost after ${maxRetries} attempts: ${outpostId}`,
        "color: #F44336; font-weight: bold;"
      );
    }
    return false;
  }

  private isAlreadyJoined(outpostId: string): boolean {
    // TODO: Check if user is already in the outpost
    // This should check against your current outpost state
    return false;
  }

  completeJoinRequest(joinId: string): void {
    // Dispatch event for join stream
    const event = new CustomEvent("join", { detail: joinId });
    this.joinSubject.dispatchEvent(event);
    if (this.joinRequests.has(joinId)) {
      if (isDev) {
        console.log(
          `%c[DEBUG] Completing join request for: ${joinId}`,
          "color: #4CAF50; font-weight: bold;"
        );
      }
      this.joinRequests.get(joinId)!.resolve(true);
      this.joinRequests.delete(joinId);
    }
  }

  cleanup(): void {
    for (const [joinId, { resolve }] of this.joinRequests.entries()) {
      resolve(false);
    }
    this.joinRequests.clear();
  }

  // This will be injected by the WebSocketService
  private sendJoinMessage: (outpostId: string) => Promise<boolean> = async () =>
    false;

  setSendJoinMessage(
    sendFunction: (outpostId: string) => Promise<boolean>
  ): void {
    this.sendJoinMessage = sendFunction;
  }

  private getAdaptiveTimeout(): number {
    // Check if WebSocket is connected - if not, we might need more time for reconnection
    try {
      const wsClient = WebSocketService.instance;
      const isConnected = wsClient.connected;
      const isConnecting = wsClient.isConnecting;

      if (isDev) {
        console.log(
          `%c[DEBUG] WebSocket state - connected: ${isConnected}, connecting: ${isConnecting}`,
          "color: #2196F3; font-weight: bold;"
        );
      }

      if (isConnected) {
        if (isDev) {
          console.log(
            "%c[DEBUG] Using short timeout (5s) - WebSocket is connected",
            "color: #4CAF50; font-weight: bold;"
          );
        }
        return 5000; // Normal timeout if already connected
      } else if (isConnecting) {
        if (isDev) {
          console.log(
            "%c[DEBUG] Using medium timeout (15s) - WebSocket is connecting",
            "color: #FF9800; font-weight: bold;"
          );
        }
        return 15000; // Medium timeout if connecting
      } else {
        if (isDev) {
          console.log(
            "%c[DEBUG] Using long timeout (20s) - WebSocket needs reconnection",
            "color: #F44336; font-weight: bold;"
          );
        }
        return 20000; // Longer timeout if reconnection needed
      }
    } catch (error) {
      if (isDev) {
        console.warn(
          `%c[WARN] Could not determine WebSocket state, using default timeout: ${error}`,
          "color: #FF9800; font-weight: bold;"
        );
      }
      return 15000; // Default timeout
    }
  }
}
