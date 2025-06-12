"use client";

import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetsActions, useAssetsSlice } from "../_assets/slice";
import { AdditionalInfo } from "./components/AdditionalInfo";
import { ConnectedAccounts } from "./components/ConnectedAccounts";
import { ProfileHeader } from "./components/ProfileHeader";
import { UserStats } from "./components/UserStats";
import { myProfileSelectors } from "./selectors";
import { profileActions, useProfileSlice } from "./slice";

const Content = () => {
  useProfileSlice();
  useAssetsSlice();
  const user = useSelector(myProfileSelectors.user);
  const loading = useSelector(myProfileSelectors.loading);
  const userError = useSelector(myProfileSelectors.userError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileActions.fetchProfile());
    dispatch(assetsActions.getBalance());
  }, []);

  if (loading || !user) {
    return <div>Loading...</div>;
  }
  if (userError) {
    return <div>{userError}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
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
