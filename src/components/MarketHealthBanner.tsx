"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, RefreshCw, TriangleAlert } from "lucide-react";
import type { MarketPullStatus } from "@/db/portfolio-service";

const POLL_MS = 60_000;

function eastTime(iso: string): string {
  if (!iso) return "an unknown time";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "an unknown time";
  return dt.toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * A slim amber banner shown on every tab when the most recent market-data
 * pull came back partial or failed (quotes came from the local cache). It
 * prevents acting on stale prices that otherwise fail silently.
 */
export default function MarketHealthBanner({
  onRetried,
}: {
  /** Called after a retry attempt so the workbook can re-render fresh data. */
  onRetried?: () => void;
}) {
  const [status, setStatus] = useState<MarketPullStatus | null>(null);
  const [retrying, setRetrying] = useState(false);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const response = await fetch("/api/market-health", {
        cache: "no-store",
      });
      const body = response.ok ? await response.json() : null;
      if (body && typeof body.ok !== "undefined") {
        setStatus(body as MarketPullStatus);
      }
    } catch {
      /* The banner self-hides until the next poll — never speaks on error. */
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  const retry = async () => {
    setRetrying(true);
    try {
      const response = await fetch("/api/market-health", {
        method: "POST",
        cache: "no-store",
      });
      const body = response.ok ? await response.json() : null;
      if (body && typeof body.ok !== "undefined") {
        setStatus(body as MarketPullStatus);
      }
      onRetried?.();
    } catch {
      /* Keep the last known snapshot visible. */
    } finally {
      setRetrying(false);
    }
  };

  if (!status || status.ok || status.cached.length === 0) return null;

  const fullOutage = status.live.length === 0;
  const cachedCount = status.cached.length;
  const total = Math.max(cachedCount + status.live.length, status.symbolCount);

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 px-3 py-1.5 text-amber-900"
    >
      <div className="mx-auto flex max-w-[1700px] flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1.5">
          <TriangleAlert size={13} aria-hidden="true" />
          {fullOutage
            ? `Market pull failed — showing cached prices for all ${total} symbol${
                total === 1 ? "" : "s"
              }.`
            : `Market pull partial — ${cachedCount} of ${total} symbols are showing cached prices.`}
          <span className="font-normal text-amber-800/80">
            Quotes as of {eastTime(status.attemptedAt)} (Eastern). Prices may
            be stale until the next pull.
          </span>
        </span>
        <button
          type="button"
          onClick={() => void retry()}
          disabled={retrying}
          className="inline-flex items-center gap-1 rounded border border-amber-400 bg-white/70 px-2 py-0.5 font-semibold text-amber-900 transition hover:bg-white disabled:opacity-60"
        >
          {retrying ? (
            <LoaderCircle size={12} className="animate-spin" />
          ) : (
            <RefreshCw size={12} aria-hidden="true" />
          )}
          {retrying ? "Retrying pull…" : "Retry now"}
        </button>
        <span className="font-normal text-amber-800/70">Auto-pull retries on your refresh cycle.</span>
      </div>
    </div>
  );
}
