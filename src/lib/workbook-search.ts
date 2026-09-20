export type WorkbookSheet = "future" | "inventory" | "master" | "analytics";

export type WorkbookHit = {
  id: string;
  sheet: WorkbookSheet;
  sheetLabel: string;
  title: string;
  subtitle: string;
  accountNumber?: string;
  symbol?: string;
  holdingId?: number;
  transactionId?: number;
  side?: "BUY" | "SELL";
};

type AccountLike = {
  accountNumber: string;
  accountName?: string;
  holdings?: Array<{
    id: number;
    symbol: string;
    accountNumber: string;
    quantity?: number;
  }>;
};

type TransactionLike = {
  id: number;
  accountNumber: string;
  symbol: string;
  action: string;
};

const SHEETS: Record<WorkbookSheet, string> = {
  inventory: "Consolidated View",
  future: "Daily Transactions",
  master: "Account's Summary",
  analytics: "Visual Analytics",
};

export function buildWorkbookIndex(
  accounts: AccountLike[],
  transactions: TransactionLike[],
): WorkbookHit[] {
  const hits: WorkbookHit[] = [];
  for (const account of accounts) {
    const accountNumber = String(account.accountNumber || "").trim();
    if (!accountNumber) continue;
    hits.push({
      id: `account:${accountNumber}`,
      sheet: "master",
      sheetLabel: SHEETS.master,
      title: accountNumber,
      subtitle: `${account.accountName || accountNumber} · Account`,
      accountNumber,
    });
    for (const holding of account.holdings || []) {
      const symbol = String(holding.symbol || "")
        .trim()
        .toUpperCase();
      if (!symbol) continue;
      hits.push({
        id: `holding:${holding.id}`,
        sheet: "inventory",
        sheetLabel: SHEETS.inventory,
        title: symbol,
        subtitle: `${accountNumber} · Holding`,
        accountNumber,
        symbol,
        holdingId: holding.id,
      });
    }
  }
  for (const tx of transactions) {
    const symbol = String(tx.symbol || "")
      .trim()
      .toUpperCase();
    const accountNumber = String(tx.accountNumber || "").trim();
    if (!symbol || !accountNumber) continue;
    const side =
      String(tx.action || "").toUpperCase() === "SELL" ? "SELL" : "BUY";
    hits.push({
      id: `tx:${tx.id}`,
      sheet: "future",
      sheetLabel: SHEETS.future,
      title: symbol,
      subtitle: `${accountNumber} · ${side === "SELL" ? "Sell" : "Buy"}`,
      accountNumber,
      symbol,
      transactionId: tx.id,
      side,
    });
  }
  return hits;
}

function scoreHit(hit: WorkbookHit, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = hit.title.toLowerCase();
  const account = (hit.accountNumber || "").toLowerCase();
  if (title === q || account === q) return 100;
  if (title.startsWith(q) || account.startsWith(q)) return 80;
  if (
    title.includes(q) ||
    account.includes(q) ||
    hit.subtitle.toLowerCase().includes(q)
  )
    return 40;
  return 0;
}

export function searchWorkbook(
  hits: WorkbookHit[],
  query: string,
  limit = 12,
): WorkbookHit[] {
  const q = query.trim();
  if (q.length < 1) return [];
  return hits
    .map((hit) => ({ hit, score: scoreHit(hit, q) }))
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.hit.title.localeCompare(b.hit.title) ||
        a.hit.subtitle.localeCompare(b.hit.subtitle),
    )
    .slice(0, limit)
    .map((row) => row.hit);
}

export function selectorForHit(hit: WorkbookHit): string | null {
  if (hit.holdingId) return `[data-holding-id="${hit.holdingId}"]`;
  if (hit.transactionId) return `[data-transaction-id="${hit.transactionId}"]`;
  if (hit.accountNumber)
    return `[data-account="${CSS.escape(hit.accountNumber)}"]`;
  return null;
}

export function highlightWorkbookRow(element: Element | null) {
  if (!(element instanceof HTMLElement)) return false;
  document.querySelectorAll(".workbook-search-hit").forEach((node) => {
    node.classList.remove("workbook-search-hit");
  });
  element.classList.add("workbook-search-hit");
  element.scrollIntoView({ block: "center", inline: "nearest" });
  window.setTimeout(
    () => element.classList.remove("workbook-search-hit"),
    2800,
  );
  return true;
}
