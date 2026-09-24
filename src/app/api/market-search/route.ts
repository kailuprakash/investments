import { NextRequest, NextResponse } from "next/server";
import { searchMarketSymbols } from "@/db/portfolio-service";

import { requirePortfolioAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const suggestions = await searchMarketSymbols(q);
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json(
      { suggestions: [], error: error instanceof Error ? error.message : "Search failed" },
      { status: 200 }
    );
  }
}
