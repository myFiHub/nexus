import {
  getNotificationPermission,
  initializeOneSignal,
  isNotificationsSupported,
  loginToOneSignal,
  requestNotificationPermission,
  subscribeToNotifications,
} from "./onesignal";

export const initOneSignalForUser = async (userId?: string) => {
  try {
    console.log("Initializing OneSignal...");

    // Step 1: Check if notifications are supported
    const supported = await isNotificationsSupported();
    if (!supported) {
      console.warn("Notifications not supported in this browser");
      return { success: false, reason: "not_supported" };
    }

    // Step 2: Initialize OneSignal
    const initSuccess = await initializeOneSignal();
    if (!initSuccess) {
      console.error("Failed to initialize OneSignal");
      return { success: false, reason: "initialization_failed" };
    }

    console.log("OneSignal initialized successfully");

    // Step 3: Check current permission status
    const currentPermission = await getNotificationPermission();
    console.log("Current notification permission:", currentPermission);

    // Step 4: Request permission if not already granted
    let permission = currentPermission;
    if (currentPermission === "default") {
      const requestedPermission = await requestNotificationPermission();
      permission = requestedPermission ? "granted" : "denied";
      console.log("Permission request result:", permission);
    }

    if (permission === "granted") {
      // Step 5: Login user if ID provided
      if (userId) {
        const loginSuccess = await loginToOneSignal(userId);
        if (loginSuccess) {
          console.log("User logged in to OneSignal:", userId);
        } else {
          console.warn("Failed to login user to OneSignal");
        }
      }

      // Step 6: Subscribe to notifications and get player ID
      const playerId = await subscribeToNotifications();
      console.log("Subscribed to notifications, Player ID:", playerId);

      return {
        success: true,
        playerId,
        permission,
        userId,
      };
    } else {
      console.log("Notification permission denied or not granted");
      return {
        success: false,
        reason: "permission_denied",
        permission,
      };
    }
  } catch (error) {
    console.error("Error initializing OneSignal:", error);
    return {
      success: false,
      reason: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
