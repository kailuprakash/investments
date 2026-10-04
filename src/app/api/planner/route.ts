import { NextRequest, NextResponse } from "next/server";
import { requirePortfolioAuth } from "@/lib/auth";
import {
  addPlannerRow,
  deletePlannerRow,
  editPlannerRow,
  getPlannerState,
  refreshPlannerMarketPrices,
  setPlannerAccountBudget,
} from "@/db/planner-service";

export async function GET(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const planner = await getPlannerState();
    return NextResponse.json(planner, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET /api/planner error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load planner" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const body = await req.json().catch(() => ({}));
    if (body?.action === "refresh-market") {
      // Pull fresh quotes (workbook symbols + planner-only symbols), then
      // rebuild the planner so the Market Price column reflects the pull.
      const planner = await refreshPlannerMarketPrices();
      return NextResponse.json(planner, {
        headers: { "Cache-Control": "no-store" },
      });
    }
    const planner = await addPlannerRow({
      accountNumber: body?.accountNumber,
    });
    return NextResponse.json(planner, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("POST /api/planner error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add row" },
      { status: 400 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const body = await req.json().catch(() => ({}));
    if (body?.action === "set-budget") {
      const planner = await setPlannerAccountBudget({
        accountNumber: body?.accountNumber,
        value: body?.value,
      });
      return NextResponse.json(planner, {
        headers: { "Cache-Control": "no-store" },
      });
    }
    const planner = await editPlannerRow({
      id: body?.id,
      field: body?.field,
      value: body?.value,
    });
    return NextResponse.json(planner, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("PATCH /api/planner error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save row" },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorised = await requirePortfolioAuth(req);
  if (unauthorised) return unauthorised;

  try {
    const id = Number(req.nextUrl.searchParams.get("id"));
    const planner = await deletePlannerRow(id);
    return NextResponse.json(planner, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("DELETE /api/planner error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete row" },
      { status: 400 },
    );
  }
}
