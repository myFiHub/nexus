import { CookieKeys } from "./client-cookies";

export type ThemeId = "aurora" | "on-air" | "brass" | "deep-teal" | "paper";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  isLight: boolean;
  /** bg, surface, accent, secondary accent – used for the picker swatch. */
  swatch: [string, string, string, string];
}

export const THEMES: ThemeOption[] = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Cyan and violet glow",
    isLight: false,
    swatch: ["#0B0B1E", "#14142B", "#54E4EF", "#8B5CF6"],
  },
  {
    id: "on-air",
    name: "On Air",
    description: "Warm studio red",
    isLight: false,
    swatch: ["#131211", "#1C1A18", "#FF5B3A", "#F2C14E"],
  },
  {
    id: "brass",
    name: "Brass Studio",
    description: "Quiet graphite and brass",
    isLight: false,
    swatch: ["#0F0F10", "#18181A", "#D9A54A", "#8FA8C8"],
  },
  {
    id: "deep-teal",
    name: "Deep Teal",
    description: "Calm ocean tones",
    isLight: false,
    swatch: ["#0B1214", "#121B1E", "#3FB8A6", "#5B9BD5"],
  },
  {
    id: "paper",
    name: "Paper",
    description: "Light, ink on cream",
    isLight: true,
    swatch: ["#F4F0E8", "#FFFFFF", "#2A4BD7", "#1F7A6B"],
  },
];

export const DEFAULT_THEME: ThemeId = "aurora";

export const isThemeId = (value: string | null | undefined): value is ThemeId =>
  !!value && THEMES.some((t) => t.id === value);

/**
 * Runs in <head> before first paint so the server can render a static shell.
 * Keep in sync with applyTheme(); "light"/"dark" are pre-palette cookie values.
 */
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${
  CookieKeys.theme
}=([^;]*)/);var t=m?decodeURIComponent(m[1]):"";if(t==="dark")t="aurora";if(t==="light")t="paper";if(${JSON.stringify(
  THEMES.map((t) => t.id)
)}.indexOf(t)<0)t="${DEFAULT_THEME}";var d=document.documentElement;d.setAttribute("data-theme",t);d.classList.toggle("dark",t!=="paper");}catch(e){}})();`;
