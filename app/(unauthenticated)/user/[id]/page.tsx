import { UserDetails } from "app/containers/userDetails";
import { CookieKeys } from "app/lib/client-cookies";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { generateMetadata, generateStructuredData } from "./_metadata";

interface Props {
  params: Promise<{ id: string }>;
}

export { generateMetadata };

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  // Server-side guard: check if user is viewing their own profile
  // This must be done BEFORE any other async operations
  let myUserId: string | undefined;
  let myUserMoveAddress: string | undefined;
  try {
    const cookieStore = await cookies();
    myUserId = cookieStore.get(CookieKeys.myUserId)?.value;
    myUserMoveAddress = cookieStore.get(CookieKeys.myMoveAddress)?.value;
  } catch (error) {
    console.error("Error checking user ID from cookies:", error);
  }

  // Redirect if user is viewing their own profile
  if (
    (myUserId && myUserId === id) ||
    (myUserMoveAddress && myUserMoveAddress === id)
  ) {
    redirect("/profile");
  }

  // Create cached versions of API calls with individual tags
  const getUserDataCached = unstable_cache(
    () => podiumApi.getUserData(id),
    [`user-data-${id}`],
    {
      tags: [`user-data-${id}`],
    }
  );

  const getPodiumPassBuyersCached = unstable_cache(
    () => podiumApi.podiumPassBuyers(id),
    [`user-pass-buyers-${id}`],
    {
      tags: [`user-pass-buyers-${id}`],
    }
  );

  const getFollowersCached = unstable_cache(
    () => podiumApi.getFollowersOfUser(id),
    [`user-followers-${id}`],
    {
      tags: [`user-followers-${id}`],
    }
  );

  const getFollowingsCached = unstable_cache(
    () => podiumApi.getFollowingsOfUser(id),
    [`user-followings-${id}`],
    {
      tags: [`user-followings-${id}`],
    }
  );

  const [user, passBuyers, followers, followings] = await Promise.all([
    getUserDataCached(),
    getPodiumPassBuyersCached(),
    getFollowersCached(),
    getFollowingsCached(),
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
