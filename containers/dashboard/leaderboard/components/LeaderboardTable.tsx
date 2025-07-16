import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
import { LeaderboardRow } from "./LeaderboardRow";
import ClientSideList from "./clientSideList";
import ListEndObserver from "./listEndObserver";

const lastColTitle = (type: LeaderboardTags) => {
  switch (type) {
    case LeaderboardTags.TopFeeEarned:
      return "Earned";
    case LeaderboardTags.MostPassHeld:
      return "Holding";
    case LeaderboardTags.MostUniquePassHolders:
      return "Holding";
    default:
      return "";
  }
};

const leaderboardTitle = (type: LeaderboardTags) => {
  switch (type) {
    case LeaderboardTags.TopFeeEarned:
      return "Top Fee Earners";
    case LeaderboardTags.MostPassHeld:
      return "Most Passes Held";
    case LeaderboardTags.MostUniquePassHolders:
      return "Most Unique Pass Holders";
    default:
      return "Leaderboard";
  }
};

export const LeaderboardTable = ({
  users,
  type,
}: {
  users: MostFeeEarned[] | MostPassHeld[] | MostUniquePassHeld[];
  type: LeaderboardTags;
}) => {
  return (
    <div>
      <div className="mb-6 mt-2 text-2xl font-bold text-center text-[#FFD700] drop-shadow-sm tracking-wide">
        {leaderboardTitle(type)}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm bg-[#181A20] rounded-lg">
          <thead>
            <tr className="text-[#A3A3A3] text-xs font-medium border-b border-[#23262F]">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4 text-right">{lastColTitle(type)}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <LeaderboardRow
                type={type}
                key={user.podium_pass_owner_uuid || idx}
                user={user}
                rank={idx + 1}
              />
            ))}
            <ClientSideList type={type} />
          </tbody>
        </table>
        <ListEndObserver type={type} />
      </div>
    </div>
  );
};
