"use client";

import { isExternalWalletLoginMethod } from "app/components/Dialog/loginMethodSelect";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useState, useSyncExternalStore } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { useSelector } from "react-redux";

import type { Step } from "react-joyride";
import { buildJoyrideStyles } from "../../tutorial/joyrideStyles";
import { useJoyrideTheme } from "../../tutorial/useJoyrideTheme";

export const PROFILE_TUTORIAL_LOCAL_STORAGE_KEY = "profile_tutorial_shown";

const noopSubscribe = () => () => {};
const readTutorialShown = () => {
  try {
    return window.localStorage.getItem(PROFILE_TUTORIAL_LOCAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const ProfileTutorialIds = {
  header: "profile-header",
  yourWalletAddress: "wallet-address",
  stats: "profile-stats",
  exportBalance: "export-balance",
  accounts: "profile-accounts",
  additionalInfo: "profile-additional-info",
  passes: "profile-passes",
  nfts: "profile-nfts",
  settings: "profile-settings",
  security: "profile-security",
} as const;

type ProfileTutorialProps = {
  enabled?: boolean;
};

export const ProfileTutorial = ({ enabled = true }: ProfileTutorialProps) => {
  const user = useSelector(GlobalSelectors.podiumUserInfo);
  const isExternalWallet = isExternalWalletLoginMethod(user?.login_type ?? "");
  const shownBefore = useSyncExternalStore(noopSubscribe, readTutorialShown, () => true);
  const [dismissed, setDismissed] = useState(false);
  const run = enabled && !shownBefore && !dismissed;
  const theme = useJoyrideTheme();

  const steps: Step[] = [
    {
      target: `#${ProfileTutorialIds.header}`,
      content: "Here is your profile header with name, avatar, and basic info.",
      disableBeacon: true,
    },
    {
      target: `#${ProfileTutorialIds.yourWalletAddress}`,
      content: "Here is your wallet address on MOVEMENT network.",
    },
    {
      target: `#${ProfileTutorialIds.stats}`,
      content: "Quick stats summarizing your activity and balances.",
    },
    {
      target: `#${ProfileTutorialIds.exportBalance}`,
      content: "Export or transfer your balance from here.",
    },

    {
      target: `#${ProfileTutorialIds.accounts}`,
      content: "Manage your connected accounts and wallets here.",
    },
    {
      target: `#${ProfileTutorialIds.additionalInfo}`,
      content: "Extra information associated with your profile.",
    },
    {
      target: `#${ProfileTutorialIds.passes}`,
      content: "Your passes are listed here.",
    },
    {
      target: `#${ProfileTutorialIds.nfts}`,
      content: "Browse NFTs linked to your profile.",
    },
    {
      target: `#${ProfileTutorialIds.settings}`,
      content: "Adjust preferences and app settings.",
    },
    // Security is conditional; if it's not in DOM, Joyride will skip gracefully
    ...(!isExternalWallet
      ? [
          {
            target: `#${ProfileTutorialIds.security}`,
            content: "Access security options here.",
          },
        ]
      : []),
  ];

  // theme resolved via useJoyrideTheme

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    const finished =
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      status === STATUS.PAUSED;
    if (finished) {
      try {
        window.localStorage.setItem(PROFILE_TUTORIAL_LOCAL_STORAGE_KEY, "1");
      } catch {}
      setDismissed(true);
    }
  };

  return (
    <Joyride
      run={run}
      steps={steps}
      callback={handleCallback}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      styles={buildJoyrideStyles(theme)}
    />
  );
};
