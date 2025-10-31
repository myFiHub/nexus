"use client";

import { useEffect, useState } from "react";

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

export function useJoyrideTheme(): JoyrideTheme {
  const [theme, setTheme] = useState<JoyrideTheme>(defaultTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const root = document.documentElement;
      const css = getComputedStyle(root);
      const isDark = root.classList.contains("dark");
      const primary = css.getPropertyValue("--primary").trim() || theme.primary;
      const foreground =
        css.getPropertyValue("--foreground").trim() || theme.foreground;
      const muted =
        css.getPropertyValue("--muted-foreground").trim() ||
        theme.foregroundMuted;
      const card = css.getPropertyValue("--card").trim() || theme.card;
      const border = css.getPropertyValue("--border").trim() || theme.border;
      const radius = css.getPropertyValue("--radius").trim() || theme.radius;
      setTheme({
        primary,
        foreground,
        foregroundMuted: muted,
        card,
        border,
        radius,
        overlay: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
      });
    } catch {}
  }, []);

  return theme;
}


