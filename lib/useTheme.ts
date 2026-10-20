"use client";

import { useSyncExternalStore } from "react";
import { CookieKeys, setClientCookie } from "./client-cookies";
import { DEFAULT_THEME, isThemeId, ThemeId } from "./theme";

const readTheme = (): ThemeId => {
  const value = document.documentElement.getAttribute("data-theme");
  return isThemeId(value) ? value : DEFAULT_THEME;
};

export const applyTheme = (id: ThemeId) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", id);
  root.classList.toggle("dark", id !== "paper");
  setClientCookie(CookieKeys.theme, id, { expires: 365 });
};

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

export const useTheme = (): ThemeId =>
  useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);

export const useIsLightTheme = () => useTheme() === "paper";
