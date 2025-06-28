import OneSignal from "react-onesignal";

// OneSignal App ID - Replace with your actual App ID from OneSignal dashboard
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
const isDev = process.env.NODE_ENV === "development";

export const initializeOneSignal = async () => {
  try {
    // Initialize OneSignal with the app ID
    await OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: isDev, // For development
      serviceWorkerParam: {
        scope: "/",
      },
      serviceWorkerPath: "/OneSignalSDKWorker.js",
      // Enable automatic prompt for better UX
      autoPrompt: false, // We'll handle permission manually
      // Add subdomain if using OneSignal subdomain
      // subdomainName: "your-subdomain",
    });

    console.log("OneSignal initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing OneSignal:", error);
    return false;
  }
};

export const subscribeToNotifications = async () => {
  try {
    // Get the user's OneSignal ID (correct API for v3.2.3)
    const playerId = await OneSignal.User.onesignalId;
    console.log("OneSignal Player ID:", playerId);
    return playerId;
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return null;
  }
};

// Set user's external ID (your app's user UUID) - Updated API
export const loginToOneSignal = async (externalUserId: string) => {
  try {
    await OneSignal.login(externalUserId);
    console.log("User external ID set:", externalUserId);
    return true;
  } catch (error) {
    console.error("Error setting user external ID:", error);
    return false;
  }
};

// Set user's email - Updated API
export const setUserEmail = async (email: string) => {
  try {
    await OneSignal.User.addEmail(email);
    console.log("User email set:", email);
    return true;
  } catch (error) {
    console.error("Error setting user email:", error);
    return false;
  }
};

// Set user properties/tags - Updated API
export const setUserProperties = async (properties: Record<string, any>) => {
  try {
    await OneSignal.User.addTags(properties);
    console.log("User properties set:", properties);
    return true;
  } catch (error) {
    console.error("Error setting user properties:", error);
    return false;
  }
};

// Get user's OneSignal ID - Updated API
export const getOneSignalUserId = async () => {
  try {
    return await OneSignal.User.onesignalId;
  } catch (error) {
    console.error("Error getting OneSignal user ID:", error);
    return null;
  }
};

// Get user's external ID - Updated API
export const getExternalUserId = async () => {
  try {
    return await OneSignal.User.externalId;
  } catch (error) {
    console.error("Error getting external user ID:", error);
    return null;
  }
};

// Get notification permission status - Updated API
export const getNotificationPermission = async () => {
  try {
    return await OneSignal.Notifications.permission;
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return "default";
  }
};

// Check if notifications are supported
export const isNotificationsSupported = async () => {
  try {
    // Check if the browser supports notifications
    return "Notification" in window && "serviceWorker" in navigator;
  } catch (error) {
    console.error("Error checking notification support:", error);
    return false;
  }
};

// Send notification (client-side for testing, should be server-side in production)
export const sendNotification = async (data: {
  title: string;
  message: string;
  url?: string;
  playerIds?: string[];
}) => {
  try {
    // This should be done from your backend using OneSignal REST API
    // For testing purposes only - remove in production
    console.log("Sending notification:", data);

    // Example of how to send from backend:
    // POST https://onesignal.com/api/v1/notifications
    // {
    //   "app_id": "your-app-id",
    //   "include_player_ids": data.playerIds,
    //   "contents": {"en": data.message},
    //   "headings": {"en": data.title},
    //   "url": data.url
    // }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Request notification permission - Updated API
export const requestNotificationPermission = async () => {
  try {
    const permission = await OneSignal.Notifications.requestPermission();
    console.log("Notification permission:", permission);
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

// Logout from OneSignal - Updated API
export const logoutFromOneSignal = async () => {
  try {
    await OneSignal.logout();
    console.log("User logged out from OneSignal");
    return true;
  } catch (error) {
    console.error("Error logging out from OneSignal:", error);
    return false;
  }
};

// Get push subscription status
export const getPushSubscriptionStatus = async () => {
  try {
    const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
    return { subscribed: isSubscribed };
  } catch (error) {
    console.error("Error getting push subscription status:", error);
    return { subscribed: false, reason: "error" };
  }
};

// Opt in to push notifications
export const optInToPushNotifications = async () => {
  try {
    await OneSignal.User.PushSubscription.optIn();
    console.log("User opted in to push notifications");
    return true;
  } catch (error) {
    console.error("Error opting in to push notifications:", error);
    return false;
  }
};

// Opt out of push notifications
export const optOutOfPushNotifications = async () => {
  try {
    await OneSignal.User.PushSubscription.optOut();
    console.log("User opted out of push notifications");
    return true;
  } catch (error) {
    console.error("Error opting out of push notifications:", error);
    return false;
  }
};
