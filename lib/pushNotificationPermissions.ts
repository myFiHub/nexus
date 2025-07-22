"use client";

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
    console.log("Notification permission, fallback:", permission);

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

/**
 * Request push notification permissions from the user
 * @returns Promise<boolean> - true if permission was granted, false if denied
 */
export const requestPushNotificationPermission = async (): Promise<boolean> => {
  // Check if we're in a browser environment
  if (typeof navigator === "undefined") {
    console.warn("Not in browser environment");
    return false;
  }

  // Check if notifications are supported
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
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

  try {
    // Request permission directly
    const result = await Notification.requestPermission();
    console.log("Push notification permission request result:", result);

    if (result === "granted") {
      console.log("Push notification permission granted");
      return true;
    } else if (result === "denied") {
      console.warn("Push notification permission denied by user");
      return false;
    } else {
      console.warn("Push notification permission request was dismissed");
      return false;
    }
  } catch (error) {
    console.error("Error requesting push notification permission:", error);
    return false;
  }
};
