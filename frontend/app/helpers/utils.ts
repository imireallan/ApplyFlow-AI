import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));


// i'm getting match scores in this format 0.4166, create a utility that converst to a percentage
export const toPercentage = (score: number) => {
  const percentage = Math.round(score * 100);
  return percentage
}
