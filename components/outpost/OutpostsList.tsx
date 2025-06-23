import { OutpostModel } from "../../services/api/types";
import { OutpostCard } from "./outpostCard";

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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
