import { MostFeeEarned } from "app/services/api/types";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { LeaderboardInjector } from "./injector";

export const Leaderboard = ({
  mostFeeEarned,
}: {
  mostFeeEarned: MostFeeEarned[];
}) => {
  return (
    <>
      <LeaderboardInjector />
      <LeaderboardTable mostFeeEarned={mostFeeEarned} />
    </>
  );
};
