const steps = [
  {
    number: 1,
    title: "Connect",
    description: "Sign in with your social account or wallet",
  },
  {
    number: 2,
    title: "Discover",
    description: "Find creators you want to support",
  },
  {
    number: 3,
    title: "Support",
    description: "Buy passes and join exclusive communities",
  },
  {
    number: 4,
    title: "Grow",
    description: "Watch your value grow with the community",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full flex flex-col items-center py-16 bg-[#232336] rounded-3xl mt-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
        How Podium Nexus Works
      </h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center items-center">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-[#181824] rounded-2xl flex flex-col items-center p-8 w-full max-w-xs shadow-lg"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#C94BFF] text-white text-3xl font-bold mb-4 shadow-md border-4 border-[#232336]">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">
              {step.title}
            </h3>
            <p className="text-[var(--muted-foreground)] text-center text-base">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
