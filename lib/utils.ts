import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (text: string, length = 8) => {
  // keeps from the start and end of the text, half of the length from the start and end
  return text.slice(0, length / 2) + "..." + text.slice(-length / 2);
};
