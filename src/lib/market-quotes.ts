export type QuoteSource = "live" | "cached";

export type SymbolQuote = {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  source: QuoteSource;
  quoteAt: string | null;
  lastLiveAt: string | null;
  error: string | null;
};

export type MarketRefreshReport = {
  attemptedAt: string;
  live: string[];
  cached: Array<{ symbol: string; error: string }>;
};

export function formatQuoteAge(iso: string | null | undefined, nowMs = Date.now()): string {
  if (!iso) return "not recorded";
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "not recorded";
  const delta = Math.max(0, nowMs - then);
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function formatQuoteCaption(quote: {
  source?: string | null;
  quoteAt?: string | null;
  updatedAt?: string | null;
  error?: string | null;
}, nowMs = Date.now()): string {
  const live = quote.source === "live";
  const when = formatQuoteAge(quote.quoteAt || quote.updatedAt, nowMs);
  const error = String(quote.error || "").trim();
  return `${live ? "Live" : "Cached"} · ${when}${error ? ` · ${error}` : ""}`;
}

export function summarizeMarketRefresh(quotes: SymbolQuote[], attemptedAt = new Date().toISOString()): MarketRefreshReport {
  const live: string[] = [];
  const cached: Array<{ symbol: string; error: string }> = [];
  for (const quote of quotes) {
    if (quote.source === "live") live.push(quote.symbol);
    else cached.push({ symbol: quote.symbol, error: quote.error || "using last stored price" });
  }
  return { attemptedAt, live, cached };
}

export function formatMarketRefreshMessage(report: MarketRefreshReport): { text: string; type: "success" | "error" | "info" } {
  const live = report.live.length;
  const cached = report.cached.length;
  if (live && !cached) {
    return { text: `Market prices updated (${live} live).`, type: "success" };
  }
  if (!live && cached) {
    const detail = report.cached.slice(0, 4).map((item) => `${item.symbol}: ${item.error}`).join("; ");
    const more = cached > 4 ? ` (+${cached - 4} more)` : "";
    return { text: `No live quotes. Cached prices kept. ${detail}${more}`, type: "error" };
  }
  const detail = report.cached.slice(0, 3).map((item) => `${item.symbol}: ${item.error}`).join("; ");
  const more = cached > 3 ? ` (+${cached - 3} more)` : "";
  return {
    text: `Updated ${live} live; ${cached} cached (${detail}${more}).`,
    type: "info",
  };
}
