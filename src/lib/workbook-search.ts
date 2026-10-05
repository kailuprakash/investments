export type WorkbookSheet =
  | "future"
  | "inventory"
  | "master"
  | "analytics"
  | "planner"
  | "accountDetails";

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
  /** Additional searchable body text (comments, notes, attributes). */
  text?: string;
  /** Row token used by data-search-row="..." markers for highlighting. */
  rowId?: string;
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
  planner: "Planner",
  accountDetails: "Account Details",
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

type PlannerExtras = {
  groups?: Array<{
    accountNumber?: string;
    rows?: Array<{
      id: number;
      symbol?: string;
      comments?: string;
      amount?: number;
    }>;
  }> | null;
  sheetComment?: string | null;
};

type AccountDetailsExtras = {
  accounts?: Array<{
    id: number;
    accountNumber?: string;
    financialInstitute?: string;
    accountType?: string;
    startDate?: string;
    comments?: string;
    taxPeriod?: string;
  }> | null;
  deposits?: Array<{
    id: number;
    accountNumber?: string;
    dateInvested?: string;
    amount?: number;
    comments?: string;
  }> | null;
};

/** Extra search coverage: planner rows/comments, account detail text,
    deposit notes — merged on top of the symbol/account core index. */
export function buildExtraHits(
  planner?: PlannerExtras,
  accountDetails?: AccountDetailsExtras,
): WorkbookHit[] {
  const hits: WorkbookHit[] = [];
  for (const group of planner?.groups ?? []) {
    const accountNumber = String(group.accountNumber ?? "").trim();
    for (const row of group.rows ?? []) {
      const symbol = String(row.symbol ?? "").trim().toUpperCase();
      const comments = String(row.comments ?? "").trim();
      if (!symbol && !comments) continue;
      hits.push({
        id: `planner:${row.id}`,
        sheet: "planner",
        sheetLabel: SHEETS.planner,
        title: symbol || "(planned row)",
        subtitle: `${accountNumber} · Planner`,
        accountNumber,
        symbol,
        text: comments,
        rowId: `pl-${row.id}`,
      });
    }
  }
  const sheetComment = String(planner?.sheetComment ?? "").trim();
  if (sheetComment) {
    hits.push({
      id: "planner:sheet-comment",
      sheet: "planner",
      sheetLabel: SHEETS.planner,
      title: "Planner comment",
      subtitle: `Overall planner comment`,
      text: sheetComment,
    });
  }
  for (const account of accountDetails?.accounts ?? []) {
    const accountNumber = String(account.accountNumber ?? "").trim();
    if (!accountNumber) continue;
    hits.push({
      id: `accountdetail:${account.id}`,
      sheet: "accountDetails",
      sheetLabel: SHEETS.accountDetails,
      title: accountNumber,
      subtitle: `${account.financialInstitute || "Account"} · Account Details`,
      accountNumber,
      text: [
        account.financialInstitute,
        account.accountType,
        account.startDate,
        account.comments,
        account.taxPeriod,
      ]
        .filter(Boolean)
        .join(" · "),
      rowId: `ad-${account.id}`,
    });
  }
  for (const deposit of accountDetails?.deposits ?? []) {
    const accountNumber = String(deposit.accountNumber ?? "").trim();
    const comments = String(deposit.comments ?? "").trim();
    if (!accountNumber && !comments) continue;
    hits.push({
      id: `deposit:${deposit.id}`,
      sheet: "accountDetails",
      sheetLabel: SHEETS.accountDetails,
      title: accountNumber || "(deposit)",
      subtitle: `$${Number(deposit.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} deposit${
        deposit.dateInvested ? ` · ${deposit.dateInvested}` : ""
      }`,
      accountNumber,
      text: comments,
      rowId: `dep-${deposit.id}`,
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
  if (hit.text && hit.text.toLowerCase().includes(q)) return 35;
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
  if (hit.rowId) return `[data-search-row="${hit.rowId}"]`;
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
