import type { NextRequest } from "next/server";
import { pool } from "@/db";

const FAILED_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const FAILED_LOGIN_LOCKOUT_THRESHOLD = 3;
const LOGIN_AUDIT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

type LoginSecurityContext = {
  publicIp: string;
  forwardedFor: string;
  realIp: string;
  cloudflareIp: string;
  userAgent: string;
  browserHints: string;
  browserPlatform: string;
  mobileHint: string;
  acceptLanguage: string;
  accept: string;
  host: string;
  forwardedHost: string;
  forwardedProto: string;
  origin: string;
  referer: string;
  machineName: string;
  localNetworkIp: string;
};

function header(request: NextRequest, name: string, fallback = "not available") {
  const value = request.headers.get(name)?.replace(/[\r\n]/g, " ").trim();
  return value ? value.slice(0, 300) : fallback;
}

export function getLoginSecurityContext(request: NextRequest): LoginSecurityContext {
  const forwardedFor = header(request, "x-forwarded-for", "");
  const cloudflareIp = header(request, "cf-connecting-ip", "");
  const realIp = header(request, "x-real-ip", "");
  const publicIp =
    cloudflareIp || forwardedFor.split(",")[0]?.trim() || realIp || "not available";

  return {
    publicIp,
    forwardedFor: forwardedFor || "not available",
    realIp: realIp || "not available",
    cloudflareIp: cloudflareIp || "not available",
    userAgent: header(request, "user-agent"),
    browserHints: header(request, "sec-ch-ua"),
    browserPlatform: header(request, "sec-ch-ua-platform"),
    mobileHint: header(request, "sec-ch-ua-mobile"),
    acceptLanguage: header(request, "accept-language"),
    accept: header(request, "accept"),
    host: header(request, "host"),
    forwardedHost: header(request, "x-forwarded-host"),
    forwardedProto: header(request, "x-forwarded-proto"),
    origin: header(request, "origin"),
    referer: header(request, "referer"),
    // Browsers intentionally do not expose the device hostname or private LAN IP
    // to a web application. State this explicitly instead of recording guesses.
    machineName: "not exposed by browser security model",
    localNetworkIp: "not exposed by browser security model",
  };
}

function auditDetails(context: LoginSecurityContext) {
  return JSON.stringify({
    browserHints: context.browserHints,
    browserPlatform: context.browserPlatform,
    mobileHint: context.mobileHint,
    acceptLanguage: context.acceptLanguage,
    host: context.host,
    forwardedHost: context.forwardedHost,
    forwardedProto: context.forwardedProto,
    origin: context.origin,
    referer: context.referer,
  });
}

async function ensureLoginAuditStore() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_login_attempts (
      id SERIAL PRIMARY KEY,
      ip_address TEXT NOT NULL,
      attempted_at TEXT NOT NULL,
      event TEXT NOT NULL DEFAULT 'LOGIN_FAILURE',
      user_agent TEXT NOT NULL DEFAULT '',
      client_details TEXT NOT NULL DEFAULT '',
      alerted BOOLEAN NOT NULL DEFAULT FALSE
    );
    CREATE INDEX IF NOT EXISTS idx_portfolio_login_attempts_ip_time
      ON portfolio_login_attempts (ip_address, attempted_at);
  `);
}

export async function getLoginLockoutStatus(request: NextRequest) {
  const context = getLoginSecurityContext(request);
  const now = new Date();
  const lockWindowStart = new Date(now.getTime() - FAILED_LOGIN_WINDOW_MS).toISOString();
  await ensureLoginAuditStore();

  const result = await pool.query<{ attempted_at: string }>(
    `SELECT attempted_at
     FROM portfolio_login_attempts
     WHERE ip_address = $1
       AND event = 'LOGIN_LOCKOUT'
       AND attempted_at >= $2
     ORDER BY attempted_at DESC
     LIMIT 1`,
    [context.publicIp, lockWindowStart],
  );
  const lockEvent = result.rows[0];
  if (!lockEvent) {
    return { locked: false, retryAfterSeconds: 0, context };
  }

  const lockoutUntilMs =
    (Date.parse(lockEvent.attempted_at) || now.getTime()) +
    FAILED_LOGIN_WINDOW_MS;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((lockoutUntilMs - now.getTime()) / 1000),
  );
  if (retryAfterSeconds <= 0) {
    return { locked: false, retryAfterSeconds: 0, context };
  }

  return {
    locked: true,
    retryAfterSeconds,
    lockoutUntil: new Date(lockoutUntilMs).toISOString(),
    context,
  };
}

export async function recordFailedLoginAttempt(request: NextRequest) {
  const context = getLoginSecurityContext(request);
  const now = new Date();
  const windowStart = new Date(now.getTime() - FAILED_LOGIN_WINDOW_MS).toISOString();
  const retentionStart = new Date(now.getTime() - LOGIN_AUDIT_RETENTION_MS).toISOString();
  await ensureLoginAuditStore();

  // Housekeeping keeps this small even if a public endpoint receives noise.
  await pool.query(
    "DELETE FROM portfolio_login_attempts WHERE attempted_at < $1",
    [retentionStart],
  );
  await pool.query(
    `INSERT INTO portfolio_login_attempts
      (ip_address, attempted_at, event, user_agent, client_details, alerted)
     VALUES ($1, $2, 'LOGIN_FAILURE', $3, $4, FALSE)`,
    [context.publicIp, now.toISOString(), context.userAgent, auditDetails(context)],
  );
  const countResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM portfolio_login_attempts
     WHERE ip_address = $1
       AND event = 'LOGIN_FAILURE'
       AND attempted_at >= $2`,
    [context.publicIp, windowStart],
  );
  const failedAttemptCount = Number(countResult.rows[0]?.count || 0);
  const shouldLock = failedAttemptCount === FAILED_LOGIN_LOCKOUT_THRESHOLD;
  const lockoutUntil = new Date(now.getTime() + FAILED_LOGIN_WINDOW_MS).toISOString();

  if (shouldLock) {
    await pool.query(
      `INSERT INTO portfolio_login_attempts
        (ip_address, attempted_at, event, user_agent, client_details, alerted)
       VALUES ($1, $2, 'LOGIN_LOCKOUT', $3, $4, TRUE)`,
      [context.publicIp, now.toISOString(), context.userAgent, auditDetails(context)],
    );
  }

  return {
    failedAttemptCount,
    shouldLock,
    shouldAlert: shouldLock,
    retryAfterSeconds: shouldLock ? FAILED_LOGIN_WINDOW_MS / 1000 : 0,
    lockoutUntil: shouldLock ? lockoutUntil : null,
    windowMinutes: FAILED_LOGIN_WINDOW_MS / 60,
    context,
  };
}

export async function clearFailedLoginAttempts(request: NextRequest) {
  const context = getLoginSecurityContext(request);
  await ensureLoginAuditStore();
  await pool.query(
    `DELETE FROM portfolio_login_attempts
     WHERE ip_address = $1
       AND event IN ('LOGIN_FAILURE', 'LOGIN_LOCKOUT')`,
    [context.publicIp],
  );
}
