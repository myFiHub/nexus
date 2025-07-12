import { logoUrl } from "app/lib/constants";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

  const metadata: Metadata = {
    title: "Dashboard - Podium Nexus",
    description:
      "Discover trending outposts, active users, and community insights on Podium Nexus. Stay updated with real-time platform analytics and user engagement metrics.",
    keywords: [
      "dashboard",
      "analytics",
      "trending outposts",
      "active users",
      "community insights",
      "platform metrics",
      "user engagement",
      "social platform",
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
      canonical: "/dashboard",
    },
    openGraph: {
      title: "Dashboard - Podium Nexus",
      description:
        "Discover trending outposts, active users, and community insights on Podium Nexus.",
      url: `${baseUrl}/dashboard`,
      siteName: "Podium Nexus",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "Podium Nexus Dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dashboard - Podium Nexus",
      description:
        "Discover trending outposts, active users, and community insights on Podium Nexus.",
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
      "page:type": "dashboard",
      "page:features": "trending,analytics,insights,community",
    },
  };

  return metadata;
}
