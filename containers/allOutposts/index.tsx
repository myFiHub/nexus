import { Suspense } from "react";
import { OutpostCardSkeleton } from "../../components/outpost/OutpostCardSkeleton";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {Array.from({ length: 6 }).map((_, index) => (
              <OutpostCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <ClientOutpostsList initialOutposts={initialOutposts} />
      </Suspense>
    </div>
  );
};
