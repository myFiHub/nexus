import { AnalyticsWindow, AudienceSlot } from "app/services/api/types";

export const ANALYTICS_WINDOWS: { id: AnalyticsWindow; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
];

export const DEFAULT_ANALYTICS_WINDOW: AnalyticsWindow = "30d";

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Minutes east of UTC, the sign convention the analytics API expects. */
export const localUtcOffsetMinutes = () => -new Date().getTimezoneOffset();

const countFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const hourFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric" });
const shortDateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});
const dayDateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const sessionDateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const formatCount = (value: number) => countFormat.format(value);

export const formatMinutes = (minutes: number) => {
  if (minutes < 1) return minutes <= 0 ? "0m" : "<1m";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = minutes / 60;
  if (hours < 10) return `${hours.toFixed(1)}h`;
  return `${countFormat.format(Math.round(hours))}h`;
};

export const formatPercent = (share: number) => `${Math.round(share * 100)}%`;

export const formatHour = (hour: number) =>
  hourFormat.format(new Date(2000, 0, 1, hour));

export const formatSlot = (slot: AudienceSlot) =>
  `${DAY_NAMES[Math.min(Math.max(slot.dow, 0), 6)]} ${formatHour(slot.hour)}`;

/** Daily points arrive as calendar dates in the viewer's offset, e.g. "2026-10-20". */
export const parseDay = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const formatShortDate = (date: Date) => shortDateFormat.format(date);
export const formatDayDate = (date: Date) => dayDateFormat.format(date);
export const formatSessionDate = (ms: number) => sessionDateFormat.format(ms);

interface ChainInfo {
  name: string;
  currency: string;
}

const MOVEMENT: ChainInfo = { name: "Movement", currency: "MOVE" };

const CHAINS: Record<string, ChainInfo> = {
  "126": MOVEMENT,
  movement: MOVEMENT,
  "43114": { name: "Avalanche", currency: "AVAX" },
  avalanche: { name: "Avalanche", currency: "AVAX" },
  "8453": { name: "Base", currency: "ETH" },
  base: { name: "Base", currency: "ETH" },
};

export const chainInfo = (chainId: string): ChainInfo =>
  CHAINS[chainId.toLowerCase()] ?? MOVEMENT;

export const formatAmount = (amount: number, currency: string) => {
  const text = amount.toFixed(4).replace(/\.?0+$/, "");
  return `${text} ${currency}`.trim();
};

export const formatEarned = (amount: number, chainId: string) =>
  formatAmount(amount, chainId ? chainInfo(chainId).currency : "");
