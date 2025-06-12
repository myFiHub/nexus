import React from "react";

interface FeatureCardProps {
  title: string;
  children: React.ReactNode;
}

export function FeatureCard({ title, children }: FeatureCardProps) {
  return (
    <div className="bg-card-bg rounded-xl shadow-lg p-6 flex-1 min-w-[260px] max-w-sm">
      <h3 className="text-xl font-bold mb-2 text-[var(--primary)]">{title}</h3>
      <p className="text-[var(--muted-foreground)]">{children}</p>
    </div>
  );
}
