import { clsx, type ClassValue } from "clsx";
import { differenceInSeconds } from "date-fns";
import { twMerge } from "tailwind-merge";
export const isDev = process.env.NODE_ENV === "development";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncate(text: string, length: number = 10) {
  // truncates the middle of the text
  if (text.length <= length) {
    return text;
  }
  const mid = Math.floor(length / 2);
  return text.slice(0, mid) + "..." + text.slice(-mid);
}

// Format the countdown timer
const formatCountdown = (seconds: number) => {
  if (seconds <= 0) return "00:00:00";

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days.toString()} days ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function getTimerInfo(
  endsAt: number,
  notPassedText: string = "Starts in",
  passedText: string = "Join Now"
) {
  const eventTime = new Date(endsAt);
  const now = new Date();
  const isPassed = now >= eventTime;

  // Calculate seconds remaining until event starts (negative if event has passed)
  const secondsRemaining = differenceInSeconds(eventTime, now);

  const countdownText = formatCountdown(secondsRemaining);

  return {
    isPassed,
    countdownText,
    displayText: isPassed ? passedText : `${notPassedText} ${countdownText}`,
    secondsRemaining,
  };
}

export const generateOutpostShareUrl = (outpostId: string): string => {
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_LINK_URL;
  const outpostDetailRoute = "/outpost_details";
  return `${websiteUrl}${outpostDetailRoute}/${outpostId}`;
};

export const isUuid = (uuid: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    uuid
  );
};
