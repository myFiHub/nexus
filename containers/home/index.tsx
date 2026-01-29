import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import {
  OutpostModel,
  RecentlyJoinedUser,
  Statistics,
} from "app/services/api/types";
import { EventsStrip } from "./EventsStrip";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";

export const HomeContainer = ({
  featuredEvents,
  statistics,
  recentUsers,
}: {
  featuredEvents: OutpostModel[];
  statistics?: Statistics;
  recentUsers: RecentlyJoinedUser[];
}) => {
  const hasEventsStrip = featuredEvents.length > 0;

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <RouteLoaderCleaner />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Events strip: first content below header, visible without scrolling */}
        {hasEventsStrip && (
          <div className="pt-16 pb-4">
            <EventsStrip featuredEvents={featuredEvents} />
          </div>
        )}
        <div className={hasEventsStrip ? "pb-10" : "pt-24 pb-16"}>
          <HeroSection statistics={statistics} recentUsers={recentUsers} />
        </div>
        <div className="py-20">
          <FeaturesSection />
        </div>
        <div className="py-20">
          <HowItWorksSection />
        </div>
      </div>
    </div>
  );
};
