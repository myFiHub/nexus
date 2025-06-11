import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { TrendingSection } from "./TrendingSection";

export const HomeContainer = () => {
  return (
    <div className="flex flex-col items-center w-full px-4 py-12">
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
    </div>
  );
};
