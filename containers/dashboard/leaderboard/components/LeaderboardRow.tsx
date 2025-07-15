import { MostFeeEarned } from "app/services/api/types";
import { LeaderboardAvatar } from "./LeaderboardAvatar";
import { LeaderboardFees } from "./LeaderboardFees";
import { LeaderboardUserInfo } from "./LeaderboardUserInfo";

export const LeaderboardRow = ({
  user,
  rank,
}: {
  user: MostFeeEarned;
  rank: number;
}) => (
  <tr className="border-b border-[#23262F] hover:bg-[#23262F] transition">
    <td className="py-3 px-4 font-semibold text-[#F4F4F4] w-12">{rank}</td>
    <td className="py-3 px-4 flex items-center gap-3 min-w-[250px]">
      <LeaderboardAvatar user={user} />
      <LeaderboardUserInfo user={user} />
    </td>
    <td className="py-3 px-4 text-right">
      <LeaderboardFees user={user} />
    </td>
  </tr>
);
