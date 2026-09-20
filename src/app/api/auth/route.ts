import { NextRequest, NextResponse } from "next/server";
import {
  authStatus,
  clearSession,
  createPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  setSession,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

function readPassword(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(await authStatus(request), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET /api/auth error:", error);
    return NextResponse.json({ error: "Unable to check access." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "");

    if (action === "logout") {
      const response = NextResponse.json({ configured: true, authenticated: false });
      clearSession(response);
      return response;
    }

    const password = readPassword(body?.password);
    if (password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json({ error: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.` }, { status: 400 });
    }

    if (action === "setup") {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json({ error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` }, { status: 400 });
      }
      if (password !== readPassword(body?.confirmation)) {
        return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
      }

      const credentials = await createPassword(password);
      if (!credentials) {
        return NextResponse.json({ error: "A password is already configured. Please sign in.", configured: true }, { status: 409 });
      }
      const response = NextResponse.json({ configured: true, authenticated: true });
      setSession(response, credentials);
      return response;
    }

    if (action === "login") {
      const credentials = await verifyPassword(password);
      if (!credentials) {
        const { configured } = await authStatus(request);
        return NextResponse.json(
          { error: configured ? "Incorrect password. Please try again." : "Create a password before signing in.", configured },
          { status: configured ? 401 : 409 },
        );
      }
      const response = NextResponse.json({ configured: true, authenticated: true });
      setSession(response, credentials);
      return response;
    }

    return NextResponse.json({ error: "Unsupported authentication action." }, { status: 400 });
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Authentication failed." }, { status: 500 });
  }
}
