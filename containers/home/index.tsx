import { OutpostModel } from "app/services/api/types";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TrendingSection } from "./TrendingSection";

export const HomeContainer = ({
  trendingOutposts,
}: {
  trendingOutposts: OutpostModel[];
}) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pt-24 pb-16">
          <HeroSection />
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
