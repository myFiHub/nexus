"use client";

import { ConfirmAddOrSwitchAccountDialogProvider } from "app/components/Dialog/confirmAddOrSwitchAccountDialog";
import { isExternalWalletLoginMethod } from "app/components/Dialog/loginMethodSelect";
import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { cn } from "app/lib/utils";
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
import { UserStats } from "./components/userStats";
import { profileActions, useProfileSlice } from "./slice";
import {
  ProfileTutorial,
  ProfileTutorialIds,
} from "./tutorial/ProfileTutorial";

// Reusable styled card for profile sections
const SectionCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-gradient-to-br from-white/80 to-gray-100/60 dark:from-gray-900/80 dark:to-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mb-8",
      className
    )}
  >
    {children}
  </div>
);

const Content = () => {
  useProfileSlice();
  useAssetsSlice();
  const user = useSelector(GlobalSelectors.podiumUserInfo);
  const isExternalWallet = isExternalWalletLoginMethod(user?.login_type ?? "");
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
          <ProfileTutorial />
          <ProfileHeader id={ProfileTutorialIds.header} user={user} />
          <SectionCard className="">
            <UserStats id={ProfileTutorialIds.stats} user={user} />
          </SectionCard>
          <SectionCard className="">
            <ConnectedAccounts
              id={ProfileTutorialIds.accounts}
              accounts={user.accounts}
            />
          </SectionCard>
          <SectionCard className="">
            <AdditionalInfo
              id={ProfileTutorialIds.additionalInfo}
              user={user}
            />
          </SectionCard>
          <SectionCard className="">
            <MyPasses id={ProfileTutorialIds.passes} />
          </SectionCard>
          <SectionCard className="">
            <NFTSSection id={ProfileTutorialIds.nfts} />
          </SectionCard>
          <SectionCard className="">
            <SettingsSection id={ProfileTutorialIds.settings} />
          </SectionCard>
          {!isExternalWallet ? (
            <SectionCard>
              <SecuritySection id={ProfileTutorialIds.security} />
            </SectionCard>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export const Profile = () => {
  return (
    <ReduxProvider>
      <RouteLoaderCleaner />
      <Content />
    </ReduxProvider>
  );
};
