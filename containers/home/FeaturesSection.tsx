import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      title: "Lifetime Value",
      description:
        "Own a piece of creator success. Pass prices grow with community adoption, creating value for early supporters.",
      icon: "💎",
    },
    {
      title: "Direct Support",
      description:
        "Skip the middleman. Support creators directly while participating in their growth through smart contracts.",
      icon: "🎯",
    },
    {
      title: "Community Owned",
      description:
        "Join exclusive outposts where creators and fans build value together through transparent tokenomics.",
      icon: "🤝",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-purple-600 bg-clip-text text-transparent">
          Why Choose Podium Nexus?
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Experience the future of creator economy with our innovative platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            icon={feature.icon}
          >
            {feature.description}
          </FeatureCard>
        ))}
      </div>
    </div>
  );
}
