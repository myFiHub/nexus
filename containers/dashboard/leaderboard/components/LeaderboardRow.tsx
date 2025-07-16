import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
import { LeaderboardAvatar } from "./LeaderboardAvatar";
import { LeaderboardFees } from "./LeaderboardFees";
import { LeaderboardUserInfo } from "./LeaderboardUserInfo";

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
    <tr className="border-b border-[#23262F] hover:bg-[#23262F] transition">
      <td className="py-3 px-4 font-semibold text-[#F4F4F4] w-6">{rank}</td>
      <td className="py-3 px-4 flex items-center gap-3 min-w-[100px]">
        <LeaderboardAvatar user={user} />
        <LeaderboardUserInfo user={user} />
      </td>
      <td className="py-3 px-4 text-right">
        <LeaderboardFees user={user} type={type} />
      </td>
    </tr>
  );
};
