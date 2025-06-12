import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
