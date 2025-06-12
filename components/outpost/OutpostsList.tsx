import { OutpostModel } from "../../services/api/types";
import { AppLink } from "../AppLink";
import { OutpostCard } from "./OutpostCard";

interface OutpostsListProps {
  outposts: OutpostModel[];
}

export function OutpostsList({ outposts }: OutpostsListProps) {
  if (!outposts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--muted-foreground)]">No outposts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {outposts.map((outpost) => (
        <AppLink
          key={outpost.uuid}
          href={`/outpost_details/${outpost.uuid}`}
          className="block h-full"
        >
          <OutpostCard outpost={outpost} />
        </AppLink>
      ))}
    </div>
  );
}
