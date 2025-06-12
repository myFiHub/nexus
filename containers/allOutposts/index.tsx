import { Suspense } from "react";
import { OutpostsList } from "../../components/outpost/OutpostsList";
import { OutpostModel } from "../../services/api/types";

interface AllOutpostsContainerProps {
  initialOutposts: OutpostModel[];
}

export const AllOutpostsContainer = ({
  initialOutposts,
}: AllOutpostsContainerProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">All Outposts</h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] rounded-xl shadow-lg h-[300px] animate-pulse"
              />
            ))}
          </div>
        }
      >
        <OutpostsList outposts={initialOutposts} />
      </Suspense>
    </div>
  );
};
