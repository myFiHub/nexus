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
    revalidate: 10, // Revalidate every 10 seconds
    tags: ["outposts"],
  }
);

export default async function AllOutpostsPage() {
  try {
    return (
      <Suspense
        fallback={
          <LoadingOutposts
            count={9}
            loadingText="Loading outposts..."
            showLoadingIndicator={true}
            loadingIndicatorPosition="bottom"
          />
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
      <AllOutpostsContainer initialOutposts={outposts} />
    </>
  );
};
