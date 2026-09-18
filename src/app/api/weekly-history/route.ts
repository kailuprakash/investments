import { NextResponse } from "next/server";
import { db } from "@/db";
import { weeklyHistoryTable } from "@/db/schema";
import { ensureDbSeeded } from "@/db/portfolio-service";
import { desc, asc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDbSeeded();
    const history = await db
      .select()
      .from(weeklyHistoryTable)
      .orderBy(desc(weeklyHistoryTable.snapshotWeek), asc(weeklyHistoryTable.accountNumber));
    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load account history" },
      { status: 500 }
    );
  }
}
