import { Leaderboard } from "app/containers/dashboard/leaderboard";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { LEADERBOARD_PAGE_SIZE, LeaderboardTags } from "./_configs";

const getMostFeeEarnedWithCache = unstable_cache(
  async () =>
    podiumApi.getMostFeeEarned({
      page: 0,
      page_size: LEADERBOARD_PAGE_SIZE[LeaderboardTags.TopFeeEarned],
    }),
  [LeaderboardTags.TopFeeEarned],
  {
    revalidate: 60, // 1 minute
  }
);

const getMostPassHeldWithCache = unstable_cache(
  async () =>
    podiumApi.getMostPassHeld({
      page: 0,
      page_size: LEADERBOARD_PAGE_SIZE[LeaderboardTags.MostPassHeld],
    }),
  [LeaderboardTags.MostPassHeld],
  {
    revalidate: 60, // 1 minute
  }
);

const getMostUniquePassHoldersWithCache = unstable_cache(
  async () =>
    podiumApi.getMostUniquePassHolders({
      page: 0,
      page_size: LEADERBOARD_PAGE_SIZE[LeaderboardTags.MostUniquePassHolders],
    }),
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
