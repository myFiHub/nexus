import { Users } from "app/containers/dashboard/users";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";

const getRecentlyJoinedUsersWithCache = unstable_cache(
  async () => podiumApi.getRecentlyJoinedUsers(),
  ["recently-joined-users"],
  {
    revalidate: 600, // 10 minutes
  }
);

const getTopOwnersWithCache = unstable_cache(
  async () => podiumApi.getTopOwners(),
  ["top-owners"],
  {
    revalidate: 3600, // 1 hour
  }
);

const getTradesWithCache = unstable_cache(
  async () => podiumApi.getTrades(),
  ["trades"],
  {
    revalidate: 60, // 1 minute
  }
);

const getTradingVolumeWithCache = unstable_cache(
  async () => podiumApi.getTradingVolume(),
  ["trading-volume"],
  {
    revalidate: 60, // 1 minute
  }
);

export default async function UsersPage() {
  const [recentlyJoinedUsers, topOwners, trades, tradingVolume] =
    await Promise.all([
      getRecentlyJoinedUsersWithCache(),
      getTopOwnersWithCache(),
      getTradesWithCache(),
      getTradingVolumeWithCache(),
    ]);
  return (
    <Users
      recentlyJoinedUsers={recentlyJoinedUsers}
      topOwners={topOwners}
      trades={trades}
      tradingVolume={tradingVolume}
    />
  );
}
