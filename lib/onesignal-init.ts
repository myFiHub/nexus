import {
  initializeOneSignal,
  loginToOneSignal,
  requestNotificationPermission,
  subscribeToNotifications,
} from "./onesignal";

export const initOneSignalForUser = async (userId?: string) => {
  try {
    console.log("initializing onesignal");
    // Step 1: Initialize OneSignal
    await initializeOneSignal();
    console.log("OneSignal initialized");
    const permission = await requestNotificationPermission();

    // Step 2: Request permission
    console.log("Permission result:", permission);

    if (permission) {
      // Step 3: Login user if ID provided
      if (userId) {
        await loginToOneSignal(userId);
        console.log("User logged in to OneSignal:", userId);
      }

      // Step 4: Subscribe to notifications
      const playerId = await subscribeToNotifications();
      console.log("Subscribed to notifications, Player ID:", playerId);

      return { success: true, playerId };
    } else {
      console.log("Notification permission denied");
      return { success: false, reason: "permission_denied" };
    }
  } catch (error) {
    console.error("Error initializing OneSignal:", error);
    return { success: false, reason: "error", error };
  }
};
