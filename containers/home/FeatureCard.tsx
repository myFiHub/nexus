import React from "react";

interface FeatureCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export function FeatureCard({ title, children, icon }: FeatureCardProps) {
  return (
    <div className="bg-[var(--card)] dark:bg-[var(--secondary)] rounded-2xl shadow-lg p-8 border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-200 group relative overflow-hidden">
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-purple-600 mb-6 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {icon}
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4 text-[var(--primary)] group-hover:text-purple-600 transition-colors duration-200">
        {title}
      </h3>

      <p className="text-[var(--card-foreground)] leading-relaxed text-base">
        {children}
      </p>

      {/* Hover indicator - positioned within the card */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--primary)] to-purple-600 w-0 group-hover:w-full transition-all duration-300" />
    </div>
  );
}
