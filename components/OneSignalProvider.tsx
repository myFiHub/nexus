"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getNotificationPermission,
  initializeOneSignal,
  loginToOneSignal,
  logoutFromOneSignal,
  subscribeToNotifications,
} from "../lib/onesignal";

interface OneSignalProviderProps {
  children: React.ReactNode;
}

export const OneSignalProvider = ({ children }: OneSignalProviderProps) => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const [isInitialized, setIsInitialized] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [permission, setPermission] = useState<boolean>(false);

  useEffect(() => {
    if (!myUser?.uuid && isInitialized) {
      logoutFromOneSignal();
    } else {
    }
  }, [myUser?.uuid]);

  useEffect(() => {
    const initOneSignal = async () => {
      if (isInitialized && myUser?.uuid) {
        loginToOneSignal(myUser.uuid);
        return;
      }
      try {
        if (isInitialized) {
          return;
        }
        // Initialize OneSignal
        await initializeOneSignal();
        console.log("OneSignal initialized");
        setIsInitialized(true);

        // Get notification permission
        const hasPermission = await getNotificationPermission();
        setPermission(hasPermission);

        // Subscribe to notifications if permission is granted
        if (hasPermission) {
          const id = await subscribeToNotifications();
          setPlayerId(id || null);
        }
      } catch (error) {
        console.error("Error initializing OneSignal:", error);
      }
    };

    initOneSignal();
  }, [myUser?.uuid, isInitialized]);

  // You can expose OneSignal state through context if needed
  const contextValue = {
    isInitialized,
    playerId,
    permission,
  };

  return <div>{children}</div>;
};
