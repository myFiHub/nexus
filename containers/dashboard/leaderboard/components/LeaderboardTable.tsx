import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
import { CurrentUserRank } from "./CurrentUserRank";
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
      <div className="mb-6 mt-2 text-2xl font-bold text-center text-[var(--primary)] drop-shadow-sm tracking-wide sticky top-0 z-20 bg-[var(--background)] rounded-2xl">
        {leaderboardTitle(type)}
      </div>
      <CurrentUserRank filter={type} />
      <div className="overflow-x-auto">
        <div className="relative rounded-lg shadow-lg bg-[var(--card)] p-1    ">
          <table className="min-w-full text-left text-sm rounded-lg overflow-hidden backdrop-blur-md bg-[var(--card)] text-[var(--card-foreground)]">
            <thead>
              <tr className="text-[var(--primary)] text-xs font-bold border-b border-[var(--border)] bg-[var(--card)]">
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
          <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-[var(--primary)]/20 shadow-[0_0_32px_4px_var(--primary)]/10" />
        </div>
        <ListEndObserver type={type} />
      </div>
    </div>
  );
};
