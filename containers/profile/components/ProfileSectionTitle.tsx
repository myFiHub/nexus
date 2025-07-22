"use client";
import { cn } from "app/lib/utils";

export function ProfileSectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-2xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm",
        className
      )}
    >
      {children}
    </h2>
  );
}
