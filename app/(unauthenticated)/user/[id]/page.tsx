import { UserDetails } from "app/containers/userDetails";
import podiumApi from "app/services/api";
import { notFound } from "next/navigation";
import { generateMetadata, generateStructuredData } from "./_metadata";

interface Props {
  params: Promise<{ id: string }>;
}

export { generateMetadata };

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
