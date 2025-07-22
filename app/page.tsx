import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { HomeContainer } from "../containers/home";
import { generateMetadata } from "./_metadata";

// Export the metadata function
export { generateMetadata };

// Cache the trending outposts data with ISR
const getCachedTrendingOutposts = unstable_cache(
  async () => {
    const results = await podiumApi.getOutposts(0, 3);
    if (results instanceof Error) {
      return [];
    }
    return results;
  },
  ["trending-outposts"],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ["trending-outposts"],
  }
);

const getCachedStatistics = unstable_cache(
  async () => {
    const results = await podiumApi.getStatistics();
    console.log("results", results);
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
    getCachedTrendingOutposts(),
    getCachedStatistics(),
    getCachedRecentUsers(),
  ]);

  return (
    <HomeContainer
      trendingOutposts={outposts}
      statistics={statistics}
      recentUsers={recentUsers}
    />
  );
}
