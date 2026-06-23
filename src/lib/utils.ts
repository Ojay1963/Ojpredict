import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy")
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy, HH:mm")
}

export function formatKickoff(date: Date | string) {
  return format(new Date(date), "HH:mm")
}

export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getConfidenceColor(confidence: number) {
  if (confidence >= 75) return "text-green-600 bg-green-50"
  if (confidence >= 50) return "text-amber-600 bg-amber-50"
  return "text-red-600 bg-red-50"
}

export function getConfidenceBarColor(confidence: number) {
  if (confidence >= 75) return "bg-green-500"
  if (confidence >= 50) return "bg-amber-500"
  return "bg-red-500"
}

export function getTipCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    HOME_WIN: "Home Win",
    AWAY_WIN: "Away Win",
    DOUBLE_CHANCE: "Double Chance",
    DRAW: "Draw",
    OVER_15: "Over 1.5",
    OVER_25: "Over 2.5",
    OVER_35: "Over 3.5",
    BTTS: "GG/BTTS",
    HT_OVER_05: "HT Over 0.5",
    SURE_2_ODDS: "Sure 2 Odds",
    SURE_3_ODDS: "Sure 3 Odds",
    SURE_5_ODDS: "Sure 5 Odds",
    OJ_BANKER: "OJ Banker",
  }
  return labels[category] ?? category
}

export function getResultBadgeStyle(result: string) {
  switch (result) {
    case "WON":
      return "bg-green-100 text-green-800 border-green-200"
    case "LOST":
      return "bg-red-100 text-red-800 border-red-200"
    case "VOID":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "LIVE":
      return "bg-purple-100 text-purple-800 border-purple-200 animate-pulse"
    default:
      return "bg-amber-100 text-amber-800 border-amber-200"
  }
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str
}
