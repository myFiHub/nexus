import { logoUrl } from "app/lib/constants";

interface User {
  uuid: string;
  name?: string;
  image?: string;
  aptos_address?: string;
}

interface UsersStructuredDataProps {
  users: User[];
  filterTitle: string;
  filterDescription: string;
}

const baseUrl =
  process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com";

export default function UsersStructuredData({
  users,
  filterTitle,
  filterDescription,
}: UsersStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: filterTitle,
    description: filterDescription,
    numberOfItems: users.length,
    itemListElement: users.map((user, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: user.name || "Anonymous",
        image: user.image || logoUrl,
        url: `${baseUrl}/user/${user.uuid}`,
        ...(user.aptos_address && {
          identifier: {
            "@type": "PropertyValue",
            name: "Movement Address",
            value: user.aptos_address,
          },
        }),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
