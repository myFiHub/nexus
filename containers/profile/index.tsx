"use client";

import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetsActions, useAssetsSlice } from "../_assets/slice";
import { GlobalSelectors } from "../global/selectors";
import { AdditionalInfo } from "./components/AdditionalInfo";
import { ConnectedAccounts } from "./components/connectedAccounts";
import { MyPasses } from "./components/myPasses";
import { ProfileHeader } from "./components/ProfileHeader";
import { SettingsSection } from "./components/SettingsSection";
import { UserStats } from "./components/UserStats";
import { profileActions, useProfileSlice } from "./slice";

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="bg-card rounded-lg shadow-md p-6 animate-pulse">
      {/* Profile Header Skeleton - matches ProfileHeader component */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-32 h-32 rounded-full bg-muted flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="flex space-x-4">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* Balance Card Skeleton - matches UserStats balance section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-lg">
          <div className="h-4 w-32 bg-muted rounded mb-2" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      </div>

      {/* Stats Grid Skeleton - matches UserStats StatCard grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted p-4 rounded-lg">
            <div className="h-4 w-20 bg-card rounded mb-2" />
            <div className="h-6 w-12 bg-card rounded mb-1" />
            <div className="h-3 w-24 bg-card rounded" />
          </div>
        ))}
      </div>

      {/* Connected Accounts Skeleton - matches ConnectedAccounts component */}
      <div className="mb-8">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-card" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-card rounded mb-1" />
                  <div className="h-3 w-24 bg-card rounded" />
                </div>
              </div>
              <div className="h-3 w-28 bg-card rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info Skeleton - matches AdditionalInfo component */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-muted p-4 rounded-lg">
            <div className="h-5 w-32 bg-card rounded mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-3 w-20 bg-card rounded" />
                  <div className="h-3 w-32 bg-card rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Settings Section Skeleton - matches SettingsSection component */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-5 w-48 bg-card rounded mb-2" />
              <div className="h-3 w-64 bg-card rounded" />
            </div>
            <div className="w-8 h-4 bg-card rounded" />
          </div>
        </div>
      </div>

      {/* My Passes Skeleton - matches MyPasses component */}
      <div className="mt-8">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted rounded-lg overflow-hidden">
              {/* Pass header with gradient */}
              <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 relative">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-card border-2 border-white/20" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-card rounded mb-1" />
                      <div className="h-3 w-16 bg-card rounded" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Pass content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-card rounded" />
                  <div className="h-3 w-20 bg-card rounded" />
                </div>
                <div>
                  <div className="h-3 w-24 bg-card rounded mb-2" />
                  <div className="h-8 w-full bg-card rounded" />
                </div>
                <div className="h-8 w-full bg-card rounded" />
              </div>
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
  const user = useSelector(GlobalSelectors.podiumUserInfo);
  const loading = useSelector(GlobalSelectors.logingIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedIn) {
      dispatch(profileActions.fetchProfile());
      dispatch(assetsActions.getBalance());
      dispatch(assetsActions.getPassesBoughtByMe({ page: 0 }));
    }
  }, [loggedIn]);

  if (loading || !user) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-lg shadow-md p-6">
        <ProfileHeader user={user} />
        <UserStats user={user} />
        <ConnectedAccounts accounts={user.accounts} />
        <AdditionalInfo user={user} />
        <SettingsSection />
        <MyPasses />
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
