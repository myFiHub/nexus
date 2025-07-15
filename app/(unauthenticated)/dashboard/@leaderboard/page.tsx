import { Leaderboard } from "app/containers/dashboard/leaderboard";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { LeaderboardTags, TOP_FEE_EARNED_PAGE_SIZE } from "./_configs";

const getMostFeeEarnedWithCache = unstable_cache(
  async () => podiumApi.getMostFeeEarned(0, TOP_FEE_EARNED_PAGE_SIZE),
  [LeaderboardTags.TopFeeEarned],
  {
    revalidate: 60, // 1 minute
  }
);
export default async function LeaderboardPage() {
  const mostFeeEarned = await getMostFeeEarnedWithCache();
  return <Leaderboard mostFeeEarned={mostFeeEarned} />;
}
