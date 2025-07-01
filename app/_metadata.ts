import podiumApi from "app/services/api";
import { Metadata } from "next";
import { logoUrl } from "../lib/constants";

// Helper function to generate structured data for the home page
export function generateHomeStructuredData(trendingOutposts: any[]) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Podium Nexus",
    description:
      "Connect, Create, Collaborate - Join collaborative outposts and build meaningful communities",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/all_outposts`,
      "query-input": "required name=search_term_string",
    },
    ...(trendingOutposts.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        name: "Trending Outposts",
        numberOfItems: trendingOutposts.length,
        itemListElement: trendingOutposts.map((outpost, index) => ({
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
      },
    }),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Get trending outposts for dynamic metadata
    const trendingOutposts = await podiumApi.getOutposts(0, 3);
    const outposts = trendingOutposts instanceof Error ? [] : trendingOutposts;

    const baseUrl =
      process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

    // Generate dynamic description based on current outposts
    let description =
      "Podium Nexus is a platform for creating and joining collaborative outposts. Connect with creators, participate in live events, and build meaningful communities.";

    if (outposts.length > 0) {
      const liveCount = outposts.filter((outpost) => {
        if (!outpost.scheduled_for) return false;
        const eventDate = new Date(outpost.scheduled_for);
        return new Date() >= eventDate;
      }).length;

      if (liveCount > 0) {
        description += ` ${liveCount} live events happening now.`;
      }
    }

    // Enhanced metadata following Next.js 15 best practices
    const metadata: Metadata = {
      title: "Podium Nexus - Connect, Create, Collaborate",
      description: description,
      keywords: [
        "collaboration",
        "outposts",
        "live events",
        "community",
        "creators",
        "social platform",
        "virtual meetups",
        "online discussions",
        "real-time chat",
        "live streaming",
        "podium nexus",
      ],
      authors: [{ name: "Podium Nexus Team" }],
      creator: "Podium Nexus",
      publisher: "Podium Nexus",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: "/",
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: "Podium Nexus - Connect, Create, Collaborate",
        description: description,
        siteName: "Podium Nexus",
        images: [
          {
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: "Podium Nexus - Connect, Create, Collaborate",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Podium Nexus - Connect, Create, Collaborate",
        description: description,
        images: [logoUrl],
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
        google: process.env.GOOGLE_VERIFICATION_CODE,
      },
      category: "social",
      classification: "social networking",
      referrer: "origin-when-cross-origin",
      applicationName: "Podium Nexus",
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Podium Nexus",
      },
      other: {
        "platform:type": "social networking",
        "platform:features": "live events,outposts,community,creators",
        "platform:live_events": outposts.length > 0 ? "true" : "false",
      },
    };

    return metadata;
  } catch (error) {
    // Fallback metadata if API fails
    return {
      title: "Podium Nexus - Connect, Create, Collaborate",
      description:
        "Podium Nexus is a platform for creating and joining collaborative outposts. Connect with creators, participate in live events, and build meaningful communities.",
      openGraph: {
        title: "Podium Nexus - Connect, Create, Collaborate",
        description:
          "Podium Nexus is a platform for creating and joining collaborative outposts. Connect with creators, participate in live events, and build meaningful communities.",
        type: "website",
        siteName: "Podium Nexus",
        images: [
          {
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: "Podium Nexus - Connect, Create, Collaborate",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Podium Nexus - Connect, Create, Collaborate",
        description:
          "Podium Nexus is a platform for creating and joining collaborative outposts. Connect with creators, participate in live events, and build meaningful communities.",
        images: [logoUrl],
        creator: "@web3podium",
        site: "@web3podium",
      },
    };
  }
}
