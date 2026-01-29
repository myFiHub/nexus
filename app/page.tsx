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

export default async function Home() {
  const [outposts, statistics, recentUsers] = await Promise.all([
    getCachedOutposts(),
    getCachedStatistics(),
    getCachedRecentUsers(),
  ]);

  const featuredEvents = sortFeaturedOutposts(outposts);

  return (
    <HomeContainer
      featuredEvents={featuredEvents}
      statistics={statistics}
      recentUsers={recentUsers}
    />
  );
}
