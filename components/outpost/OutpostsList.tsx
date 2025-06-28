import { OutpostModel } from "../../services/api/types";
import { OutpostCard } from "./outpostCard";
import { OutpostCardSkeleton } from "./OutpostCardSkeleton";

interface OutpostsListProps {
  outposts: OutpostModel[];
  loading?: boolean;
  error?: string;
  noOutpostComponent?: React.ReactNode;
}

export function OutpostsList({
  outposts,
  loading,
  error,
  noOutpostComponent,
}: OutpostsListProps) {
  if (loading && outposts.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {Array.from({ length: 6 }).map((_, index) => (
          <OutpostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium mb-2">
          Error loading outposts
        </div>
        <div className="text-muted-foreground">{error}</div>
      </div>
    );
  }

  if (!outposts.length) {
    return (
      <div className="text-center py-12">
        {noOutpostComponent ?? "No outposts"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {outposts.map((outpost) => (
        <OutpostCard key={outpost.uuid} outpost={outpost} />
      ))}
    </div>
  );
}
