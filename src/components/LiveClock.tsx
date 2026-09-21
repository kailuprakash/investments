"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const TZ = "America/New_York";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

/**
 * A live, ticking clock rendered in U.S. Eastern time (EST/EDT). It updates
 * every second on the client. The label reads "ET" because America/New_York
 * automatically switches between EST and EDT, so a fixed "EST" would be wrong
 * for ~8 months of the year.
 */
export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dateText = now ? dateFmt.format(now) : "—";
  const timeText = now ? timeFmt.format(now) : "--:--:--";

  return (
    <time
      className="portfolio-refresh-time portfolio-live-clock"
      dateTime={now ? now.toISOString() : undefined}
      title="Current Eastern time (ET)"
      aria-label={now ? `${dateText} ${timeText} Eastern time` : "Loading Eastern time"}
      suppressHydrationWarning
    >
      <Clock3 className="h-2.5 w-2.5 text-emerald-300" aria-hidden="true" />
      <span className="portfolio-live-clock-value">
        {dateText} · {timeText} ET
      </span>
    </time>
  );
}
