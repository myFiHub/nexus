import { Suspense } from "react";
import { LoadingOutposts } from "../../components/outpost/LoadingOutposts";
import { OutpostModel } from "../../services/api/types";
import { ClientOutpostsList } from "./ClientOutpostsList";

interface AllOutpostsContainerProps {
  initialOutposts: OutpostModel[];
}

export const AllOutpostsContainer = ({
  initialOutposts,
}: AllOutpostsContainerProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">All Outposts</h1>

      {/* Client-side component that handles both SSR and infinite scroll */}
      <Suspense
        fallback={
          <LoadingOutposts
            count={6}
            loadingText="Loading outposts..."
            showLoadingIndicator={true}
          />
        }
      >
        <ClientOutpostsList initialOutposts={initialOutposts} />
      </Suspense>
    </div>
  );
};
