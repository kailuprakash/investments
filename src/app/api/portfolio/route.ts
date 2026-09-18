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
