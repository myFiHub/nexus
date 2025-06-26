"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { cn, truncate } from "app/lib/utils";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";
import { confirmDialog } from "../Dialog/confirmDialog";
import { Img } from "../Img";

interface LoginButtonProps {
  size?: "sm" | "lg";
  className?: string;
}

export const LoginButton = ({ size, className }: LoginButtonProps) => {
  return (
    <ReduxProvider>
      <Content size={size} className={className} />
    </ReduxProvider>
  );
};

const Content = ({ size, className }: LoginButtonProps) => {
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const podiumUserInfo = useSelector(GlobalSelectors.podiumUserInfo);
  const initializingWeb3Auth = useSelector(
    GlobalSelectors.initializingWeb3Auth
  );
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const logingOut = useSelector(GlobalSelectors.logingOut);

  // Ensure loading is always a boolean to prevent hydration mismatch
  const loading = Boolean(logingIn || logingOut || initializingWeb3Auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const connect = async () => {
    dispatch(globalActions.getAndSetWeb3AuthAccount());
  };

  const disconnect = async () => {
    const confirmed = await confirmDialog({
      title: "do you want to logout?",
      content: "",
      confirmOpts: {
        colorScheme: "danger",
        text: "Logout",
      },
    });
    if (confirmed) {
      dispatch(globalActions.logout());
    }
  };

  const minWidth = size === "sm" ? "min-w-[100px]" : "min-w-[154px]";

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Button disabled={true} size={size} className={cn(className, minWidth)}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      disabled={loading}
      size={size}
      className={cn(className, minWidth)}
      onClick={isLoggedIn ? disconnect : connect}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isLoggedIn && podiumUserInfo?.aptos_address ? (
        <div className="flex items-center gap-2">
          {podiumUserInfo.image && (
            <Img
              src={podiumUserInfo.image}
              alt="profile"
              className="w-6 h-6 rounded-full"
            />
          )}
          <span>{truncate(podiumUserInfo.aptos_address)}</span>
        </div>
      ) : (
        "Login"
      )}
    </Button>
  );
};
