import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import {
  DiscoveredOutpost,
  OutpostModel,
  PopularTag,
  RecentlyJoinedUser,
  Statistics,
  TrendingWindow,
} from "app/services/api/types";
import { EventsList } from "./EventsList";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { MemberHome } from "./MemberHome";
import { PersonaSection } from "./PersonaSection";
import { PublicRails } from "./PublicRails";
import { StatsStrip } from "./StatsStrip";
import { TrustFooter } from "./TrustFooter";

/**
 * Signed-in and guest variants are both server-rendered; html[data-auth]
 * (set before paint) decides which one is visible.
 */
export const HomeContainer = ({
  featuredEvents,
  statistics,
  recentUsers,
  live,
  trending,
  tags,
}: {
  featuredEvents: OutpostModel[];
  statistics?: Statistics;
  recentUsers: RecentlyJoinedUser[];
  live: DiscoveredOutpost[];
  trending: Record<TrendingWindow, DiscoveredOutpost[]>;
  tags: PopularTag[];
}) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <RouteLoaderCleaner />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col gap-10">
        <div className="member-only">
          <MemberHome />
        </div>
        <div className="guest-only flex flex-col gap-10 pt-8">
          <HeroSection statistics={statistics} recentUsers={recentUsers} />
          <StatsStrip statistics={statistics} />
        </div>

        <PublicRails live={live} trending={trending} tags={tags} />

        {featuredEvents.length > 0 && <EventsList featuredEvents={featuredEvents} />}

        <div className="guest-only flex flex-col">
          <div className="py-16">
            <PersonaSection />
          </div>
          <div className="py-16">
            <FeaturesSection />
          </div>
          <div className="py-16">
            <HowItWorksSection />
          </div>
          <TrustFooter />
        </div>
      </div>
    </div>
  );
};
