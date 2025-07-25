"use client";
import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { Img } from "app/components/Img";
import { GlobalSelectors } from "app/containers/global/selectors";

import { logoUrl, movementLogoUrl } from "app/lib/constants";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";

const Content = ({
  user,
  type,
}: {
  user: MostFeeEarned | MostPassHeld | MostUniquePassHeld;
  type: LeaderboardTags;
}) => {
  const usdValue = useSelector(
    GlobalSelectors.moveToUsd((user as MostFeeEarned)?.total_fee ?? 0)
  );
  switch (type) {
    case LeaderboardTags.TopFeeEarned:
      return (
        <>
          <span className="flex items-center justify-end gap-2 font-semibold text-[var(--card-foreground)]">
            <Img src={movementLogoUrl} alt="logo" className="w-4 h-4" />
            {(user as MostFeeEarned)?.total_fee?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="flex items-center justify-end gap-2 text-xs font-normal text-[var(--muted-foreground)]">
            $
            {usdValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </>
      );
    case LeaderboardTags.MostPassHeld:
      return (
        <span className="flex items-center justify-end gap-2 font-semibold text-[var(--card-foreground)]">
          <Img src={logoUrl} alt="logo" className="w-4 h-4" />
          {(user as MostPassHeld).held_count}
        </span>
      );
    case LeaderboardTags.MostUniquePassHolders:
      return (
        <span className="flex items-center justify-end gap-2 font-semibold text-[var(--card-foreground)]">
          <Img src={logoUrl} alt="logo" className="w-4 h-4" />
          {(user as MostUniquePassHeld).unique_held_count}
        </span>
      );
    default:
      return null;
  }
};

export const LeaderboardFees = ({
  user,
  type,
}: {
  user: MostFeeEarned | MostPassHeld | MostUniquePassHeld;
  type: LeaderboardTags;
}) => {
  return (
    <ReduxProvider>
      <Content user={user} type={type} />
    </ReduxProvider>
  );
};
