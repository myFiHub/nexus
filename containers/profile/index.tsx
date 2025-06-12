"use client";

import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetsActions, useAssetsSlice } from "../_assets/slice";
import { GlobalSelectors } from "../global/selectors";
import { AdditionalInfo } from "./components/AdditionalInfo";
import { ConnectedAccounts } from "./components/ConnectedAccounts";
import { ProfileHeader } from "./components/ProfileHeader";
import { UserStats } from "./components/UserStats";
import { myProfileSelectors } from "./selectors";
import { profileActions, useProfileSlice } from "./slice";

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-card rounded-lg shadow-md p-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted p-4 rounded-lg">
            <div className="h-4 w-24 bg-card rounded mb-2" />
            <div className="h-6 w-16 bg-card rounded" />
          </div>
        ))}
      </div>

      {/* Connected Accounts Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-muted p-4 rounded-lg">
              <div className="h-4 w-32 bg-card rounded mb-2" />
              <div className="h-4 w-24 bg-card rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Content = () => {
  useProfileSlice();
  useAssetsSlice();
  const loggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const user = useSelector(myProfileSelectors.user);
  const loading = useSelector(myProfileSelectors.loading);
  const userError = useSelector(myProfileSelectors.userError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedIn) {
      dispatch(profileActions.fetchProfile());
      dispatch(assetsActions.getBalance());
    }
  }, [loggedIn]);

  if (loading || !user) {
    return <LoadingSkeleton />;
  }
  if (userError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {userError}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-lg shadow-md p-6">
        <ProfileHeader user={user} />
        <UserStats user={user} />
        <ConnectedAccounts accounts={user.accounts} />
        <AdditionalInfo user={user} />
      </div>
    </div>
  );
};

export const Profile = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
