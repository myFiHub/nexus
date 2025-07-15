import { MostFeeEarned } from "app/services/api/types";
import { LeaderboardRow } from "./LeaderboardRow";

export const LeaderboardTable = ({
  mostFeeEarned,
}: {
  mostFeeEarned: MostFeeEarned[];
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-left text-sm bg-[#181A20] rounded-lg">
      <thead>
        <tr className="text-[#A3A3A3] text-xs font-medium border-b border-[#23262F]">
          <th className="py-3 px-4">Rank</th>
          <th className="py-3 px-4">User</th>
          <th className="py-3 px-4 text-right">Total Fees Earned</th>
        </tr>
      </thead>
      <tbody>
        {mostFeeEarned.map((user, idx) => (
          <LeaderboardRow
            key={user.podium_pass_owner_uuid || idx}
            user={user}
            rank={idx + 1}
          />
        ))}
      </tbody>
    </table>
  </div>
);
