import { Leaderboard } from "app/containers/dashboard/leaderboard";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { LeaderBoardPageSize, LeaderboardTags } from "./_configs";

const getMostFeeEarnedWithCache = unstable_cache(
  async () =>
    podiumApi.getMostFeeEarned(
      0,
      LeaderBoardPageSize[LeaderboardTags.TopFeeEarned]
    ),
  [LeaderboardTags.TopFeeEarned],
  {
    revalidate: 60, // 1 minute
  }
);

const getMostPassHeldWithCache = unstable_cache(
  async () =>
    podiumApi.getMostPassHeld(
      0,
      LeaderBoardPageSize[LeaderboardTags.MostPassHeld]
    ),
  [LeaderboardTags.MostPassHeld],
  {
    revalidate: 60, // 1 minute
  }
);

const getMostUniquePassHoldersWithCache = unstable_cache(
  async () =>
    podiumApi.getMostUniquePassHolders(
      0,
      LeaderBoardPageSize[LeaderboardTags.MostUniquePassHolders]
    ),
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
