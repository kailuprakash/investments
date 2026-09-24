import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

const PASSWORD_KEY = "portfolio_auth_password_v1";
const SESSION_SECRET_KEY = "portfolio_auth_session_secret_v1";
const SESSION_COOKIE = "portfolio_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const scrypt = promisify(scryptCallback);

type PasswordRecord = {
  version: 1;
  salt: string;
  hash: string;
};

export type PortfolioCredentials = {
  sessionSecret: string;
};

async function ensureAuthStore() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT ''
    )
  `);
}

async function readSetting(key: string): Promise<string | null> {
  await ensureAuthStore();
  const result = await pool.query<{ value: string }>(
    "SELECT value FROM portfolio_settings WHERE key = $1 LIMIT 1",
    [key],
  );
  return result.rows[0]?.value ?? null;
}

async function insertSettingIfMissing(key: string, value: string): Promise<boolean> {
  await ensureAuthStore();
  const result = await pool.query(
    `INSERT INTO portfolio_settings (key, value, updated_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (key) DO NOTHING`,
    [key, value, new Date().toISOString()],
  );
  return (result.rowCount ?? 0) > 0;
}

async function sessionSecret(): Promise<string> {
  const existing = await readSetting(SESSION_SECRET_KEY);
  if (existing) return existing;
  const generated = randomBytes(48).toString("base64url");
  await insertSettingIfMissing(SESSION_SECRET_KEY, generated);
  return (await readSetting(SESSION_SECRET_KEY)) ?? generated;
}

async function derivePassword(password: string, salt: string): Promise<Buffer> {
  return (await scrypt(password, salt, 64)) as Buffer;
}

function readPasswordRecord(value: string | null): PasswordRecord | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<PasswordRecord>;
    if (
      parsed.version !== 1 ||
      typeof parsed.salt !== "string" ||
      typeof parsed.hash !== "string"
    ) {
      return null;
    }
    return parsed as PasswordRecord;
  } catch {
    return null;
  }
}

function signSession(expiry: number, secret: string): string {
  const payload = String(expiry);
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

function verifySession(token: string | undefined, secret: string): boolean {
  if (!token) return false;
  const [expiryText, signature, ...rest] = token.split(".");
  if (rest.length || !expiryText || !signature) return false;
  const expiry = Number(expiryText);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000))
    return false;
  const expected = signSession(expiry, secret).split(".")[1];
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return (
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

export async function createPassword(
  password: string,
): Promise<PortfolioCredentials | null> {
  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return null;
  }
  const salt = randomBytes(20).toString("base64url");
  const hash = (await derivePassword(password, salt)).toString("base64url");
  const record: PasswordRecord = { version: 1, salt, hash };
  const inserted = await insertSettingIfMissing(
    PASSWORD_KEY,
    JSON.stringify(record),
  );
  if (!inserted) return null;
  return { sessionSecret: await sessionSecret() };
}

export async function verifyPassword(
  password: string,
): Promise<PortfolioCredentials | null> {
  if (!password || password.length > MAX_PASSWORD_LENGTH) return null;
  const record = readPasswordRecord(await readSetting(PASSWORD_KEY));
  if (!record) return null;
  const actual = await derivePassword(password, record.salt);
  const expected = Buffer.from(record.hash, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return null;
  return { sessionSecret: await sessionSecret() };
}

export async function authStatus(request?: NextRequest): Promise<{
  configured: boolean;
  authenticated: boolean;
}> {
  const configured = readPasswordRecord(await readSetting(PASSWORD_KEY)) !== null;
  if (!configured) return { configured: false, authenticated: false };
  const cookieValue = request
    ? request.cookies.get(SESSION_COOKIE)?.value
    : (await cookies()).get(SESSION_COOKIE)?.value;
  const authenticated = verifySession(cookieValue, await sessionSecret());
  return { configured: true, authenticated };
}

export function setSession(
  response: NextResponse,
  credentials: PortfolioCredentials,
) {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  response.cookies.set(
    SESSION_COOKIE,
    signSession(expiry, credentials.sessionSecret),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_SECONDS,
    },
  );
}

export function clearSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function requirePortfolioAuth(request: NextRequest) {
  try {
    const status = await authStatus(request);
    if (!status.configured) {
      const { NextResponse } = await import("next/server");
      return NextResponse.json(
        {
          error: "Set up a portfolio password first.",
          code: "AUTH_SETUP_REQUIRED",
        },
        { status: 401 },
      );
    }
    if (!status.authenticated) {
      const { NextResponse } = await import("next/server");
      return NextResponse.json(
        { error: "Sign in to access the portfolio.", code: "AUTH_REQUIRED" },
        { status: 401 },
      );
    }
    return null;
  } catch (error) {
    console.error("Portfolio authentication unavailable:", error);
    const { NextResponse } = await import("next/server");
    return NextResponse.json(
      {
        error: "Authentication is temporarily unavailable.",
        code: "AUTH_UNAVAILABLE",
      },
      { status: 503 },
    );
  }
}
