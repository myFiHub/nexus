import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import {
  OutpostModel,
  RecentlyJoinedUser,
  Statistics,
} from "app/services/api/types";
import { EventsList } from "./EventsList";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PersonaSection } from "./PersonaSection";
import { StatsStrip } from "./StatsStrip";
import { TrustFooter } from "./TrustFooter";

export const HomeContainer = ({
  featuredEvents,
  statistics,
  recentUsers,
}: {
  featuredEvents: OutpostModel[];
  statistics?: Statistics;
  recentUsers: RecentlyJoinedUser[];
}) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <RouteLoaderCleaner />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {featuredEvents.length > 0 && (
          <div className="pt-16 pb-4">
            <EventsList featuredEvents={featuredEvents} />
          </div>
        )}
        <div className="pt-8 pb-10">
          <HeroSection statistics={statistics} recentUsers={recentUsers} />
        </div>
        <div className="pb-16">
          <StatsStrip statistics={statistics} />
        </div>
        <div className="py-20">
          <PersonaSection />
        </div>
        <div className="py-20">
          <FeaturesSection />
        </div>
        <div className="py-20">
          <HowItWorksSection />
        </div>
        <TrustFooter />
      </div>
    </div>
  );
};
