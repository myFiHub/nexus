import { Users } from "app/containers/dashboard/users";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { TradesTags, UserTags } from "../../users/[filter]/_filters";

const getRecentlyJoinedUsersWithCache = unstable_cache(
  async () => podiumApi.getRecentlyJoinedUsers(),
  [UserTags.RecentlyJoined],
  {
    revalidate: 600, // 10 minutes
  }
);

const getTopOwnersWithCache = unstable_cache(
  async () => podiumApi.getTopOwners(),
  [UserTags.TopOwners],
  {
    revalidate: 3600, // 1 hour
  }
);

const getTradesWithCache = unstable_cache(
  async () => podiumApi.getTrades(),
  [TradesTags.Trades],
  {
    revalidate: 60, // 1 minute
  }
);

const getTradingVolumeWithCache = unstable_cache(
  async () => podiumApi.getTradingVolume(),
  [TradesTags.TradingVolume],
  {
    revalidate: 60, // 1 minute
  }
);

export default async function UsersPage() {
  const [recentlyJoinedUsers, topOwners, trades] = await Promise.all([
    getRecentlyJoinedUsersWithCache(),
    getTopOwnersWithCache(),
    getTradesWithCache(),
  ]);
  return (
    <Users
      recentlyJoinedUsers={recentlyJoinedUsers}
      topOwners={topOwners}
      trades={trades}
    />
  );
}
