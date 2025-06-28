"use client";

/**
 * Check and request audio permissions using native browser APIs
 * @returns Promise<boolean> - true if permission is granted, false if denied
 */
export const checkAudioPermission = async (): Promise<boolean> => {
  // Check if we're in a browser environment
  if (typeof navigator === "undefined") {
    console.warn("Not in browser environment");
    return false;
  }

  // Check permission status if available
  if (navigator.permissions) {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      console.log("Microphone permission status:", permissionStatus.state);

      if (permissionStatus.state === "denied") {
        console.warn("Microphone permission is denied");
        return false;
      }

      if (permissionStatus.state === "granted") {
        return true;
      }
    } catch (error) {
      console.warn("Could not check microphone permission:", error);
    }
  }

  // Request permission using getUserMedia if available
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Audio permission granted, stream obtained");
      // Clean up the stream immediately since we just wanted to check/request permission
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      return true;
    } catch (error) {
      console.warn("Could not get audio permission:", error);
      if (error instanceof Error && error.name === "NotAllowedError") {
        console.warn("User denied audio permission");
        return false;
      }
      return false;
    }
  }

  console.warn("Audio permission APIs not available");
  return false;
};

/**
 * Request audio permissions from the user
 * @returns Promise<boolean> - true if permission was granted, false if denied
 */
export const requestAudioPermission = async (): Promise<boolean> => {
  // Check if we're in a browser environment
  if (typeof navigator === "undefined") {
    console.warn("Not in browser environment");
    return false;
  }

  // Check if getUserMedia is available
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn("getUserMedia not supported");
    return false;
  }

  try {
    // Request audio permission directly
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Audio permission granted, stream obtained");

    // Clean up the stream immediately since we just wanted to request permission
    stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());

    console.log("Audio permission request successful");
    return true;
  } catch (error) {
    console.error("Error requesting audio permission:", error);

    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        console.warn("Audio permission denied by user");
        return false;
      } else if (error.name === "NotFoundError") {
        console.warn("No audio device found");
        return false;
      } else if (error.name === "NotReadableError") {
        console.warn("Audio device is busy or not accessible");
        return false;
      } else if (error.name === "OverconstrainedError") {
        console.warn("Audio constraints not satisfied");
        return false;
      } else if (error.name === "TypeError") {
        console.warn("Invalid audio constraints");
        return false;
      }
    }

    return false;
  }
};

/**
 * Check push notification permissions using native browser APIs
 * @returns Promise<boolean> - true if permission is granted, false if denied
 */
export const checkPushNotificationPermission = async (): Promise<boolean> => {
  // Check if we're in a browser environment
  if (typeof navigator === "undefined") {
    console.warn("Not in browser environment");
    return false;
  }

  // Check if service workers are supported
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers not supported");
    return false;
  }

  // Check if push manager is available
  if (!("PushManager" in window)) {
    console.warn("Push notifications not supported");
    return false;
  }

  // Check permission status if available
  if (navigator.permissions) {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "notifications" as PermissionName,
      });
      console.log(
        "Push notification permission status:",
        permissionStatus.state
      );

      if (permissionStatus.state === "denied") {
        console.warn("Push notification permission is denied");
        return false;
      }

      if (permissionStatus.state === "granted") {
        return true;
      }
    } catch (error) {
      console.warn("Could not check push notification permission:", error);
    }
  }

  // Fallback: check notification permission directly
  if ("Notification" in window) {
    const permission = Notification.permission;
    console.log("Notification permission:", permission);

    if (permission === "denied") {
      console.warn("Push notification permission is denied");
      return false;
    }

    if (permission === "granted") {
      return true;
    }

    if (permission === "default") {
      // Request permission
      try {
        const result = await Notification.requestPermission();
        console.log("Notification permission request result:", result);
        return result === "granted";
      } catch (error) {
        console.warn("Could not request notification permission:", error);
        return false;
      }
    }
  }

  console.warn("Push notification APIs not available");
  return false;
};
