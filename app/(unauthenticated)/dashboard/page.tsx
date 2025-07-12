import { generateMetadata } from "./_metadata";

// Export metadata for SEO
export { generateMetadata };

// Generate structured data for the dashboard
function generateDashboardStructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/dashboard`,
    name: "Dashboard - Podium Nexus",
    description:
      "Discover trending outposts, active users, and community insights on Podium Nexus",
    url: `${baseUrl}/dashboard`,
    isPartOf: {
      "@type": "WebSite",
      name: "Podium Nexus",
      url: baseUrl,
    },
    about: {
      "@type": "Thing",
      name: "Community Analytics",
      description: "Platform insights and user engagement metrics",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Dashboard Sections",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trending Outposts",
          description: "Most popular and active outposts",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Active Users",
          description: "Top community members and recent activity",
        },
      ],
    },
  };
}

// This page serves as the default when accessing /dashboard directly
// The actual content is handled by the parallel routes (@users and @tokens)
export default function DashboardPage() {
  const structuredData = generateDashboardStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* The actual content is handled by parallel routes */}
    </>
  );
}
