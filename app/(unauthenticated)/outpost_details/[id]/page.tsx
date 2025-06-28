import { OutpostDetailsContainer } from "app/containers/outpostDetails";
import { LumaEventDetails } from "app/containers/outpostDetails/components/LumaEventDetails";
import podiumApi from "app/services/api";
import { format, formatDistanceToNow } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface OutpostDetailsPageProps {
  params: {
    id: string;
  };
}

// Helper function to format date for metadata
function formatEventDate(timestamp: number): string {
  const date = new Date(timestamp);
  return format(date, "EEEE, MMMM do, yyyy 'at' h:mm a");
}

// Helper function to get time until event
function getTimeUntilEvent(timestamp: number): string {
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
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
function generateStructuredData(outpost: any) {
  const eventDate = outpost.scheduled_for
    ? new Date(outpost.scheduled_for)
    : null;
  const isLive = outpost.scheduled_for && eventDate && new Date() >= eventDate;

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: outpost.name,
    description: outpost.subject,
    startDate: eventDate ? eventDate.toISOString() : undefined,
    organizer: {
      "@type": "Person",
      name: outpost.creator_user_name,
      image: outpost.creator_user_image,
    },
    image: outpost.image,
    eventStatus: isLive
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      name: "Online Event",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  if (outpost.tags?.length > 0) {
    structuredData.keywords = outpost.tags.join(", ");
  }

  return structuredData;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const outpost = await podiumApi.getOutpost(id);

  if (!outpost) {
    return {
      title: "Outpost Not Found | Nexus",
      description:
        "The requested outpost could not be found. Explore other exciting events and conversations on Nexus.",
      openGraph: {
        title: "Outpost Not Found | Nexus",
        description:
          "The requested outpost could not be found. Explore other exciting events and conversations on Nexus.",
        type: "website",
        siteName: "Nexus",
        images: [
          {
            url: "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
            width: 1200,
            height: 630,
            alt: "Nexus - Connect and Converse",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Outpost Not Found | Nexus",
        description:
          "The requested outpost could not be found. Explore other exciting events and conversations on Nexus.",
        images: [
          "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
        ],
      },
      robots: {
        index: false,
        follow: false,
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

  // Generate dynamic title based on event status
  let title = outpost.name;
  if (isLive) {
    title = `🔴 LIVE: ${outpost.name}`;
  } else if (eventDate) {
    title = `${outpost.name} - ${timeUntil}`;
  }

  // Enhanced metadata
  const metadata: Metadata = {
    title: `${title} | Nexus`,
    description: description,
    keywords: [
      "outpost",
      "live conversation",
      "community",
      "social platform",
      "online event",
      "virtual meetup",
      ...(outpost.tags || []),
    ],
    authors: [{ name: outpost.creator_user_name }],
    creator: outpost.creator_user_name,
    publisher: "Nexus",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://nexus.com"), // Replace with actual domain
    alternates: {
      canonical: `/outpost_details/${id}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `/outpost_details/${id}`,
      siteName: "Nexus",
      locale: "en_US",
      type: "website",
      images: [
        {
          url:
            outpost.image ||
            "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
          width: 1200,
          height: 630,
          alt: outpost.name,
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
      images: [
        outpost.image ||
          "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
      ],
      creator: "@web3podium", // Replace with actual Twitter handle
      site: "@web3podium", // Replace with actual Twitter handle
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
    applicationName: "Nexus",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Nexus",
    },
  };

  // Add structured data and custom metadata
  const customMetadata: Record<string, string> = {
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
  };

  metadata.other = customMetadata;

  return metadata;
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "light dark",
};

export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#000000" },
];

export default async function OutpostDetailsPage({
  params,
}: OutpostDetailsPageProps) {
  const { id } = await params;
  const outpost = await podiumApi.getOutpost(id);

  if (!outpost) {
    notFound();
  }

  // Create the luma slot content if the outpost has a luma_event_id
  const lumaSlot = outpost.luma_event_id ? (
    <LumaEventDetails eventId={outpost.luma_event_id} />
  ) : null;

  return <OutpostDetailsContainer outpost={outpost} lumaSlot={lumaSlot} />;
}
