import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
import { LeaderboardHeader } from "./components/LeaderboardHeader";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { LeaderboardInjector } from "./injector";

export const Leaderboard = ({
  mostFeeEarned,
  mostPassHeld,
  mostUniquePassHolders,
}: {
  mostFeeEarned: MostFeeEarned[];
  mostPassHeld: MostPassHeld[];
  mostUniquePassHolders: MostUniquePassHeld[];
}) => {
  return (
    <>
      <LeaderboardInjector />
      <LeaderboardHeader />
      <div className="flex   gap-4">
        <LeaderboardTable
          users={mostFeeEarned}
          type={LeaderboardTags.TopFeeEarned}
        />
        <LeaderboardTable
          users={mostPassHeld}
          type={LeaderboardTags.MostPassHeld}
        />

        <LeaderboardTable
          users={mostUniquePassHolders}
          type={LeaderboardTags.MostUniquePassHolders}
        />
      </div>
    </>
  );
};
