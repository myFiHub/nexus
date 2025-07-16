import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { Img } from "app/components/Img";
import { logoUrl, movementLogoUrl } from "app/lib/constants";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";

const content = (
  user: MostFeeEarned | MostPassHeld | MostUniquePassHeld,
  type: LeaderboardTags
) => {
  switch (type) {
    case LeaderboardTags.TopFeeEarned:
      return (
        <span className="flex items-center justify-end gap-2 font-semibold text-[var(--card-foreground)]">
          <Img src={movementLogoUrl} alt="logo" className="w-4 h-4" />
          {(user as MostFeeEarned)?.total_fee?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
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
  return content(user, type);
};
