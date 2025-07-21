"use client";

import { ConfirmAddOrSwitchAccountDialogProvider } from "app/components/Dialog/confirmAddOrSwitchAccountDialog";
import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetsActions, useAssetsSlice } from "../_assets/slice";
import { GlobalSelectors } from "../global/selectors";
import { AdditionalInfo } from "./components/AdditionalInfo";
import { ConnectedAccounts } from "./components/connectedAccounts";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { LoginPrompt } from "./components/LoginPrompt";
import { MyPasses } from "./components/myPasses";
import { NFTSSection } from "./components/nfts";
import { ProfileHeader } from "./components/ProfileHeader";
import { SecuritySection } from "./components/SecuritySection";
import { AccountCardActionSelectDialogProvider } from "./components/SecuritySection/dialogs/accountCardActionSelectDialog";
import { SettingsSection } from "./components/SettingsSection";
import { UserStats } from "./components/UserStats";
import { profileActions, useProfileSlice } from "./slice";

const Content = () => {
  useProfileSlice();
  useAssetsSlice();
  const user = useSelector(GlobalSelectors.podiumUserInfo);
  const loading = useSelector(GlobalSelectors.logingIn);
  const dispatch = useDispatch();
  const loggedIn = !!user;

  useEffect(() => {
    if (loggedIn) {
      dispatch(assetsActions.getBalance());
      dispatch(assetsActions.getMyBlockchainPasses());
      dispatch(assetsActions.getPassesBoughtByMe({ page: 0 }));
      dispatch(profileActions.fetchNfts({ silent: false }));
    }
  }, [loggedIn]);

  if (!loading && !user) {
    return <LoginPrompt />;
  }

  if (loading || !user) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <ConfirmAddOrSwitchAccountDialogProvider />
      <AccountCardActionSelectDialogProvider />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg shadow-md p-6">
          <ProfileHeader user={user} />
          <UserStats user={user} />
          <ConnectedAccounts accounts={user.accounts} />
          <AdditionalInfo user={user} />
          <MyPasses />
          <NFTSSection />
          <SettingsSection />
          <SecuritySection />
        </div>
      </div>
    </>
  );
};

export const Profile = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
