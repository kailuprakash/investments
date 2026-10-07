import { NextRequest, NextResponse } from "next/server";

/**
 * Optional IP allowlist — an extra network-level gate in front of the login
 * screen so only your known addresses can reach the workbook at all.
 *
 * Setup:
 *   1. Find your public IP (search "what is my IP" while on your network).
 *   2. Set ALLOWED_IPS in .env, comma-separated. A trailing * matches an IP
 *      range, which is handy when your provider rotates the last digits:
 *         ALLOWED_IPS=203.0.113.7,198.51.100.*
 *   3. Rebuild/restart. Everyone else gets 403 — the login page never loads.
 *
 * Notes:
 * - Leave ALLOWED_IPS empty/unset to disable this layer (default).
 * - Requests without proxy IP headers (direct localhost access) are always
 *   allowed so you can never lock yourself out of the sandbox shell access.
 * - /api/health stays open because the platform health check needs it.
 * - Authentication (login) remains the primary protection; this is a bonus
 *   layer on top of it.
 */
const ALWAYS_OPEN_PREFIXES = ["/api/health"];

/** Loopback / RFC1918 / link-local hop detector. */
function isPrivateOrLocal(ip: string): boolean {
  if (ip === "::1" || ip === "localhost") return true;
  if (ip.startsWith("127.") || ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.") || ip.startsWith("169.254.")) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80"))
    return true;
  if (ip.startsWith("172.")) {
    const second = Number(ip.split(".")[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const raw = process.env.ALLOWED_IPS?.trim() ?? "";
  const allowed = raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) return NextResponse.next();

  const pathname = request.nextUrl.pathname;
  if (ALWAYS_OPEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Client IPs as seen through the hosting proxy. Next.js appends the
  // immediate socket address (loopback behind the platform gateway), so
  // private/loopback hops are ignored: a request whose address chain is
  // entirely private is local tooling and always allowed; anything with a
  // public candidate must match the allowlist.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",") ?? [];
  const realIp = request.headers.get("x-real-ip");
  const candidates = [...forwarded, ...(realIp ? [realIp] : [])]
    .map((ip) => ip.trim().toLowerCase())
    .filter(Boolean)
    .filter((ip) => !isPrivateOrLocal(ip));

  if (candidates.length === 0) return NextResponse.next();

  const permitted = candidates.some((ip) =>
    allowed.some((entry) =>
      entry.endsWith("*") ? ip.startsWith(entry.slice(0, -1)) : ip === entry,
    ),
  );

  if (permitted) return NextResponse.next();

  return new NextResponse(
    "Access denied: this workbook is restricted to an allowed IP address.",
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
