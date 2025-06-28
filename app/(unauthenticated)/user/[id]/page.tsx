import { UserDetails } from "app/containers/userDetails";
import { logoUrl } from "app/lib/constants";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

// Helper function to generate rich description
function generateUserDescription(user: User): string {
  const name = user.name || "User";
  const stats = [];

  if (user.followers_count && user.followers_count > 0) {
    stats.push(
      `${user.followers_count} follower${user.followers_count !== 1 ? "s" : ""}`
    );
  }

  if (user.followings_count && user.followings_count > 0) {
    stats.push(`${user.followings_count} following`);
  }

  if (user.referrals_count && user.referrals_count > 0) {
    stats.push(
      `${user.referrals_count} referral${user.referrals_count !== 1 ? "s" : ""}`
    );
  }

  const statsText = stats.length > 0 ? ` • ${stats.join(" • ")}` : "";

  return `View ${name}'s profile on Podium Nexus. ${statsText} Join the community and connect with like-minded individuals.`;
}

// Helper function to get user stats summary
function getUserStatsSummary(user: User): string {
  const stats = [];

  if (user.followers_count) {
    stats.push(
      `${user.followers_count} follower${user.followers_count !== 1 ? "s" : ""}`
    );
  }

  if (user.followings_count) {
    stats.push(`${user.followings_count} following`);
  }

  if (user.referrals_count) {
    stats.push(
      `${user.referrals_count} referral${user.referrals_count !== 1 ? "s" : ""}`
    );
  }

  return stats.join(" • ") || "New member";
}

// Helper function to generate structured data
function generateStructuredData(user: User, userId: string) {
  const name = user.name || "User";
  const profileUrl = `${
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com"
  }/user/${userId}`;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": profileUrl,
    name: name,
    url: profileUrl,
    ...(user.image && {
      image: user.image,
    }),
    ...(user.aptos_address && {
      identifier: {
        "@type": "PropertyValue",
        name: "Movement Address",
        value: user.aptos_address,
      },
    }),
    ...(user.followers_count && {
      follower: {
        "@type": "QuantitativeValue",
        value: user.followers_count,
      },
    }),
    ...(user.followings_count && {
      follows: {
        "@type": "QuantitativeValue",
        value: user.followings_count,
      },
    }),
    ...(user.referrals_count && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Referrals",
        value: user.referrals_count,
      },
    }),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await podiumApi.getUserData(id);

  if (!user) {
    return {
      title: "User Not Found | Podium Nexus",
      description:
        "The requested user profile could not be found. Explore other community members on Podium Nexus.",
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
      openGraph: {
        title: "User Not Found | Podium Nexus",
        description:
          "The requested user profile could not be found. Explore other community members on Podium Nexus.",
        type: "website",
        siteName: "Podium Nexus",
        images: [
          {
            url: logoUrl,
            width: 1200,
            height: 630,
            alt: "Podium Nexus - Connect and Converse",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "User Not Found | Podium Nexus",
        description:
          "The requested user profile could not be found. Explore other community members on Podium Nexus.",
        images: [logoUrl],
      },
    };
  }

  const name = user.name || "User";
  const description = generateUserDescription(user);
  const statsSummary = getUserStatsSummary(user);
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";
  const profileUrl = `${baseUrl}/user/${id}`;

  // Generate dynamic title based on user stats
  let title = name;
  if (user.followers_count && user.followers_count > 100) {
    title = `${name} • ${user.followers_count} followers`;
  } else if (statsSummary !== "New member") {
    title = `${name} • ${statsSummary}`;
  }

  // Enhanced metadata following Next.js 15 best practices
  const metadata: Metadata = {
    title: `${title} | Podium Nexus`,
    description: description,
    keywords: [
      "user profile",
      "community member",
      "social platform",
      "connect",
      "follow",
      "podium nexus user",
      name.toLowerCase(),
      ...(user.aptos_address ? ["Movement", "blockchain", "web3"] : []),
    ],
    authors: [{ name: name }],
    creator: name,
    publisher: "Podium Nexus",
    formatDetection: {
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/user/${id}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: profileUrl,
      siteName: "Podium Nexus",
      locale: "en_US",
      type: "profile",
      images: [
        {
          url: user.image || logoUrl,
          width: 1200,
          height: 630,
          alt: `${name}'s profile on Podium Nexus`,
        },
      ],
      ...(user.aptos_address && {
        "profile:username": user.aptos_address,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [user.image || logoUrl],
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
      "profile:name": name,
      "profile:followers_count": user.followers_count?.toString() || "0",
      "profile:followings_count": user.followings_count?.toString() || "0",
      "profile:referrals_count": user.referrals_count?.toString() || "0",
      "profile:received_cheer_count":
        user.received_cheer_count?.toString() || "0",
      "profile:received_boo_count": user.received_boo_count?.toString() || "0",
      "profile:is_over_18": user.is_over_18?.toString() || "false",
      ...(user.aptos_address && {
        "profile:movement_address": user.aptos_address,
      }),
    },
  };

  return metadata;
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

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  const [user, passBuyers, followers, followings] = await Promise.all([
    podiumApi.getUserData(id),
    podiumApi.podiumPassBuyers(id),
    podiumApi.getFollowersOfUser(id),
    podiumApi.getFollowingsOfUser(id),
  ]);

  if (!user) {
    notFound();
  }

  // Generate structured data for better SEO
  const structuredData = generateStructuredData(user, id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <UserDetails
        user={user}
        passBuyers={passBuyers}
        followers={followers}
        followings={followings}
      />
    </>
  );
}
