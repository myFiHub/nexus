import { logoUrl } from "app/lib/constants";
import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { Metadata } from "next";

// Helper function to generate structured data for outposts listing
export function generateOutpostsListStructuredData(outposts: any[]) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Outposts",
    description: "Discover and join exciting live conversations and events.",
    numberOfItems: outposts.length,
    itemListElement: outposts.map((outpost, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: outpost.name,
        description: outpost.subject,
        startDate: outpost.scheduled_for
          ? new Date(outpost.scheduled_for).toISOString()
          : undefined,
        organizer: {
          "@type": "Person",
          name: outpost.creator_user_name,
          image: outpost.creator_user_image,
        },
        image: outpost.image,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          name: "Online Event",
        },
        url: `${baseUrl}/outpost_details/${outpost.uuid}`,
      },
    })),
  };
}

// Helper function to get trending topics from outposts
function getTrendingTopics(outposts: any[]): string[] {
  const topicCount: { [key: string]: number } = {};

  outposts.forEach((outpost) => {
    if (outpost.tags) {
      outpost.tags.forEach((tag: string) => {
        topicCount[tag] = (topicCount[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(topicCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([topic]) => topic);
}

// Helper function to get live and upcoming stats
function getOutpostStats(outposts: OutpostModel[]): {
  live: number;
  upcoming: number;
  total: number;
} {
  const now = new Date();
  let live = 0;
  let upcoming = 0;

  outposts.forEach((outpost) => {
    if (outpost.scheduled_for) {
      const eventDate = new Date(outpost.scheduled_for);
      if (eventDate <= now && (outpost.online_users_count ?? 0) > 0) {
        live++;
      } else if (eventDate > now) {
        upcoming++;
      }
    }
  });

  return { live, upcoming, total: outposts.length };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const outposts = await podiumApi.getOutposts(0, 50);

    if (outposts instanceof Error) {
      return {
        title: "Outposts",
        description:
          "Discover and join exciting live conversations and events. Connect with like-minded individuals in real-time.",
        openGraph: {
          title: "Outposts",
          description:
            "Discover and join exciting live conversations and events. Connect with like-minded individuals in real-time.",
          type: "website",
          siteName: "Podium Nexus",
          images: [
            {
              url: logoUrl,
              width: 1200,
              height: 630,
              alt: "Discover Outposts",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: "Outposts",
          description:
            "Discover and join exciting live conversations and events. Connect with like-minded individuals in real-time.",
          images: [logoUrl],
          creator: "@web3podium",
          site: "@web3podium",
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    const trendingTopics = getTrendingTopics(outposts);
    const stats = getOutpostStats(outposts);

    // Generate dynamic description based on current outposts
    let description =
      "Discover and join exciting live conversations and events.";
    if (stats.live > 0) {
      description += ` ${stats.live} live events happening now.`;
    }
    if (stats.upcoming > 0) {
      description += ` ${stats.upcoming} upcoming events to join.`;
    }
    if (trendingTopics.length > 0) {
      description += ` Trending topics: ${trendingTopics
        .slice(0, 5)
        .join(", ")}.`;
    }
    description += " Connect with like-minded individuals in real-time.";

    // Generate dynamic title
    let title = "Outposts";
    if (stats.live > 0) {
      title = `${stats.live} Live Outposts`;
    } else if (stats.upcoming > 0) {
      title = `${stats.upcoming} Upcoming Outposts`;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";
    const outpostsUrl = `${baseUrl}/all_outposts`;

    // Enhanced metadata following Next.js 15 best practices
    const metadata: Metadata = {
      title: title,
      description: description,
      keywords: [
        "outposts",
        "live conversations",
        "virtual events",
        "online meetups",
        "community",
        "social platform",
        "real-time chat",
        "live streaming",
        "virtual meetups",
        "online discussions",
        "podium nexus",
        ...trendingTopics.slice(0, 10),
      ],
      authors: [{ name: "Podium Nexus Team" }],
      creator: "Podium Nexus",
      publisher: "Podium Nexus",
      formatDetection: {
        address: false,
        telephone: false,
      },
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: "/all_outposts",
      },
      openGraph: {
        title: title,
        description: description,
        url: outpostsUrl,
        siteName: "Podium Nexus",
        locale: "en_US",
        type: "website",
        images: [
          {
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: "Discover Outposts",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [logoUrl],
        creator: "@web3podium",
        site: "@web3podium",
      },
      robots: {
        index: true,
        follow: true,
      },
    };

    return metadata;
  } catch {
    return {
      title: "Outposts",
      description: "Discover and join exciting live conversations and events.",
    };
  }
}
