const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});
const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: "short" });
const monthDayFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});
const monthFormat = new Intl.DateTimeFormat(undefined, { month: "short" });
const compactFormat = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

const startOfDay = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/** `45m`, `2h 5m`, `12h`. */
export const compactMinutes = (minutes: number) => {
  const total = Math.round(minutes);
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (hours >= 10 || rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
};

export const compactNumber = (value: number) => compactFormat.format(value);

/** When a scheduled outpost starts, relative to now. */
export const whenLabel = (atMs: number, nowMs: number) => {
  const diff = atMs - nowMs;
  if (diff < MINUTE) return "Starting now";
  if (diff < HOUR) return `In ${Math.floor(diff / MINUTE)} min`;
  const time = timeFormat.format(atMs);
  const days = Math.round((startOfDay(atMs) - startOfDay(nowMs)) / DAY);
  if (days === 0) {
    return diff < 6 * HOUR ? `In ${Math.floor(diff / HOUR)}h` : `Today · ${time}`;
  }
  if (days === 1) return `Tomorrow · ${time}`;
  if (days < 7) return `${weekdayFormat.format(atMs)} · ${time}`;
  return `${monthDayFormat.format(atMs)} · ${time}`;
};

/** `just now`, `5m ago`, `3h ago`, `2d ago`, `Mar 4`. */
export const agoLabel = (atMs: number, nowMs: number) => {
  const diff = nowMs - atMs;
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return monthDayFormat.format(atMs);
};

export const monthShort = (ms: number) => monthFormat.format(ms).toUpperCase();

export const weekdayInitial = (ms: number) => weekdayFormat.format(ms).charAt(0);
