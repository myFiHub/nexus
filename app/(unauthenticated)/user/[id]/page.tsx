import { UserDetails } from "app/containers/userDetails";
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

  return `View ${name}'s profile on Nexus. ${statsText} Join the community and connect with like-minded individuals.`;
}

// Helper function to generate structured data
function generateUserStructuredData(user: User) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name || "User",
    image: user.image,
    url: `/user/${user.uuid}`,
  };

  if (user.aptos_address) {
    structuredData.identifier = {
      "@type": "PropertyValue",
      name: "Aptos Address",
      value: user.aptos_address,
    };
  }

  // Add social media profile if available
  if (user.accounts?.length > 0) {
    structuredData.sameAs = user.accounts
      .filter((account) => account.address)
      .map((account) => account.address);
  }

  // Add follower/following counts as interaction statistics
  if (user.followers_count || user.followings_count) {
    structuredData.interactionStatistic = [];

    if (user.followers_count) {
      structuredData.interactionStatistic.push({
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/FollowAction",
        userInteractionCount: user.followers_count,
      });
    }

    if (user.followings_count) {
      structuredData.interactionStatistic.push({
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/FollowAction",
        userInteractionCount: user.followings_count,
      });
    }
  }

  return structuredData;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await podiumApi.getUserData(id);

  if (!user) {
    return {
      title: "User Not Found | Nexus",
      description:
        "The requested user profile could not be found. Explore other community members on Nexus.",
      openGraph: {
        title: "User Not Found | Nexus",
        description:
          "The requested user profile could not be found. Explore other community members on Nexus.",
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
        title: "User Not Found | Nexus",
        description:
          "The requested user profile could not be found. Explore other community members on Nexus.",
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

  const name = user.name || "User";
  const description = generateUserDescription(user);
  const statsSummary = getUserStatsSummary(user);

  // Generate dynamic title based on user stats
  let title = name;
  if (user.followers_count && user.followers_count > 100) {
    title = `${name} • ${user.followers_count} followers`;
  } else if (statsSummary !== "New member") {
    title = `${name} • ${statsSummary}`;
  }

  // Enhanced metadata
  const metadata: Metadata = {
    title: `${title} | Nexus`,
    description: description,
    keywords: [
      "user profile",
      "community member",
      "social platform",
      "connect",
      "follow",
      "nexus user",
      name.toLowerCase(),
      ...(user.aptos_address ? ["aptos", "blockchain"] : []),
    ],
    authors: [{ name: name }],
    creator: name,
    publisher: "Nexus",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://nexus.com"), // Replace with actual domain
    alternates: {
      canonical: `/user/${id}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `/user/${id}`,
      siteName: "Nexus",
      locale: "en_US",
      type: "profile",
      images: [
        {
          url:
            user.image ||
            "https://firebasestorage.googleapis.com/v0/b/podium-b809c.appspot.com/o/logo.png?alt=media&token=3c44b7b8-e2a3-46b4-81ad-a565df0ff172",
          width: 1200,
          height: 630,
          alt: `${name}'s profile`,
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
      images: [
        user.image ||
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

  // Add custom metadata
  const customMetadata: Record<string, string> = {
    "profile:name": name,
    "profile:followers_count": user.followers_count?.toString() || "0",
    "profile:followings_count": user.followings_count?.toString() || "0",
    "profile:referrals_count": user.referrals_count?.toString() || "0",
    "profile:received_cheer_count":
      user.received_cheer_count?.toString() || "0",
    "profile:received_boo_count": user.received_boo_count?.toString() || "0",
    "profile:is_over_18": user.is_over_18?.toString() || "false",
    ...(user.aptos_address && {
      "profile:aptos_address": user.aptos_address,
    }),
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

  return (
    <UserDetails
      user={user}
      passBuyers={passBuyers}
      followers={followers}
      followings={followings}
    />
  );
}
