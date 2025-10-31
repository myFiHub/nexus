import type { JoyrideTheme } from "./useJoyrideTheme";

export function buildJoyrideStyles(theme: JoyrideTheme) {
  return {
    options: {
      zIndex: 10000,
      primaryColor: theme.primary,
      textColor: theme.foreground,
      arrowColor: theme.card,
      backgroundColor: theme.card,
    },
    overlay: {
      backgroundColor: theme.overlay,
    },
    tooltip: {
      backgroundColor: theme.card,
      color: theme.foreground,
      borderRadius: theme.radius,
      border: `1px solid ${theme.border}`,
      boxShadow:
        "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    },
    tooltipContainer: {
      textAlign: "left" as const,
      fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui)",
    },
    tooltipTitle: {
      margin: 0,
      color: theme.foreground,
    },
    tooltipContent: {
      color: theme.foreground,
    },
    buttonNext: {
      backgroundColor: theme.primary,
      color: "var(--primary-foreground, #fff)",
      borderRadius: theme.radius,
      padding: "0.5rem 0.75rem",
      boxShadow: "none",
    },
    buttonBack: {
      color: theme.foregroundMuted,
      marginRight: 8,
    },
    buttonClose: {
      color: theme.foregroundMuted,
    },
    beacon: {
      boxShadow: `0 0 0 2px ${theme.primary}40`,
    },
    spotlight: {
      borderRadius: theme.radius,
    },
  };
}


