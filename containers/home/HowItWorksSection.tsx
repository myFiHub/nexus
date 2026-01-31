import { AppLink } from "app/components/AppLink";
import { AppPages } from "app/lib/routes";
import {
  Link2,
  Search,
  Mic,
  Gem,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Sign up",
    description: "Create an account with your social login or wallet.",
    icon: Link2,
  },
  {
    number: 2,
    title: "Discover rooms",
    description: "Find live discussions on topics you love.",
    icon: Search,
  },
  {
    number: 3,
    title: "Participate",
    description: "React, speak, and support creators.",
    icon: Mic,
  },
  {
    number: 4,
    title: "Share & earn",
    description: "Own passes, unlock perks, and grow with the community.",
    icon: Gem,
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full flex flex-col items-center py-20 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] rounded-3xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-purple-500/5" />

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          How it works
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Get started in just 4 simple steps
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center items-stretch relative z-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-background rounded-3xl flex flex-col items-center p-8 w-full max-w-xs shadow-xl hover:shadow-2xl transition-all duration-200 border border-[var(--border)] relative group"
            >
              {/* Step number */}
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 text-white text-3xl font-bold mb-6 shadow-lg border-4 border-[var(--card)] relative overflow-hidden group-hover:scale-110 transition-transform duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                {step.number}
              </div>

              {/* Icon (accessible) */}
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]" aria-hidden>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4 text-center group-hover:text-[var(--primary)] transition-colors duration-200">
                {step.title}
              </h3>

              <p className="text-[var(--muted-foreground)] text-center text-base leading-relaxed">
                {step.description}
              </p>

              {/* Progress line (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[var(--primary)] to-purple-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="mt-16 text-center relative z-10">
        <AppLink
          href={AppPages.createOutpost}
          underline={false}
          className="bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          Get Started Today
        </AppLink>
      </div>
    </section>
  );
}
