import { logoUrl } from "app/lib/constants";
import podiumApi from "app/services/api";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper function to format event date
function formatEventDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper function to get time until event
function getTimeUntilEvent(timestamp: number): string {
  const now = new Date();
  const eventDate = new Date(timestamp);
  const diff = eventDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Live Now";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `in ${days} day${days !== 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `in ${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    return `in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
}

// Helper function to generate rich description
function generateDescription(outpost: any): string {
  const baseDescription = outpost.subject || "Join this exciting outpost event";
  const creator = outpost.creator_user_name
    ? ` by ${outpost.creator_user_name}`
    : "";
  const scheduledInfo = outpost.scheduled_for
    ? ` on ${formatEventDate(outpost.scheduled_for)}`
    : "";
  const accessType = outpost.enter_type === "everyone" ? "Public" : "Private";
  const tags =
    outpost.tags?.length > 0 ? ` | Topics: ${outpost.tags.join(", ")}` : "";

  return `${baseDescription}${creator}${scheduledInfo}. ${accessType} event${tags}. Join the conversation and connect with like-minded individuals.`;
}

// Helper function to generate structured data
export function generateEventStructuredData(outpost: any, outpostId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";
  const eventUrl = `${baseUrl}/outpost_details/${outpostId}`;
  const eventDate = outpost.scheduled_for
    ? new Date(outpost.scheduled_for)
    : null;
  const isLive = eventDate && new Date() >= eventDate;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": eventUrl,
    name: outpost.name,
    description: outpost.subject,
    url: eventUrl,
    ...(eventDate && {
      startDate: eventDate.toISOString(),
      endDate: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // Assume 2 hours
    }),
    eventStatus: isLive
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      name: "Online Event",
      url: eventUrl,
    },
    organizer: {
      "@type": "Person",
      name: outpost.creator_user_name || "Anonymous",
      ...(outpost.creator_user_image && {
        image: outpost.creator_user_image,
      }),
    },
    ...(outpost.image && {
      image: outpost.image,
    }),
    ...(outpost.tags &&
      outpost.tags.length > 0 && {
        keywords: outpost.tags.join(", "),
      }),
    ...(outpost.members_count && {
      attendee: {
        "@type": "QuantitativeValue",
        value: outpost.members_count,
      },
    }),
    offers: {
      "@type": "Offer",
      availability:
        outpost.enter_type === "everyone"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const outpost = await podiumApi.getOutpost(id);

  if (!outpost) {
    return {
      title: "Outpost Not Found",
      description:
        "The requested outpost could not be found. Explore other exciting events and conversations.",
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
      openGraph: {
        title: "Outpost Not Found",
        description:
          "The requested outpost could not be found. Explore other exciting events and conversations.",
        type: "website",
        siteName: "Podium Nexus",
        images: [
          {
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: "Connect and Converse",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Outpost Not Found",
        description:
          "The requested outpost could not be found. Explore other exciting events and conversations.",
        images: [logoUrl],
      },
    };
  }

  const description = generateDescription(outpost);
  const eventDate = outpost.scheduled_for
    ? new Date(outpost.scheduled_for)
    : null;
  const isLive = eventDate && new Date() >= eventDate;
  const timeUntil = eventDate ? getTimeUntilEvent(outpost.scheduled_for) : null;
  const accessType = outpost.enter_type === "everyone" ? "Public" : "Private";
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";
  const outpostUrl = `${baseUrl}/outpost_details/${id}`;

  // Generate dynamic title based on event status
  let title = outpost.name;
  if (isLive) {
    title = `🔴 LIVE: ${outpost.name}`;
  } else if (eventDate) {
    title = `${outpost.name} - ${timeUntil}`;
  }

  // Enhanced metadata following Next.js 15 best practices
  const metadata: Metadata = {
    title: title,
    description: description,
    keywords: [
      "outpost",
      "live conversation",
      "community",
      "social platform",
      "online event",
      "virtual meetup",
      "podium nexus",
      ...(outpost.tags || []),
    ],
    authors: [{ name: outpost.creator_user_name }],
    creator: outpost.creator_user_name,
    publisher: "Podium Nexus",
    formatDetection: {
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/outpost_details/${id}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: outpostUrl,
      siteName: "Podium Nexus",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: outpost.image || logoUrl,
          width: 1200,
          height: 630,
          alt: `${outpost.name} - Event`,
        },
      ],
      ...(eventDate && {
        startTime: eventDate.toISOString(),
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [outpost.image || logoUrl],
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
    classification: "social platform",
    referrer: "origin-when-cross-origin",
    applicationName: "Podium Nexus",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Podium Nexus",
    },
    other: {
      "event:start_time": eventDate ? eventDate.toISOString() : "",
      "event:end_time": eventDate
        ? new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString()
        : "", // Assume 2 hours duration
      "event:location": "Online",
      "event:type": "Virtual Event",
      "event:access": accessType,
      "event:status": isLive ? "Live" : "Upcoming",
      "event:creator": outpost.creator_user_name,
      "event:members_count": outpost.members_count?.toString() || "0",
      "event:tags": outpost.tags?.join(", ") || "",
    },
  };

  return metadata;
}
