import { MostFeeEarned } from "app/services/api/types";
import { LeaderboardTable } from "./components/LeaderboardTable";

export const Leaderboard = ({
  mostFeeEarned,
}: {
  mostFeeEarned: MostFeeEarned[];
}) => {
  return <LeaderboardTable mostFeeEarned={mostFeeEarned} />;
};
