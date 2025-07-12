import { logoUrl } from "./constants";

export interface StructuredDataContext {
  baseUrl: string;
  logoUrl: string;
}

export function createStructuredDataContext(): StructuredDataContext {
  return {
    baseUrl:
      process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com",
    logoUrl,
  };
}

// Organization schema - can be reused across pages
export function generateOrganizationSchema(context: StructuredDataContext) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${context.baseUrl}/#organization`,
    name: "Podium Nexus",
    url: context.baseUrl,
    logo: {
      "@type": "ImageObject",
      url: context.logoUrl,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://twitter.com/web3podium",
      "https://github.com/myFiHub/nexus",
    ],
    foundingDate: "2024",
    description:
      "Podium Nexus is a platform for creating and joining collaborative outposts. Connect with creators, participate in live events, and build meaningful communities.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    knowsAbout: [
      "Social Networking",
      "Live Events",
      "Community Building",
      "Virtual Meetings",
      "Web3",
      "Blockchain",
    ],
  };
}

// Website schema - main website structured data
export function generateWebsiteSchema(context: StructuredDataContext) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${context.baseUrl}/#website`,
    name: "Podium Nexus",
    url: context.baseUrl,
    description:
      "Connect, Create, Collaborate - Join collaborative outposts and build meaningful communities",
    publisher: {
      "@id": `${context.baseUrl}/#organization`,
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${context.baseUrl}/all_outposts?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
    mainEntity: {
      "@type": "WebPage",
      "@id": `${context.baseUrl}/#main`,
    },
  };
}

// BreadcrumbList schema generator
export function generateBreadcrumbSchema(
  context: StructuredDataContext,
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

// WebApplication schema
export function generateWebApplicationSchema(context: StructuredDataContext) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${context.baseUrl}/#webapp`,
    name: "Podium Nexus",
    url: context.baseUrl,
    description: "A platform for creating and joining collaborative outposts",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Create collaborative outposts",
      "Join live events",
      "Connect with creators",
      "Real-time communication",
      "Community building",
      "Virtual meetings",
    ],
    screenshot: {
      "@type": "ImageObject",
      url: context.logoUrl,
      width: 1200,
      height: 630,
    },
    author: {
      "@id": `${context.baseUrl}/#organization`,
    },
    publisher: {
      "@id": `${context.baseUrl}/#organization`,
    },
  };
}

// CollectionPage schema for listing pages
export function generateCollectionPageSchema(
  context: StructuredDataContext,
  collection: {
    name: string;
    description: string;
    url: string;
    numberOfItems: number;
    itemType: string;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": collection.url,
    name: collection.name,
    description: collection.description,
    url: collection.url,
    isPartOf: {
      "@id": `${context.baseUrl}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      name: collection.name,
      numberOfItems: collection.numberOfItems,
      itemListElement: {
        "@type": collection.itemType,
      },
    },
  };
}
