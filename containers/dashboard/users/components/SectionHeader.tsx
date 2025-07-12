"use client";

import { useRouter } from "next/navigation";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  seeMore?: {
    href?: string;
    params?: any;
  };
}

export const SectionHeader = ({ icon, title, seeMore }: SectionHeaderProps) => {
  const router = useRouter();

  const handleSeeMore = () => {
    if (seeMore?.href) {
      // If params exist, you could append them as query parameters
      const url = seeMore.params
        ? `${seeMore.href}?${new URLSearchParams(seeMore.params).toString()}`
        : seeMore.href;
      router.push(url);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      {seeMore && (
        <button
          onClick={handleSeeMore}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          See more
        </button>
      )}
    </div>
  );
};
