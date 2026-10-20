"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { AUTH_FLAG_ATTRIBUTE } from "app/lib/bootScript";
import { CookieKeys, getClientCookie } from "app/lib/client-cookies";
import { useEffect } from "react";
import { useSelector } from "react-redux";

/** Keeps html[data-auth] in sync once the session has been restored or ended. */
export const AuthFlag = () => {
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const initialized = useSelector(GlobalSelectors.initialized);
  const initializing = useSelector(GlobalSelectors.initializingWeb3Auth);
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const settled = initialized && !initializing && !logingIn;

  useEffect(() => {
    const root = document.documentElement;
    if (isLoggedIn) {
      root.setAttribute(AUTH_FLAG_ATTRIBUTE, "");
    } else if (settled || !getClientCookie(CookieKeys.myUserId)) {
      root.removeAttribute(AUTH_FLAG_ATTRIBUTE);
    }
  }, [isLoggedIn, settled]);

  return null;
};
