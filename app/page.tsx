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

export default async function Home() {
  const outposts = await getCachedTrendingOutposts();

  return <HomeContainer trendingOutposts={outposts} />;
}
