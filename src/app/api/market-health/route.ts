import { NextRequest, NextResponse } from "next/server";
import { requirePortfolioAuth } from "@/lib/auth";
import {
  getMarketPullStatus,
  refreshAllMarketPrices,
} from "@/db/portfolio-service";

export async function GET(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const status = await getMarketPullStatus();
    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET /api/market-health error:", error);
    return NextResponse.json(
      { error: "Failed to load market health" },
      { status: 500 },
    );
  }
}

/** Manual retry of a failed market pull; returns the fresh health snapshot. */
export async function POST(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    await refreshAllMarketPrices();
    const status = await getMarketPullStatus();
    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("POST /api/market-health error:", error);
    const status = await getMarketPullStatus().catch(() => null);
    return NextResponse.json(
      status ?? { error: "Retry failed" },
      { status: 200 },
    );
  }
}
