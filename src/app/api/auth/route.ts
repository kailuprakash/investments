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

type AuthPayload = {
  action: string;
  password: string;
  confirmation: string;
};

function readText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isFormSubmission(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type") || "";
  return (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  );
}

async function readPayload(
  request: NextRequest,
  formSubmission: boolean,
): Promise<AuthPayload> {
  if (formSubmission) {
    const form = await request.formData();
    return {
      action: readText(form.get("action")),
      password: readText(form.get("password")),
      confirmation: readText(form.get("confirmation")),
    };
  }
  const body = await request.json().catch(() => ({}));
  return {
    action: readText(body?.action),
    password: readText(body?.password),
    confirmation: readText(body?.confirmation),
  };
}

function browserRedirect(location: string): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: location, "Cache-Control": "no-store" },
  });
}

function loginRedirect(error?: string): NextResponse {
  return browserRedirect(
    error ? `/login?${new URLSearchParams({ error }).toString()}` : "/login",
  );
}

function authError(
  formSubmission: boolean,
  error: string,
  status: number,
  configured?: boolean,
): NextResponse {
  if (formSubmission) return loginRedirect(error);
  return NextResponse.json(
    { error, ...(configured === undefined ? {} : { configured }) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(await authStatus(request), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET /api/auth error:", error);
    return NextResponse.json(
      { error: "Unable to check secure access." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const formSubmission = isFormSubmission(request);
  try {
    const { action, password, confirmation } = await readPayload(
      request,
      formSubmission,
    );

    if (action === "logout") {
      const response = formSubmission
        ? loginRedirect()
        : NextResponse.json(
            { configured: true, authenticated: false },
            { headers: { "Cache-Control": "no-store" } },
          );
      clearSession(response);
      return response;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      return authError(
        formSubmission,
        `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`,
        400,
      );
    }

    if (action === "setup") {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return authError(
          formSubmission,
          `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
          400,
        );
      }
      if (password !== confirmation) {
        return authError(formSubmission, "Passwords do not match.", 400);
      }
      const credentials = await createPassword(password);
      if (!credentials) {
        return authError(
          formSubmission,
          "A password is already configured. Please sign in.",
          409,
          true,
        );
      }
      const response = formSubmission
        ? browserRedirect("/")
        : NextResponse.json({ configured: true, authenticated: true });
      setSession(response, credentials);
      return response;
    }

    if (action === "login") {
      const credentials = await verifyPassword(password);
      if (!credentials) {
        const { configured } = await authStatus(request);
        return authError(
          formSubmission,
          configured
            ? "Incorrect password. Please try again."
            : "Create a password before signing in.",
          configured ? 401 : 409,
          configured,
        );
      }
      const response = formSubmission
        ? browserRedirect("/")
        : NextResponse.json({ configured: true, authenticated: true });
      setSession(response, credentials);
      return response;
    }

    return authError(
      formSubmission,
      "Unsupported authentication action.",
      400,
    );
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return authError(
      formSubmission,
      error instanceof Error ? error.message : "Authentication failed.",
      500,
    );
  }
}
