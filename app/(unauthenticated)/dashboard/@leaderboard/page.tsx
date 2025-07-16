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

const getMostPassHeldWithCache = unstable_cache(
  async () => podiumApi.getMostPassHeld(0, TOP_FEE_EARNED_PAGE_SIZE),
  [LeaderboardTags.MostPassHeld],
  {
    revalidate: 60, // 1 minute
  }
);

const getMostUniquePassHoldersWithCache = unstable_cache(
  async () => podiumApi.getMostUniquePassHolders(0, TOP_FEE_EARNED_PAGE_SIZE),
  [LeaderboardTags.MostUniquePassHolders],
  {
    revalidate: 60, // 1 minute
  }
);
export default async function LeaderboardPage() {
  const [mostFeeEarned, mostPassHeld, mostUniquePassHolders] =
    await Promise.all([
      getMostFeeEarnedWithCache(),
      getMostPassHeldWithCache(),
      getMostUniquePassHoldersWithCache(),
    ]);

  return (
    <Leaderboard
      mostFeeEarned={mostFeeEarned}
      mostPassHeld={mostPassHeld}
      mostUniquePassHolders={mostUniquePassHolders}
    />
  );
}
