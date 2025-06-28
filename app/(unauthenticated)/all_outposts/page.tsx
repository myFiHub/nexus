import { AllOutpostsContainer } from "app/containers/allOutposts";
import podiumApi from "app/services/api";
import { AlertCircle } from "lucide-react";
import { Metadata } from "next";
import { ErrorState } from "./ErrorState";

// Helper function to generate structured data for outposts listing
function generateOutpostsListStructuredData(outposts: any[]) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Outposts",
    description:
      "Discover and join exciting live conversations and events on Nexus",
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
        url: `/outpost_details/${outpost.uuid}`,
      },
    })),
  };

  return structuredData;
}

// Helper function to get trending topics from outposts
function getTrendingTopics(outposts: any[]): string[] {
  const tagCounts: Record<string, number> = {};

  outposts.forEach((outpost) => {
    if (outpost.tags) {
      outpost.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);
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
        title: "Outposts | Nexus",
        description:
          "Discover and join exciting live conversations and events on Nexus. Connect with like-minded individuals in real-time.",
        openGraph: {
          title: "Outposts | Nexus",
          description:
            "Discover and join exciting live conversations and events on Nexus. Connect with like-minded individuals in real-time.",
          type: "website",
          siteName: "Nexus",
          images: [
            {
              url: "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
              width: 1200,
              height: 630,
              alt: "Nexus - Discover Outposts",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: "Outposts | Nexus",
          description:
            "Discover and join exciting live conversations and events on Nexus. Connect with like-minded individuals in real-time.",
          images: [
            "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
          ],
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
      "Discover and join exciting live conversations and events on Nexus.";
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

    // Enhanced metadata
    const metadata: Metadata = {
      title: `${title} | Nexus`,
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
        ...trendingTopics.slice(0, 10),
      ],
      authors: [{ name: "Nexus Team" }],
      creator: "Nexus",
      publisher: "Nexus",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL("https://nexus.com"), // Replace with actual domain
      alternates: {
        canonical: "/all_outposts",
      },
      openGraph: {
        title: title,
        description: description,
        url: "/all_outposts",
        siteName: "Nexus",
        locale: "en_US",
        type: "website",
        images: [
          {
            url: "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
            width: 1200,
            height: 630,
            alt: "Nexus - Discover Outposts",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [
          "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
        ],
        creator: "@web3podium",
        site: "@web3podium",
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
        google: "your-google-verification-code", // Replace with actual verification code
      },
      category: "social",
      classification: "social platform",
      referrer: "origin-when-cross-origin",
      colorScheme: "light dark",
      viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
      },
      applicationName: "Nexus",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Nexus",
      },
    };

    // Add custom metadata
    const customMetadata: Record<string, string> = {
      "outposts:total_count": stats.total.toString(),
      "outposts:live_count": stats.live.toString(),
      "outposts:upcoming_count": stats.upcoming.toString(),
      "outposts:trending_topics": trendingTopics.slice(0, 10).join(", "),
      "outposts:last_updated": new Date().toISOString(),
      "application/ld+json": JSON.stringify(
        generateOutpostsListStructuredData(outposts)
      ),
    };

    metadata.other = customMetadata;

    return metadata;
  } catch (error) {
    // Fallback metadata in case of any error
    return {
      title: "Outposts | Nexus",
      description:
        "Discover and join exciting live conversations and events on Nexus. Connect with like-minded individuals in real-time.",
      openGraph: {
        title: "Outposts | Nexus",
        description:
          "Discover and join exciting live conversations and events on Nexus. Connect with like-minded individuals in real-time.",
        type: "website",
        siteName: "Nexus",
        images: [
          {
            url: "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
            width: 1200,
            height: 630,
            alt: "Nexus - Discover Outposts",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Outposts | Nexus",
        description:
          "Discover and join exciting live conversations and events on Nexus. Connect with like-minded individuals in real-time.",
        images: [
          "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
        ],
        creator: "@web3podium",
        site: "@web3podium",
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function AllOutpostsPage() {
  const outposts = await podiumApi.getOutposts(0, 50);
  if (outposts instanceof Error) {
    return (
      <ErrorState
        error={outposts}
        title="Unable to load outposts"
        description="Please try again"
        buttonHref="/all_outposts"
        icon={<AlertCircle className="h-10 w-10 text-destructive" />}
      />
    );
  }
  return <AllOutpostsContainer initialOutposts={outposts} />;
}
