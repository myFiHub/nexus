import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { UserDetails } from "app/containers/userDetails";
import { CookieKeys } from "app/lib/client-cookies";
import { AppPages } from "app/lib/routes";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { generateMetadata, generateStructuredData } from "./_metadata";

interface Props {
  params: Promise<{ id: string }>;
}

// Cached API functions
const getUserDataCached = (id: string) =>
  unstable_cache(
    () => podiumApi.getUserByUuidOrAptosAddress(id),
    [`user-data-${id}`],
    {
      tags: [`user-data-${id}`],
    }
  );

const getPodiumPassBuyersCached = (id: string) =>
  unstable_cache(
    () => podiumApi.podiumPassBuyers(id),
    [`user-pass-buyers-${id}`],
    {
      tags: [`user-pass-buyers-${id}`],
    }
  );

const getFollowersCached = (id: string) =>
  unstable_cache(
    () => podiumApi.getFollowersOfUser(id),
    [`user-followers-${id}`],
    {
      tags: [`user-followers-${id}`],
    }
  );

const getFollowingsCached = (id: string) =>
  unstable_cache(
    () => podiumApi.getFollowingsOfUser(id),
    [`user-followings-${id}`],
    {
      tags: [`user-followings-${id}`],
    }
  );

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
    redirect(AppPages.profile);
  }

  const [user, passBuyers, followers, followings] = await Promise.all([
    getUserDataCached(id)(),
    getPodiumPassBuyersCached(id)(),
    getFollowersCached(id)(),
    getFollowingsCached(id)(),
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
      <RouteLoaderCleaner />
      <UserDetails
        user={user}
        passBuyers={passBuyers}
        followers={followers}
        followings={followings}
      />
    </>
  );
}
