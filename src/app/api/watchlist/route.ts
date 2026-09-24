import { NextRequest, NextResponse } from "next/server";
import { requirePortfolioAuth } from "@/lib/auth";
import { db } from "@/db";
import { watchlistTable } from "@/db/schema";
import { ensureDbSeeded, searchMarketSymbols } from "@/db/portfolio-service";
import { eq, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    await ensureDbSeeded();
    const items = await db.select().from(watchlistTable).orderBy(asc(watchlistTable.symbol));
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    await ensureDbSeeded();
    const body = await req.json();
    const symbol = String(body?.symbol || "").trim().toUpperCase();
    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const suggestions = await searchMarketSymbols(symbol);
    const match =
      suggestions.find((s: { symbol: string }) => s.symbol.toUpperCase() === symbol) ||
      suggestions[0];

    await db
      .insert(watchlistTable)
      .values({
        symbol,
        name: match?.name || `${symbol} Corp.`,
        exchange: match?.exchange || "NASDAQ",
        quoteType: match?.quoteType || "Equity",
        createdAt: new Date().toISOString(),
      })
      .onConflictDoNothing();

    const items = await db.select().from(watchlistTable).orderBy(asc(watchlistTable.symbol));
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add symbol" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    await ensureDbSeeded();
    const symbol = String(req.nextUrl.searchParams.get("symbol") || "").trim().toUpperCase();
    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }
    await db.delete(watchlistTable).where(eq(watchlistTable.symbol, symbol));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to remove symbol" },
      { status: 500 }
    );
  }
}
