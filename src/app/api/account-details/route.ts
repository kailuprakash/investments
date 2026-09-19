import { NextRequest, NextResponse } from "next/server";
import {
  getAccountDetailsData,
  addDeposit,
  editDeposit,
  deleteDeposit,
  editAccountDetail,
  addAccountDetail,
  deleteAccountDetail,
  importAccountDetailsData,
} from "@/db/portfolio-service";

export async function GET() {
  try {
    const data = await getAccountDetailsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/account-details error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load account details" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data } = body || {};

    if (action === "add-deposit") {
      const result = await addDeposit(data);
      return NextResponse.json(result);
    }

    if (action === "edit-deposit") {
      const result = await editDeposit(data);
      return NextResponse.json(result);
    }

    if (action === "delete-deposit") {
      const result = await deleteDeposit(Number(data?.id));
      return NextResponse.json(result);
    }

    if (action === "edit-account-detail") {
      const result = await editAccountDetail(data);
      return NextResponse.json(result);
    }

    if (action === "add-account-detail") {
      const result = await addAccountDetail(data);
      return NextResponse.json(result);
    }

    if (action === "import-excel-data") {
      const result = await importAccountDetailsData(data);
      return NextResponse.json(result);
    }

    if (action === "delete-account-detail") {
      const result = await deleteAccountDetail(Number(data?.id));
      return NextResponse.json(result);
    }

    const currentData = await getAccountDetailsData();
    return NextResponse.json(currentData);
  } catch (error) {
    console.error("POST /api/account-details error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    );
  }
}
