"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { cn, truncate } from "app/lib/utils";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";
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
  const aptosAccountAddress = useSelector(GlobalSelectors.aptosAccountAddress);
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const podiumUserInfo = useSelector(GlobalSelectors.podiumUserInfo);
  const initializingWeb3Auth = useSelector(
    GlobalSelectors.initializingWeb3Auth
  );
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const logingOut = useSelector(GlobalSelectors.logingOut);

  const loading = logingIn || logingOut || initializingWeb3Auth;

  const connect = async () => {
    dispatch(globalActions.getAndSetWeb3AuthAccount());
  };

  const disconnect = async () => {
    dispatch(globalActions.logout());
  };
  const minWidth = size === "sm" ? "min-w-[100px]" : "min-w-[150px]";
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
