import type { NextRequest } from "next/server";

type LoginAlertEvent = "LOGIN" | "PASSWORD_SETUP";

type EmailAlertResult =
  | { sent: true; id?: string }
  | { sent: false; reason: "not-configured" | "failed" };

function requestIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "not available";
  return request.headers.get("x-real-ip") || "not available";
}

function requestAgent(request: NextRequest) {
  return (request.headers.get("user-agent") || "not available")
    .replace(/[\r\n]/g, " ")
    .slice(0, 180);
}

function loginAlertText(request: NextRequest, event: LoginAlertEvent) {
  const at = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "America/New_York",
  }).format(new Date());
  const eventText =
    event === "PASSWORD_SETUP"
      ? "Portfolio password created successfully"
      : "Portfolio sign-in completed successfully";
  return [
    "Portfolio Tracker security alert",
    eventText,
    `Time: ${at} ET`,
    `IP address: ${requestIp(request)}`,
    `Device: ${requestAgent(request)}`,
  ].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends a best-effort email security alert via Resend's REST API. It is a no-op
 * until all required server-side environment variables are configured and never
 * blocks successful password setup or login when delivery fails.
 */
export async function sendEmailLoginAlert(
  request: NextRequest,
  event: LoginAlertEvent,
): Promise<EmailAlertResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.LOGIN_ALERT_EMAIL_TO?.trim();
  const from = process.env.LOGIN_ALERT_EMAIL_FROM?.trim();
  if (!apiKey || !to || !from) {
    return { sent: false, reason: "not-configured" };
  }

  const text = loginAlertText(request, event);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Portfolio Tracker security alert",
        text,
        html: `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
        tags: [{ name: "event", value: "portfolio-login-alert" }],
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;
    if (!response.ok) {
      console.warn("Email login alert was not sent", {
        status: response.status,
        error: payload?.message || payload?.name || "provider rejected request",
      });
      return { sent: false, reason: "failed" };
    }
    return { sent: true, id: payload?.id };
  } catch (error) {
    console.warn("Email login alert request failed", {
      reason:
        error instanceof Error && error.name === "AbortError"
          ? "timed out"
          : "network error",
    });
    return { sent: false, reason: "failed" };
  } finally {
    clearTimeout(timeout);
  }
}
