import { AllOutpostsContainer } from "app/containers/allOutposts";
import { PAGE_SIZE } from "app/lib/constants";
import podiumApi from "app/services/api";
import {
  generateMetadata,
  generateOutpostsListStructuredData,
} from "./_metadata";
import { ErrorState } from "./ErrorState";

export { generateMetadata };

export default async function AllOutpostsPage() {
  try {
    const outposts = await podiumApi.getOutposts(0, PAGE_SIZE);

    if (outposts instanceof Error) {
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
  } catch (error) {
    console.error("Error loading outposts:", error);
    return <ErrorState />;
  }
}
