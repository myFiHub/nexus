"use client";

import { LoginButton } from "app/components/header/LoginButton";
import { GlobalSelectors } from "app/containers/global/selectors";
import { User } from "app/services/api/types";
import { BarChart3 } from "lucide-react";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { AnalyticsState } from "./widgets";

/** Renders children with the signed-in user, a skeleton while restoring, or a sign-in prompt. */
export const SessionGate = ({
  skeleton,
  children,
}: {
  skeleton: ReactNode;
  children: (user: User) => ReactNode;
}) => {
  const user = useSelector(GlobalSelectors.podiumUserInfo);
  const initializing = useSelector(GlobalSelectors.initializingWeb3Auth);
  const logingIn = useSelector(GlobalSelectors.logingIn);

  if (user) return children(user);
  if (initializing || logingIn) return skeleton;
  return (
    <AnalyticsState
      icon={<BarChart3 className="h-6 w-6" />}
      title="Sign in to see your analytics"
      message="Audience, retention and earnings for the outposts you host."
      action={<LoginButton />}
    />
  );
};
