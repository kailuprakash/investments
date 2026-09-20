import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settingsTable } from "@/db/schema";
import { ensureDbSeeded } from "@/db/portfolio-service";

const CREDENTIALS_KEY = "portfolio_auth_credentials";
const SESSION_COOKIE = "portfolio_ledger_session";
const PASSWORD_ITERATIONS = 210_000;
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 256;

type Credentials = {
  version: 1;
  salt: string;
  hash: string;
  iterations: number;
};

function validCredentials(value: unknown): value is Credentials {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    item.version === 1 &&
    typeof item.salt === "string" && /^[a-f0-9]{32}$/i.test(item.salt) &&
    typeof item.hash === "string" && /^[a-f0-9]{64}$/i.test(item.hash) &&
    typeof item.iterations === "number" && Number.isInteger(item.iterations) && item.iterations >= 100_000
  );
}

function deriveHash(password: string, salt: string, iterations: number): string {
  return pbkdf2Sync(password, Buffer.from(salt, "hex"), iterations, 32, "sha256").toString("hex");
}

function safelyEqual(left: string, right: string): boolean {
  const leftValue = Buffer.from(left, "hex");
  const rightValue = Buffer.from(right, "hex");
  return leftValue.length === rightValue.length && timingSafeEqual(leftValue, rightValue);
}

async function storedCredentials(): Promise<Credentials | null> {
  await ensureDbSeeded();
  const [row] = await db
    .select({ value: settingsTable.value })
    .from(settingsTable)
    .where(eq(settingsTable.key, CREDENTIALS_KEY));
  if (!row) return null;

  try {
    const parsed: unknown = JSON.parse(row.value);
    return validCredentials(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function sessionSignature(issuedAt: number, expiresAt: number, credentials: Credentials): string {
  return createHmac("sha256", Buffer.from(credentials.hash, "hex"))
    .update(`${issuedAt}:${expiresAt}`)
    .digest("base64url");
}

function createSession(credentials: Credentials): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_SECONDS * 1000;
  return `${issuedAt}.${expiresAt}.${sessionSignature(issuedAt, expiresAt, credentials)}`;
}

async function validSession(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [issuedAtValue, expiresAtValue, signature, ...extra] = value.split(".");
  if (extra.length || !issuedAtValue || !expiresAtValue || !signature) return false;

  const issuedAt = Number(issuedAtValue);
  const expiresAt = Number(expiresAtValue);
  if (
    !Number.isSafeInteger(issuedAt) ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Date.now() ||
    expiresAt <= issuedAt ||
    expiresAt - issuedAt > SESSION_SECONDS * 1000
  ) {
    return false;
  }

  const credentials = await storedCredentials();
  if (!credentials) return false;
  const expected = sessionSignature(issuedAt, expiresAt, credentials);
  const actual = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export async function authStatus(request?: NextRequest): Promise<{ configured: boolean; authenticated: boolean }> {
  const credentials = await storedCredentials();
  if (!credentials) return { configured: false, authenticated: false };
  const cookie = request
    ? request.cookies.get(SESSION_COOKIE)?.value
    : (await cookies()).get(SESSION_COOKIE)?.value;
  return { configured: true, authenticated: await validSession(cookie) };
}

export async function requirePortfolioAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    const status = await authStatus(request);
    if (!status.configured) {
      return NextResponse.json({ error: "Set up a portfolio password first.", code: "AUTH_SETUP_REQUIRED" }, { status: 401 });
    }
    if (!status.authenticated) {
      return NextResponse.json({ error: "Sign in to access the portfolio.", code: "AUTH_REQUIRED" }, { status: 401 });
    }
    return null;
  } catch (error) {
    console.error("[auth] unable to verify session:", error);
    return NextResponse.json({ error: "Authentication is temporarily unavailable.", code: "AUTH_UNAVAILABLE" }, { status: 503 });
  }
}

export async function createPassword(password: string): Promise<Credentials | null> {
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters.`);
  }

  await ensureDbSeeded();
  const salt = randomBytes(16).toString("hex");
  const credentials: Credentials = {
    version: 1,
    salt,
    hash: deriveHash(password, salt, PASSWORD_ITERATIONS),
    iterations: PASSWORD_ITERATIONS,
  };
  const inserted = await db
    .insert(settingsTable)
    .values({ key: CREDENTIALS_KEY, value: JSON.stringify(credentials), updatedAt: new Date().toISOString() })
    .onConflictDoNothing()
    .returning({ key: settingsTable.key });
  return inserted.length ? credentials : null;
}

export async function verifyPassword(password: string): Promise<Credentials | null> {
  if (!password || password.length > MAX_PASSWORD_LENGTH) return null;
  const credentials = await storedCredentials();
  if (!credentials) return null;
  return safelyEqual(deriveHash(password, credentials.salt, credentials.iterations), credentials.hash)
    ? credentials
    : null;
}

export function setSession(response: NextResponse, credentials: Credentials): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSession(credentials),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export function clearSession(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
