import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";

/** Public discovery rails (live, trending, topics), shared by home and explore. */
export const getCachedDiscovery = unstable_cache(
  async () => {
    const [live, trending24h, trending7d, tags] = await Promise.all([
      podiumApi.getLiveOutposts(12),
      podiumApi.getTrendingOutposts("24h", 12),
      podiumApi.getTrendingOutposts("7d", 12),
      podiumApi.getPopularTags(24),
    ]);
    return { live, trending: { "24h": trending24h, "7d": trending7d }, tags };
  },
  ["discovery"],
  { revalidate: 60, tags: ["home-outposts", "outposts"] }
);

export const getCachedTagOutposts = unstable_cache(
  async (tagId: number) => {
    const outposts = await podiumApi.getOutpostsByTagId(tagId, 0, 60);
    return Object.values(outposts);
  },
  ["tag-outposts"],
  { revalidate: 60, tags: ["outposts"] }
);
