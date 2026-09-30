import { NextRequest, NextResponse } from "next/server";
import { requirePortfolioAuth } from "@/lib/auth";
import { db } from "@/db";
import { transactionHistoryTable } from "@/db/schema";
import {
  ensureDbSeeded,
  captureDueSnapshots,
  getSnapshotStatus,
  buildLivePeriodSnapshot,
  buildLiveMonthTransactionTotals,
} from "@/db/portfolio-service";
import { desc, asc } from "drizzle-orm";

/**
 * Weekly / monthly buy–sell totals per account. Aggregates are reconstructed
 * from the stored transactions (every trade carries its own date), so a
 * catch-up run can back-fill several weeks at once — unlike the account-value
 * snapshot, which can only be measured while it happens.
 */
export async function GET(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    await ensureDbSeeded();
    // Buy/Sell history is derived from dated ledger rows. Rebuild recent closed
    // weeks so prior-week totals remain correct after late imports/edits and
    // old account-number formatting does not leave stale zero placeholders.
    const capture = await captureDueSnapshots({
      force: true,
      lookbackWeeks: 8,
      bypassThrottle: true,
    }).catch((error: unknown) => {
      console.error("[transaction-history] reconciliation failed:", error);
      return null;
    });
    const history = await db
      .select()
      .from(transactionHistoryTable)
      .orderBy(desc(transactionHistoryTable.snapshotWeek), asc(transactionHistoryTable.accountNumber));
    // Fresh current-period totals computed at load time (never persisted).
    const [live, liveMonth] = await Promise.all([
      buildLivePeriodSnapshot().catch((error: unknown) => {
        console.error("[transaction-history] live snapshot failed:", error);
        return null;
      }),
      buildLiveMonthTransactionTotals().catch((error: unknown) => {
        console.error("[transaction-history] live month totals failed:", error);
        return null;
      }),
    ]);
    return NextResponse.json({
      history,
      live: live
        ? {
            capturedAt: live.capturedAt,
            weekEnding: live.weekEnding,
            monthKey: live.monthKey,
            nextSnapshotAt: live.nextSnapshotAt,
            transactions: live.transactions,
            monthTransactions: liveMonth,
          }
        : null,
      snapshot: capture,
      status: await getSnapshotStatus().catch(() => null),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load transaction history" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "capture");
    const capture = await captureDueSnapshots({
      // Transaction history is derived from the trade ledger, so a manual
      // capture always reconciles prior closed weeks; `recalculate` retains
      // the same behavior for compatibility with the existing UI.
      force: action === "capture" || action === "recalculate",
      lookbackWeeks: Number(body?.lookbackWeeks) || undefined,
      bypassThrottle: true,
    });
    const history = await db
      .select()
      .from(transactionHistoryTable)
      .orderBy(desc(transactionHistoryTable.snapshotWeek), asc(transactionHistoryTable.accountNumber));

    return NextResponse.json({ capture, history, status: await getSnapshotStatus() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update transaction history" },
      { status: 500 },
    );
  }
}
