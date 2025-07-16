import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
import { LeaderboardAvatar } from "./LeaderboardAvatar";
import { LeaderboardFees } from "./LeaderboardFees";
import { LeaderboardUserInfo } from "./LeaderboardUserInfo";
import { AnimatedNumberOne } from "./animatedRank/first";
import { AnimatedNumberTwo } from "./animatedRank/second";
import { AnimatedNumberThree } from "./animatedRank/third";

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-[#FFD700]"; // Gold
  if (rank === 2) return "text-[#C0C0C0]"; // Silver
  if (rank === 3) return "text-[#CD7F32]"; // Bronze
  if (rank === 4) return "text-[#90A4AE]"; // Subtle Blue-Gray
  if (rank === 5) return "text-[#A5D6A7]"; // Subtle Green
  return "text-[var(--card-foreground)]";
};

const rankElement = (rank: number) => {
  if (rank === 1) return <AnimatedNumberOne />;
  if (rank === 2) return <AnimatedNumberTwo />;
  if (rank === 3) return <AnimatedNumberThree />;
  return rank;
};

export const LeaderboardRow = ({
  user,
  rank,
  type,
}: {
  user: MostFeeEarned | MostPassHeld | MostUniquePassHeld;
  rank: number;
  type: LeaderboardTags;
}) => {
  return (
    <tr className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition">
      <td className={`p-0 text-center font-semibold ${getRankColor(rank)} w-6`}>
        {rankElement(rank)}
      </td>
      <td className="py-3 px-4 flex items-center gap-3  flex-1">
        <LeaderboardAvatar user={user} />
        <LeaderboardUserInfo user={user} />
      </td>
      <td className="py-3 px-4 text-right">
        <LeaderboardFees user={user} type={type} />
      </td>
    </tr>
  );
};
