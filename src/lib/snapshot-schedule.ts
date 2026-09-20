/**
 * Snapshot schedule maths for the workbook's weekly / monthly history.
 *
 * The sheets are specified as "EVERY SATURDAY 9 PM EST", which needs care:
 *
 *  - The user's wall clock is U.S. Eastern, which observes DST. 21:00 in July
 *    is 01:00 UTC, while 21:00 in January is 02:00 UTC. Hard-coding a -5 offset
 *    (or a single UTC cron hour) silently shifts by an hour for ~8 months of
 *    the year, which is exactly the kind of drift that makes a snapshot appear
 *    "never to have run".
 *  - Everything below therefore resolves the *wall time* through
 *    Intl.DateTimeFormat({ timeZone: "America/New_York" }) rather than assuming
 *    a fixed offset.
 *
 *  - "Weekly" rows are keyed by their week-ending Saturday (YYYY-MM-DD) because
 *    the client aggregates months itself by slicing that key to YYYY-MM. Keeping
 *    the key format stable is what makes the Monthly view populate for free.
 */

export const SNAPSHOT_TZ = "America/New_York";
/** Local wall-clock hour the snapshot fires at (9 PM). */
export const SNAPSHOT_HOUR = 21;
export const SNAPSHOT_MINUTE = 0;
/** 0 = Sunday … 6 = Saturday. */
export const SNAPSHOT_WEEKDAY = 6;
const DAY_MS = 86_400_000;

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SNAPSHOT_TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
});

/** Separate formatter: the one above only yields date parts, and resolving the
 *  UTC offset needs the local hour/minute as well. */
const wallClockFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SNAPSHOT_TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type YMD = { y: number; mo: number; d: number; dow: number };

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Calendar date + weekday *as seen in Eastern time*. */
export function easternCalendarDate(instant: Date): YMD {
  const parts = formatter.formatToParts(instant);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const dow = WEEKDAYS.indexOf(pick("weekday").slice(0, 3));
  return {
    y: Number(pick("year")),
    mo: Number(pick("month")),
    d: Number(pick("day")),
    dow: dow < 0 ? 0 : dow,
  };
}

/** Treat an Eastern calendar date as a plain UTC day marker (no time zone maths). */
const dayStart = (ymd: { y: number; mo: number; d: number }) =>
  Date.UTC(ymd.y, ymd.mo - 1, ymd.d);

const ymdFromDayStart = (ms: number): YMD => {
  const dt = new Date(ms);
  const y = dt.getUTCFullYear();
  const mo = dt.getUTCMonth() + 1;
  const d = dt.getUTCDate();
  return { y, mo, d, dow: dt.getUTCDay() };
};

/**
 * Convert an Eastern wall-clock time into a real instant, resolving the UTC
 * offset for that specific date so DST is honoured. 9 PM on a Saturday is never
 * inside the 2 AM transition window, so the usual ambiguity does not apply.
 */
export function easternWallTimeToInstant(y: number, mo: number, d: number, h: number, mi: number): Date {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const parts = wallClockFormatter.formatToParts(new Date(guess));
  const pick = (t: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === t)?.value);
  const asSeenInZone = Date.UTC(pick("year"), pick("month") - 1, pick("day"), pick("hour") % 24, pick("minute"));
  const offsetMs = asSeenInZone - guess;
  return new Date(guess - offsetMs);
}

export type SnapshotMoment = {
  /** The instant the snapshot is considered due (Saturday 21:00 Eastern). */
  at: Date;
  /** Week-ending key, YYYY-MM-DD, in Eastern calendar terms. */
  weekEnding: string;
  /** Month key this week belongs to (matches the client's slice(0, 7)). */
  monthKey: string;
};

export function weekEndingKeyFromDayStart(ms: number): string {
  const { y, mo, d } = ymdFromDayStart(ms);
  return `${y}-${pad2(mo)}-${pad2(d)}`;
}

/** Saturday that closes the Sun–Sat week containing `instant`. */
export function weekEndingForInstant(instant: Date): string {
  const cur = easternCalendarDate(instant);
  const dayMs = dayStart(cur);
  return weekEndingKeyFromDayStart(dayMs + ((SNAPSHOT_WEEKDAY - cur.dow + 7) % 7) * DAY_MS);
}

const keyToDayStart = (key: string) => {
  const [y, mo, d] = key.split("-").map(Number);
  return { y, mo: mo ?? 1, d: d ?? 1 };
};

/** Due instant for a given week-ending Saturday key. */
export function snapshotInstantForWeekEnding(weekEnding: string): Date {
  const { y, mo, d } = keyToDayStart(weekEnding);
  return easternWallTimeToInstant(y, mo, d, SNAPSHOT_HOUR, SNAPSHOT_MINUTE);
}

/** Most recent Saturday 21:00 Eastern that has already happened. */
export function mostRecentSnapshotMoment(now: Date = new Date()): SnapshotMoment {
  const today = easternCalendarDate(now);
  let dayMs = dayStart(today) - ((today.dow - SNAPSHOT_WEEKDAY + 7) % 7) * DAY_MS;
  let at = snapshotInstantForWeekEnding(weekEndingKeyFromDayStart(dayMs));
  if (at.getTime() > now.getTime()) {
    dayMs -= 7 * DAY_MS;
    at = snapshotInstantForWeekEnding(weekEndingKeyFromDayStart(dayMs));
  }
  const weekEnding = weekEndingKeyFromDayStart(dayMs);
  return { at, weekEnding, monthKey: weekEnding.slice(0, 7) };
}

/** Next upcoming Saturday 21:00 Eastern. */
export function nextSnapshotMoment(now: Date = new Date()): SnapshotMoment {
  const recent = mostRecentSnapshotMoment(now);
  const dayMs = dayStart(keyToDayStart(recent.weekEnding)) + 7 * DAY_MS;
  const weekEnding = weekEndingKeyFromDayStart(dayMs);
  return { at: snapshotInstantForWeekEnding(weekEnding), weekEnding, monthKey: weekEnding.slice(0, 7) };
}

/**
 * Week-ending keys that are closed (their Saturday 9 PM has passed) but still
 * need a snapshot, oldest first, within `lookbackWeeks`.
 */
export function dueWeekKeys(
  now: Date = new Date(),
  opts: { lookbackWeeks?: number; skipClosedAfter?: string | null } = {},
): string[] {
  const lookback = Math.max(1, Math.min(opts.lookbackWeeks ?? 6, 104));
  const recent = mostRecentSnapshotMoment(now);
  const keys: string[] = [];
  let dayMs = dayStart(keyToDayStart(recent.weekEnding));
  for (let i = 0; i < lookback; i += 1) {
    const key = weekEndingKeyFromDayStart(dayMs);
    if (snapshotInstantForWeekEnding(key).getTime() <= now.getTime()) keys.unshift(key);
    dayMs -= 7 * DAY_MS;
  }
  const after = opts.skipClosedAfter;
  return after ? keys.filter((k) => k > after) : keys;
}

/** True once the Sat 21:00 Eastern boundary of that week has passed. */
export function isWeekClosed(weekEnding: string, now: Date = new Date()): boolean {
  return snapshotInstantForWeekEnding(weekEnding).getTime() <= now.getTime();
}

/**
 * Bucket a *date* (no time-of-day, e.g. what `parseDateForSort` yields for an
 * ISO or M/D/YYYY cell) into the week-ending Saturday that owns it. Working on
 * the calendar date rather than an instant avoids the several-hour skew you get
 * by comparing a midnight-UTC timestamp against an Eastern-midnight boundary —
 * which would silently push Sunday-dated trades into the previous week.
 */
export function weekEndingForDateMs(ms: number): string {
  if (!ms || !Number.isFinite(ms)) return "";
  const dt = new Date(ms);
  const shift = ((SNAPSHOT_WEEKDAY - dt.getUTCDay() + 7) % 7) * DAY_MS;
  return weekEndingKeyFromDayStart(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()) + shift);
}

/** Sunday 00:00 Eastern that opens the Sun–Sat week of `weekEnding`. */
export function weekStartInstant(weekEnding: string): Date {
  const { y, mo, d } = keyToDayStart(weekEnding);
  const saturday = Date.UTC(y, mo - 1, d);
  const sunday = ymdFromDayStart(saturday - 6 * DAY_MS);
  return easternWallTimeToInstant(sunday.y, sunday.mo, sunday.d, 0, 0);
}

export function weekEndInstant(weekEnding: string): Date {
  const { y, mo, d } = keyToDayStart(weekEnding);
  const saturday = Date.UTC(y, mo - 1, d);
  const next = ymdFromDayStart(saturday + DAY_MS);
  // Exclusive upper bound: the Sunday after the closing Saturday, 00:00 Eastern.
  return easternWallTimeToInstant(next.y, next.mo, next.d, 0, 0);
}

export function describeSchedule(now: Date = new Date()) {
  const recent = mostRecentSnapshotMoment(now);
  const next = nextSnapshotMoment(now);
  return {
    timeZone: SNAPSHOT_TZ,
    cadence: "SATURDAY_9PM_ET",
    wallClock: `${pad2(SNAPSHOT_HOUR)}:${pad2(SNAPSHOT_MINUTE)} Eastern`,
    mostRecentClosedWeek: recent.weekEnding,
    mostRecentSnapshotAt: recent.at.toISOString(),
    nextDueWeek: next.weekEnding,
    nextDueAt: next.at.toISOString(),
    nextDueInSeconds: Math.max(0, Math.round((next.at.getTime() - now.getTime()) / 1000)),
    dueNow: true,
  };
}
