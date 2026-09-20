import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { weeklyHistoryTable } from "@/db/schema";
import {
  ensureDbSeeded,
  captureDueSnapshots,
  getSnapshotStatus,
} from "@/db/portfolio-service";
import { desc, asc } from "drizzle-orm";

/**
 * Weekly (and, via the client's YYYY-MM grouping, monthly) account value
 * history. Reading it first gives the Saturday 9 PM Eastern snapshot a chance
 * to land, so history catches up even when the app was closed at snapshot time.
 */
export async function GET() {
  try {
    await ensureDbSeeded();
    const capture = await captureDueSnapshots().catch((error: unknown) => {
      console.error("[weekly-history] lazy capture failed:", error);
      return null;
    });
    const history = await db
      .select()
      .from(weeklyHistoryTable)
      .orderBy(desc(weeklyHistoryTable.snapshotWeek), asc(weeklyHistoryTable.accountNumber));
    return NextResponse.json({
      history,
      snapshot: capture,
      status: await getSnapshotStatus().catch(() => null),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load account history" },
      { status: 500 },
    );
  }
}

/**
 * Explicit maintenance for the history panel:
 *   capture     – fill any closed week that has no row yet (same as GET, unbypassed throttle)
 *   recalculate – re-derive the current period from live values / stored trades
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "capture");
    const force = action === "recalculate";

    const capture = await captureDueSnapshots({
      force,
      lookbackWeeks: Number(body?.lookbackWeeks) || undefined,
    });
    const history = await db
      .select()
      .from(weeklyHistoryTable)
      .orderBy(desc(weeklyHistoryTable.snapshotWeek), asc(weeklyHistoryTable.accountNumber));

    return NextResponse.json({
      capture,
      history,
      status: await getSnapshotStatus(),
      ...(force ? { recalculated: true } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update account history" },
      { status: 500 },
    );
  }
}
