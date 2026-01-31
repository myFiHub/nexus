import { Gem, Target, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      title: "Lifetime Value",
      description:
        "Own a piece of creator success. Pass prices grow with community adoption, creating value for early supporters.",
      icon: <Gem className="w-6 h-6" aria-hidden />,
    },
    {
      title: "Direct Support",
      description:
        "Support creators directly while participating in their growth. No middleman.",
      icon: <Target className="w-6 h-6" aria-hidden />,
    },
    {
      title: "Community Owned",
      description:
        "Join Rooms where creators and fans build value together. Some rooms are pass-gated for exclusive access.",
      icon: <Users className="w-6 h-6" aria-hidden />,
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-purple-600 bg-clip-text text-transparent">
          Why Podium?
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Live Rooms, direct support, and community ownership
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {features.map((feature) => (
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
