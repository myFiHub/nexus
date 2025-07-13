import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/ongoing_outpost/*",
          "/create_outpost",
          "/my_outposts",
          "/profile",
          "/_next/",
          "/static/",
          "/admin/",
          "/private/",
          "/temp/",
          "/tmp/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/ongoing_outpost/*",
          "/create_outpost",
          "/my_outposts",
          "/profile",
          "/_next/",
          "/static/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/api/",
          "/ongoing_outpost/*",
          "/create_outpost",
          "/my_outposts",
          "/profile",
          "/_next/",
          "/static/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
