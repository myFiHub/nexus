import { AllOutpostsContainer } from "app/containers/allOutposts";
import { PAGE_SIZE, logoUrl } from "app/lib/constants";
import podiumApi from "app/services/api";
import { Metadata } from "next";
import { ErrorState } from "./ErrorState";

// Helper function to generate structured data for outposts listing
function generateOutpostsListStructuredData(outposts: any[]) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Outposts",
    description:
      "Discover and join exciting live conversations and events on Podium Nexus",
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
function getOutpostStats(outposts: any[]): {
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
      if (eventDate <= now) {
        live++;
      } else {
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
        title: "Outposts | Podium Nexus",
        description:
          "Discover and join exciting live conversations and events on Podium Nexus. Connect with like-minded individuals in real-time.",
        openGraph: {
          title: "Outposts | Podium Nexus",
          description:
            "Discover and join exciting live conversations and events on Podium Nexus. Connect with like-minded individuals in real-time.",
          type: "website",
          siteName: "Podium Nexus",
          images: [
            {
              url: logoUrl,
              width: 1200,
              height: 630,
              alt: "Podium Nexus - Discover Outposts",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: "Outposts | Podium Nexus",
          description:
            "Discover and join exciting live conversations and events on Podium Nexus. Connect with like-minded individuals in real-time.",
          images: [logoUrl],
          creator: "@podiumnexus",
          site: "@podiumnexus",
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
      "Discover and join exciting live conversations and events on Podium Nexus.";
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
      title: `${title} | Podium Nexus`,
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
            alt: "Podium Nexus - Discover Outposts",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [logoUrl],
        creator: "@podiumnexus",
        site: "@podiumnexus",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_VERIFICATION_CODE,
      },
      category: "social",
      classification: "social platform",
      referrer: "origin-when-cross-origin",
      applicationName: "Podium Nexus",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Podium Nexus",
      },
      other: {
        "outposts:total_count": stats.total.toString(),
        "outposts:live_count": stats.live.toString(),
        "outposts:upcoming_count": stats.upcoming.toString(),
        "outposts:trending_topics": trendingTopics.slice(0, 10).join(", "),
        "outposts:last_updated": new Date().toISOString(),
      },
    };

    return metadata;
  } catch (error) {
    // Fallback metadata in case of any error
    return {
      title: "Outposts | Podium Nexus",
      description:
        "Discover and join exciting live conversations and events on Podium Nexus. Connect with like-minded individuals in real-time.",
      openGraph: {
        title: "Outposts | Podium Nexus",
        description:
          "Discover and join exciting live conversations and events on Podium Nexus. Connect with like-minded individuals in real-time.",
        type: "website",
        siteName: "Podium Nexus",
        images: [
          {
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: "Podium Nexus - Discover Outposts",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Outposts | Podium Nexus",
        description:
          "Discover and join exciting live conversations and events on Podium Nexus. Connect with like-minded individuals in real-time.",
        images: [logoUrl],
        creator: "@podiumnexus",
        site: "@podiumnexus",
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#000000" },
];

export default async function AllOutpostsPage() {
  try {
    const outposts = await podiumApi.getOutposts(0, PAGE_SIZE);

    if (outposts instanceof Error) {
      return <ErrorState />;
    }

    // Generate structured data for better SEO
    const structuredData = generateOutpostsListStructuredData(outposts);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <AllOutpostsContainer initialOutposts={outposts} />
      </>
    );
  } catch (error) {
    console.error("Error loading outposts:", error);
    return <ErrorState />;
  }
}
