import { sortFeaturedOutposts } from "app/lib/outposts";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { HomeContainer } from "../containers/home";
import { generateMetadata } from "./_metadata";

// Export the metadata function
export { generateMetadata };

// Cache outposts for home page (ISR); used to derive featured events.
const getCachedOutposts = unstable_cache(
  async () => {
    const results = await podiumApi.getOutposts(0, 20);
    if (results instanceof Error) {
      return [];
    }
    return results;
  },
  ["home-outposts"],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ["home-outposts"],
  }
);

const getCachedStatistics = unstable_cache(
  async () => {
    const results = await podiumApi.getStatistics();
    return results.result;
  },
  ["statistics"],
  {
    revalidate: 60 * 60 * 24, //each day
    tags: ["statistics"],
  }
);

const getCachedRecentUsers = unstable_cache(
  async () => {
    const results = await podiumApi.getRecentlyJoinedUsers(0, 5);
    return results;
  },
  ["recent-users"],
  { revalidate: 60, tags: ["recent-users"] }
);

const getCachedDiscovery = unstable_cache(
  async () => {
    const [live, trending24h, trending7d, tags] = await Promise.all([
      podiumApi.getLiveOutposts(12),
      podiumApi.getTrendingOutposts("24h", 12),
      podiumApi.getTrendingOutposts("7d", 12),
      podiumApi.getPopularTags(16),
    ]);
    return { live, trending: { "24h": trending24h, "7d": trending7d }, tags };
  },
  ["home-discovery"],
  { revalidate: 60, tags: ["home-outposts"] }
);

export default async function Home() {
  const [outposts, statistics, recentUsers, discovery] = await Promise.all([
    getCachedOutposts(),
    getCachedStatistics(),
    getCachedRecentUsers(),
    getCachedDiscovery(),
  ]);

  const featuredEvents = sortFeaturedOutposts(outposts);

  return (
    <HomeContainer
      featuredEvents={featuredEvents}
      statistics={statistics}
      recentUsers={recentUsers}
      live={discovery.live}
      trending={discovery.trending}
      tags={discovery.tags}
    />
  );
}
