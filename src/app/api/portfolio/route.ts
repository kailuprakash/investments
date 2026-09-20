import { NextRequest, NextResponse } from "next/server";
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
} from "@/db/portfolio-service";

export async function GET(req: NextRequest) {
  try {
    const symbol = req.nextUrl.searchParams.get("symbol");
    if (symbol) {
      const quote = await fetchSymbolQuote(symbol);
      return NextResponse.json(quote);
    }
    const portfolio = await getPortfolioState();
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    if (action === "set-auto-refresh-interval" || action === "update-settings") {
      const interval =
        data?.autoRefreshInterval !== undefined
          ? data.autoRefreshInterval
          : data?.interval !== undefined
          ? data.interval
          : data;
      if (interval !== undefined && !isNaN(Number(interval))) {
        await setSetting("auto_refresh_interval", String(Number(interval)));
      }
      const portfolio = await getPortfolioState();
      return NextResponse.json({ portfolio });
    }

    const portfolio = await getPortfolioState();
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Operation failed" },
      { status: 500 }
    );
  }
}
