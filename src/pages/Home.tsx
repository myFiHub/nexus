import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeatureHighlights from '../components/home/FeatureHighlights';
import TrendingOutposts from '../components/home/TrendingOutposts';
import HowItWorks from '../components/home/HowItWorks';

/**
 * Home page: landing experience for Podium Nexus
 */
const Home: React.FC = () => {
  console.debug('[Home] Rendering Home page');
  return (
    <>
      <HeroSection />
      <FeatureHighlights />
      <TrendingOutposts />
      <HowItWorks />
    </>
  );
};

export default Home; 