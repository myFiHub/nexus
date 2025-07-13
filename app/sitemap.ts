import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/all_outposts`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/create_outpost`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/my_outposts`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  // Dynamic pages - Outposts
  let outpostPages: MetadataRoute.Sitemap = [];
  try {
    const outposts = await podiumApi.getOutposts(0, 1000); // Get first 1000 outposts
    if (!(outposts instanceof Error)) {
      outpostPages = outposts.map((outpost: OutpostModel) => ({
        url: `${baseUrl}/outpost_details/${outpost.uuid}`,
        lastModified: outpost.created_at
          ? new Date(outpost.created_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Error fetching outposts for sitemap:", error);
  }

  // Dynamic pages - Users (getting recent users from recent outposts)
  let userPages: MetadataRoute.Sitemap = [];
  try {
    const recentOutposts = await podiumApi.getOutposts(0, 100);
    if (!(recentOutposts instanceof Error)) {
      const uniqueUserIds = [
        ...new Set(
          recentOutposts.map(
            (outpost: OutpostModel) => outpost.creator_user_uuid
          )
        ),
      ];

      userPages = uniqueUserIds.slice(0, 500).map((userId: string) => ({
        url: `${baseUrl}/user/${userId}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error fetching users for sitemap:", error);
  }

  return [...staticPages, ...outpostPages, ...userPages];
}
