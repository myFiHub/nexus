import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

    // Get recent outposts for RSS feed
    const outposts = await podiumApi.getOutposts(0, 50);

    if (outposts instanceof Error) {
      return new Response("Error fetching outposts", { status: 500 });
    }

    // Filter and sort outposts by creation date
    const sortedOutposts = outposts
      .filter((outpost: OutpostModel) => outpost.created_at)
      .sort(
        (a: OutpostModel, b: OutpostModel) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      )
      .slice(0, 20); // Limit to 20 most recent items

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Podium Nexus - Latest Outposts</title>
    <description>Discover the latest collaborative outposts, live events, and community discussions on Podium Nexus</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <ttl>60</ttl>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <managingEditor>team@podiumnexus.com (Podium Nexus Team)</managingEditor>
    <webMaster>team@podiumnexus.com (Podium Nexus Team)</webMaster>
    <generator>Podium Nexus RSS Generator</generator>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Podium Nexus</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${sortedOutposts
      .map((outpost: OutpostModel) => {
        const pubDate = outpost.created_at
          ? new Date(outpost.created_at).toUTCString()
          : new Date().toUTCString();
        const scheduledDate = outpost.scheduled_for
          ? new Date(outpost.scheduled_for)
          : null;
        const isLive = scheduledDate && new Date() >= scheduledDate;

        return `
    <item>
      <title><![CDATA[${isLive ? "🔴 LIVE: " : ""}${outpost.name}]]></title>
      <description><![CDATA[${
        outpost.subject ||
        "Join this exciting outpost and connect with the community"
      }]]></description>
      <link>${baseUrl}/outpost_details/${outpost.uuid}</link>
      <guid isPermaLink="true">${baseUrl}/outpost_details/${outpost.uuid}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${outpost.creator_user_name}]]></dc:creator>
      <category><![CDATA[Outpost]]></category>
      ${
        outpost.tags
          ? outpost.tags
              .map((tag) => `<category><![CDATA[${tag}]]></category>`)
              .join("")
          : ""
      }
      ${
        outpost.image
          ? `<enclosure url="${outpost.image}" type="image/jpeg" />`
          : ""
      }
      <content:encoded><![CDATA[
        <div>
          ${
            outpost.image
              ? `<img src="${outpost.image}" alt="${outpost.name}" style="max-width: 100%; height: auto; margin-bottom: 16px;" />`
              : ""
          }
          <h2>${outpost.name}</h2>
          <p><strong>Created by:</strong> ${outpost.creator_user_name}</p>
          ${
            outpost.subject
              ? `<p><strong>Description:</strong> ${outpost.subject}</p>`
              : ""
          }
          ${
            scheduledDate
              ? `<p><strong>Scheduled for:</strong> ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}</p>`
              : ""
          }
          ${
            outpost.members_count
              ? `<p><strong>Members:</strong> ${outpost.members_count}</p>`
              : ""
          }
          ${
            outpost.online_users_count
              ? `<p><strong>Online now:</strong> ${outpost.online_users_count}</p>`
              : ""
          }
          ${
            outpost.tags && outpost.tags.length > 0
              ? `<p><strong>Tags:</strong> ${outpost.tags.join(", ")}</p>`
              : ""
          }
          <p><a href="${baseUrl}/outpost_details/${
          outpost.uuid
        }">Join this outpost →</a></p>
        </div>
      ]]></content:encoded>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("RSS generation error:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}

// Also handle HEAD requests for RSS feed
export async function HEAD() {
  return new Response(null, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
