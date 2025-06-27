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
    });

    // Request notification permission
    await OneSignal.Notifications.requestPermission();

    console.log("OneSignal initialized successfully");
  } catch (error) {
    console.error("Error initializing OneSignal:", error);
  }
};

export const subscribeToNotifications = async () => {
  try {
    const permission = await OneSignal.Notifications.permission;

    if (permission) {
      // Get the user's OneSignal ID
      const playerId = await OneSignal.User.onesignalId;
      console.log("OneSignal Player ID:", playerId);
      return playerId;
    } else {
      console.log("Notification permission not granted");
      return null;
    }
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    return null;
  }
};

// Set user's external ID (your app's user UUID)
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

// Set user's email
export const setUserEmail = async (email: string) => {
  try {
    await OneSignal.User.addEmail(email);
    console.log("User email set:", email);
  } catch (error) {
    console.error("Error setting user email:", error);
  }
};

// Set user properties/tags
export const setUserProperties = async (properties: Record<string, any>) => {
  try {
    await OneSignal.User.addTags(properties);
    console.log("User properties set:", properties);
  } catch (error) {
    console.error("Error setting user properties:", error);
  }
};

// Get user's OneSignal ID
export const getOneSignalUserId = async () => {
  try {
    return await OneSignal.User.onesignalId;
  } catch (error) {
    console.error("Error getting OneSignal user ID:", error);
    return null;
  }
};

// Get user's external ID
export const getExternalUserId = async () => {
  try {
    return await OneSignal.User.externalId;
  } catch (error) {
    console.error("Error getting external user ID:", error);
    return null;
  }
};

export const sendNotification = async (data: {
  title: string;
  message: string;
  url?: string;
  playerIds?: string[];
}) => {
  try {
    // This would typically be done from your backend
    // For now, we'll just log the notification data
    console.log("Sending notification:", data);

    // In a real implementation, you would send this to your backend
    // which would then use OneSignal's REST API to send the notification
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

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
export const logoutFromOneSignal = async () => {
  try {
    await OneSignal.logout();
    console.log("User logged out from OneSignal");
  } catch (error) {
    console.error("Error logging out from OneSignal:", error);
  }
};
