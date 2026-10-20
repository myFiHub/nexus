import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import { OutpostsList } from "app/components/outpost/OutpostsList";
import { SectionHeader } from "app/components/aurora";
import { PopularTags, PublicRails } from "app/containers/home/PublicRails";
import {
  DiscoveredOutpost,
  OutpostModel,
  PopularTag,
  TrendingWindow,
} from "../../services/api/types";
import { ClientOutpostsList } from "./ClientOutpostsList";
import { LiveFromFollowings } from "./LiveFromFollowings";

interface AllOutpostsContainerProps {
  initialOutposts: OutpostModel[];
  discovery: {
    live: DiscoveredOutpost[];
    trending: Record<TrendingWindow, DiscoveredOutpost[]>;
    tags: PopularTag[];
  };
  listError?: React.ReactNode;
}

export const AllOutpostsContainer = ({
  initialOutposts,
  discovery,
  listError,
}: AllOutpostsContainerProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      <RouteLoaderCleaner />
      <header className="animate-entrance">
        <p className="label-caps">Explore</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Find your next <span className="text-grad">outpost</span>
        </h1>
      </header>
      <PopularTags tags={discovery.tags} />
      <LiveFromFollowings />
      <PublicRails live={discovery.live} trending={discovery.trending} tags={[]} />
      <section>
        <SectionHeader title="All outposts" />
        {listError ?? (
          <>
            <OutpostsList outposts={initialOutposts} />
            <ClientOutpostsList initialOutposts={initialOutposts} />
          </>
        )}
      </section>
    </div>
  );
};
