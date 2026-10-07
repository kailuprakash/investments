import { NextRequest, NextResponse } from "next/server";
import { requirePortfolioAuth } from "@/lib/auth";
import {
  parseAutoRefreshInterval,
} from "@/lib/auto-refresh";
import {
  getPortfolioState,
  fetchSymbolQuote,
  refreshAllMarketPrices,
  executeFutureTrade,
  updateCurrentHoldingField,
  editFutureTransaction,
  saveHolding,
  saveAccount,
  importExcelWorkbookData,
  setSetting,
  captureDueSnapshots,
  buildPortfolioState,
  deleteHolding,
  deleteFutureTransaction,
  TransactionEditError,
} from "@/db/portfolio-service";

export async function GET(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const symbol = req.nextUrl.searchParams.get("symbol");
    if (symbol) {
      const quote = await fetchSymbolQuote(symbol);
      return NextResponse.json(quote);
    }
    const portfolio = await getPortfolioState();
    return NextResponse.json(portfolio, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch portfolio",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  const transactionIdParam = req.nextUrl.searchParams.get("transactionId");
  if (transactionIdParam !== null) {
    const transactionId = Number(transactionIdParam);
    if (
      !Number.isSafeInteger(transactionId) ||
      transactionId <= 0 ||
      transactionId > 2147483647
    ) {
      return NextResponse.json(
        { error: "A valid transaction ID is required" },
        { status: 400 },
      );
    }
    try {
      const result = await deleteFutureTransaction(transactionId);
      return NextResponse.json(result, {
        headers: { "Cache-Control": "no-store" },
      });
    } catch (error) {
      console.error("DELETE /api/portfolio (transaction) error:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unable to delete the transaction. Please try again.",
        },
        { status: error instanceof TransactionEditError ? error.status : 500 },
      );
    }
  }

  const id = Number(req.nextUrl.searchParams.get("holdingId"));
  if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) {
    return NextResponse.json(
      { error: "A valid holding ID is required" },
      { status: 400 },
    );
  }
  try {
    const deleted = await deleteHolding(id);
    if (!deleted)
      return NextResponse.json(
        {
          error:
            "This holding no longer exists. Refresh the sheet and try again.",
        },
        { status: 404 },
      );
    // Do not trigger snapshot capture as a side effect of a row deletion.
    const portfolio = await buildPortfolioState();
    return NextResponse.json(
      { deleted, portfolio },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("DELETE /api/portfolio error:", error);
    return NextResponse.json(
      { error: "Unable to delete the holding. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const body = await req.json();
    const { action, data } = body || {};

    if (action === "refresh-market") {
      const portfolio = await refreshAllMarketPrices();
      return NextResponse.json({ portfolio });
    }

    if (action === "future-trade") {
      const portfolio = await executeFutureTrade(data);
      return NextResponse.json({ portfolio });
    }

    if (action === "update-current-field") {
      const portfolio = await updateCurrentHoldingField(data);
      return NextResponse.json({ portfolio });
    }

    if (action === "edit-future") {
      const portfolio = await editFutureTransaction(data);
      return NextResponse.json({ portfolio });
    }

    if (action === "save-current") {
      const portfolio = await saveHolding(data);
      return NextResponse.json({ portfolio });
    }

    if (action === "save-account") {
      const portfolio = await saveAccount(data);
      return NextResponse.json({ portfolio });
    }

    if (action === "import-excel-data") {
      const res = await importExcelWorkbookData(data);
      return NextResponse.json(res);
    }

    if (action === "capture-history" || action === "capture-snapshots") {
      // Manual "run the 9 PM ET snapshot now" – back-fills any closed week.
      const capture = await captureDueSnapshots({
        force: data?.mode === "recalculate" || data?.force === true,
        bypassThrottle: true,
      });
      const portfolio = await buildPortfolioState();
      return NextResponse.json({ capture, portfolio });
    }

    if (
      action === "set-auto-refresh-interval" ||
      action === "update-settings"
    ) {
      const interval =
        data?.autoRefreshInterval !== undefined
          ? data.autoRefreshInterval
          : data?.interval !== undefined
            ? data.interval
            : data;
      const seconds = parseAutoRefreshInterval(interval);
      if (seconds === null) {
        return NextResponse.json(
          {
            error: "Choose 5 m, 10 m, 30 m, 60 m, or Off.",
          },
          { status: 400 },
        );
      }
      await setSetting("auto_refresh_interval", String(seconds));
      const portfolio = await buildPortfolioState();
      return NextResponse.json(
        { portfolio },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const portfolio = await getPortfolioState();
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Operation failed" },
      { status: error instanceof TransactionEditError ? error.status : 500 },
    );
  }
}
