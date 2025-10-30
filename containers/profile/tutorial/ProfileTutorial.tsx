"use client";

import { isExternalWalletLoginMethod } from "app/components/Dialog/loginMethodSelect";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { useSelector } from "react-redux";

import type { Step } from "react-joyride";

export const PROFILE_TUTORIAL_LOCAL_STORAGE_KEY = "profile_tutorial_shown";

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
  const [run, setRun] = useState(false);
  const [theme, setTheme] = useState({
    primary: "#7c3aed",
    foreground: "#0f172a",
    foregroundMuted: "#6b7280",
    card: "#ffffff",
    border: "#e5e7eb",
    radius: "10px",
    overlay: "rgba(0,0,0,0.4)",
  });

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

  useEffect(() => {
    if (!enabled) return;
    try {
      const hasShown =
        typeof window !== "undefined" &&
        window.localStorage.getItem(PROFILE_TUTORIAL_LOCAL_STORAGE_KEY) === "1";
      if (!hasShown) {
        setRun(true);
      }
    } catch {
      setRun(true);
    }
  }, [enabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const root = document.documentElement;
      const css = getComputedStyle(root);
      const isDark = root.classList.contains("dark");
      const primary = css.getPropertyValue("--primary").trim() || theme.primary;
      const foreground =
        css.getPropertyValue("--foreground").trim() || theme.foreground;
      const muted =
        css.getPropertyValue("--muted-foreground").trim() ||
        theme.foregroundMuted;
      const card = css.getPropertyValue("--card").trim() || theme.card;
      const border = css.getPropertyValue("--border").trim() || theme.border;
      const radius = css.getPropertyValue("--radius").trim() || theme.radius;
      setTheme({
        primary,
        foreground,
        foregroundMuted: muted,
        card,
        border,
        radius,
        overlay: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
      });
    } catch {}
  }, []);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    const finished =
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      status === STATUS.PAUSED;
    if (finished) {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PROFILE_TUTORIAL_LOCAL_STORAGE_KEY, "1");
        }
      } catch {}
      setRun(false);
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
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: theme.primary,
          textColor: theme.foreground,
          arrowColor: theme.card,
          backgroundColor: theme.card,
        },
        overlay: {
          backgroundColor: theme.overlay,
        },
        tooltip: {
          backgroundColor: theme.card,
          color: theme.foreground,
          borderRadius: theme.radius,
          border: `1px solid ${theme.border}`,
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        },
        tooltipContainer: {
          textAlign: "left",
          fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui)",
        },
        tooltipTitle: {
          margin: 0,
          color: theme.foreground,
        },
        tooltipContent: {
          color: theme.foreground,
        },
        buttonNext: {
          backgroundColor: theme.primary,
          color: "var(--primary-foreground, #fff)",
          borderRadius: theme.radius,
          padding: "0.5rem 0.75rem",
          boxShadow: "none",
        },
        buttonBack: {
          color: theme.foregroundMuted,
          marginRight: 8,
        },
        buttonClose: {
          color: theme.foregroundMuted,
        },
        beacon: {
          boxShadow: `0 0 0 2px ${theme.primary}40`,
        },
        spotlight: {
          borderRadius: theme.radius,
        },
      }}
    />
  );
};
