import { LoadingOutposts } from "app/components/outpost/LoadingOutposts";
import { AllOutpostsContainer } from "app/containers/allOutposts";
import { PAGE_SIZE } from "app/lib/constants";
import podiumApi from "app/services/api";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import {
  generateMetadata,
  generateOutpostsListStructuredData,
} from "./_metadata";
import { ErrorState } from "./ErrorState";

export { generateMetadata };

// Cache the outposts data with ISR
const getCachedOutposts = unstable_cache(
  async () => {
    return await podiumApi.getOutposts(0, PAGE_SIZE);
  },
  ["all-outposts"],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ["outposts"],
  }
);

export default async function AllOutpostsPage() {
  try {
    return (
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">
              All Outposts
            </h1>
            <LoadingOutposts
              count={9}
              loadingText="Loading outposts..."
              showLoadingIndicator={true}
              loadingIndicatorPosition="bottom"
            />
          </div>
        }
      >
        <InitialOutpostsList />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading outposts:", error);
    return <ErrorState />;
  }
}

const InitialOutpostsList = async () => {
  const outposts = await getCachedOutposts();

  if (outposts instanceof Error || !outposts.length) {
    return <ErrorState />;
  }

  const sortedOutposts = outposts.sort((a, b) => {
    return a.last_active_at - b.last_active_at;
  });
  const sortedByOnlineMembers = sortedOutposts.sort((a, b) => {
    return (b.online_users_count ?? 0) - (a.online_users_count ?? 0);
  });

  // Generate structured data for better SEO
  const structuredData = generateOutpostsListStructuredData(outposts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <AllOutpostsContainer initialOutposts={sortedByOnlineMembers} />
    </>
  );
};
