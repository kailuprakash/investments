/** UI labels use minutes; API/database values and timers use seconds. */
export const AUTO_REFRESH_OPTIONS = [
  { value: 300, label: "5 mins" },
  { value: 600, label: "10 mins" },
  { value: 1800, label: "30 mins" },
  { value: 3600, label: "60 mins" },
  { value: 0, label: "Off" },
] as const;

export const DEFAULT_AUTO_REFRESH_INTERVAL = AUTO_REFRESH_OPTIONS[0].value;

/** Zero is a valid, persisted preference, never a reason to enable refresh. */
export function parseAutoRefreshInterval(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const seconds = Number(value);
  return AUTO_REFRESH_OPTIONS.some((option) => option.value === seconds)
    ? seconds
    : null;
}

/** Retain supported saved intervals/Off; migrate old intervals to five minutes. */
export function readAutoRefreshInterval(value: unknown): number {
  return parseAutoRefreshInterval(value) ?? DEFAULT_AUTO_REFRESH_INTERVAL;
}

export function formatAutoRefreshInterval(seconds: number): string {
  return AUTO_REFRESH_OPTIONS.find((option) => option.value === seconds)?.label
    ?? AUTO_REFRESH_OPTIONS[0].label;
}
