import { NextRequest, NextResponse } from "next/server";
import { captureDueSnapshots, getSnapshotStatus } from "@/db/portfolio-service";

export const dynamic = "force-dynamic";

/**
 * Unattended entry point for the Saturday 9 PM Eastern snapshot.
 *
 * A serverless app has no resident clock, so this route is what an external
 * scheduler calls: Vercel Cron (see vercel.json), GitHub Actions, cron-runner,
 * or a plain crontab + curl. It is safe to call far more often than needed —
 * the capture is idempotent and keyed by (account, week-ending), so a daily or
 * hourly ping costs one indexed read when nothing is due, and cannot double
 * count. That also neutralises the DST trap: rather than chasing 21:00 Eastern
 * as a fixed UTC cron hour (which flips between 01:00 and 02:00 UTC across the
 * year), the schedule is resolved from the wall clock inside captureDueSnapshots.
 *
 * Auth: when CRON_SECRET is set, callers must present it as a bearer token
 * (Vercel Cron does this automatically). Unset = open, for local/dev.
 */
function authorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("authorization") ?? "";
  const fromHeader = header.replace(/^Bearer\s+/i, "").trim();
  const fromQuery = req.nextUrl.searchParams.get("key") ?? "";
  return fromHeader === secret || fromQuery === secret;
}

async function run(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lookback = Number(req.nextUrl.searchParams.get("lookbackWeeks")) || undefined;
  const recalc = req.nextUrl.searchParams.get("mode") === "recalculate";

  try {
    const capture = await captureDueSnapshots({
      force: recalc,
      lookbackWeeks: lookback ?? 26,
      // A scheduler ping is authoritative; bypass the request-level throttle.
      bypassThrottle: true,
    });
    const status = await getSnapshotStatus();
    const body = { ok: true, capture, status };
    // Make the response cache-proof so schedulers/proxies never serve a stale
    // verdict about whether a snapshot landed.
    return NextResponse.json(body, {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[cron/snapshot] failed:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Snapshot run failed" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}
