import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center mb-20 items-center">
      <FeatureCard title="Lifetime Value">
        Own a piece of creator success. Pass prices grow with community
        adoption, creating value for early supporters.
      </FeatureCard>
      <FeatureCard title="Direct Support">
        Skip the middleman. Support creators directly while participating in
        their growth through smart contracts.
      </FeatureCard>
      <FeatureCard title="Community Owned">
        Join exclusive outposts where creators and fans build value together
        through transparent tokenomics.
      </FeatureCard>
    </div>
  );
}
