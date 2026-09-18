import { NextRequest, NextResponse } from "next/server";
import { searchMarketSymbols } from "@/db/portfolio-service";

export async function GET(req: NextRequest) {
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
