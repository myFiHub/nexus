import { RouteLoaderCleaner } from "app/components/listeners/loading/eventBus";
import {
  OutpostModel,
  RecentlyJoinedUser,
  Statistics,
} from "app/services/api/types";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TrendingSection } from "./TrendingSection";

export const HomeContainer = ({
  trendingOutposts,
  statistics,
  recentUsers,
}: {
  trendingOutposts: OutpostModel[];
  statistics?: Statistics;
  recentUsers: RecentlyJoinedUser[];
}) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <RouteLoaderCleaner />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pt-24 pb-16">
          <HeroSection statistics={statistics} recentUsers={recentUsers} />
        </div>
        <div className="py-20">
          <FeaturesSection />
        </div>
        <div className="py-20">
          <TrendingSection trendingOutposts={trendingOutposts} />
        </div>
        <div className="py-20">
          <HowItWorksSection />
        </div>
      </div>
    </div>
  );
};
