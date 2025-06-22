import { OutpostModel } from "../../services/api/types";
import OutpostLink from "../AppLink/outpostLink";
import { OutpostCard } from "./OutpostCard";

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
        <OutpostLink
          underline={false}
          key={outpost.uuid}
          id={outpost.uuid}
          className="block h-full"
        >
          <OutpostCard outpost={outpost} />
        </OutpostLink>
      ))}
    </div>
  );
}
