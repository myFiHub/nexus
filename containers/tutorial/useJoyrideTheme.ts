"use client";

import { useTheme } from "app/lib/useTheme";
import { useHydrated } from "app/hooks/use-hydrated";
import { useMemo } from "react";

export type JoyrideTheme = {
  primary: string;
  foreground: string;
  foregroundMuted: string;
  card: string;
  border: string;
  radius: string;
  overlay: string;
};

const defaultTheme: JoyrideTheme = {
  primary: "#7c3aed",
  foreground: "#0f172a",
  foregroundMuted: "#6b7280",
  card: "#ffffff",
  border: "#e5e7eb",
  radius: "10px",
  overlay: "rgba(0,0,0,0.4)",
};

function readJoyrideTheme(): JoyrideTheme {
  try {
    const root = document.documentElement;
    const css = getComputedStyle(root);
    const read = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;
    return {
      primary: read("--primary", defaultTheme.primary),
      foreground: read("--foreground", defaultTheme.foreground),
      foregroundMuted: read("--muted-foreground", defaultTheme.foregroundMuted),
      card: read("--card", defaultTheme.card),
      border: read("--border", defaultTheme.border),
      radius: read("--radius", defaultTheme.radius),
      overlay: root.classList.contains("dark") ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
    };
  } catch {
    return defaultTheme;
  }
}

/** Joyride colors read from the active theme's CSS variables. */
export function useJoyrideTheme(): JoyrideTheme {
  const themeId = useTheme();
  const hydrated = useHydrated();
  return useMemo(
    () => (hydrated && themeId ? readJoyrideTheme() : defaultTheme),
    [hydrated, themeId]
  );
}
