import { pool } from "@/db";
import {
  buildPortfolioState,
  fallbackSectorForSymbol,
  fetchSymbolQuote,
  getSetting,
  refreshAllMarketPrices,
  setSetting,
} from "@/db/portfolio-service";

const round2 = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;
const round4 = (value: number) =>
  Math.round((value + Number.EPSILON) * 10000) / 10000;

const normAcc = (s: string) =>
  String(s || "")
    .trim()
    .toUpperCase()
    .replace(/^[0-9]+\.\s*/, "")
    .replace(/[\s_-]+/g, "");

const normSym = (s: string) => String(s || "").trim().toUpperCase();

export type PlannerRow = {
  id: number;
  accountNumber: string;
  symbol: string;
  shares: number;
  sharePrice: number;
  total: number;
  /** Stored override; null means the % is derived from Total / cash. */
  allocationPercent: number | null;
  asOfDate: string;
  comments: string;
  orderIndex: number;
  /** Effective % shown in the sheet (stored override or auto-derived). */
  effectiveAllocation: number;
  /** Pulled from market data for the symbol. */
  currentMarketPrice: number;
  /** Pulled from the Consolidated View (holdings in this account). */
  sharesPurchased: number;
  actualSharePrice: number;
  actualTotalAmount: number;
  /** Planned Total − Actual Total Amount. */
  balanceAmount: number;
  /** ISO timestamp of the last edit to an editable field (blank = never). */
  updatedAt: string;
  /** Read-only display: allocationPercent × budget when % is set, else Total. */
  amount: number;
  /** Company name from the watchlist ("" = unknown). */
  symbolName: string;
  /** Sector from the market cache, falling back to the quote dictionary. */
  sector: string;
};

export type PlannerAccountGroup = {
  accountNumber: string;
  accountName: string;
  /** Live account cash from Account Details (source of truth). */
  cashAvailable: number;
  /** Editable "Total - Account Level - Cash Allocation" (null = use cash). */
  budgetOverride: number | null;
  /** Effective allocation budget used for % math: override ?? cash. */
  budget: number;
  rows: PlannerRow[];
  plannedTotal: number;
  actualTotal: number;
  balanceTotal: number;
  allocatedPercent: number;
  remainingPercent: number;
  /** Auto-calculated: Total Account Level Cash Allocation − Σ symbol totals. */
  cashRemaining: number;
};

const SHEET_COMMENT_KEY = "planner_sheet_comment_v1";

export type PlannerState = {
  groups: PlannerAccountGroup[];
  /** Distinct symbols (holdings, watchlist, market cache) for suggestions. */
  symbols: string[];
  /** One overall comment for the whole planner sheet (ticker, editable). */
  sheetComment: string;
};

let ensurePromise: Promise<void> | null = null;

async function ensurePlannerTable(): Promise<void> {
  if (ensurePromise) return ensurePromise;
  ensurePromise = pool
    .query(`
      CREATE TABLE IF NOT EXISTS portfolio_planner (
        id SERIAL PRIMARY KEY,
        account_number TEXT NOT NULL,
        symbol TEXT NOT NULL DEFAULT '',
        shares DOUBLE PRECISION NOT NULL DEFAULT 0,
        share_price DOUBLE PRECISION NOT NULL DEFAULT 0,
        total DOUBLE PRECISION NOT NULL DEFAULT 0,
        allocation_percent DOUBLE PRECISION,
        as_of_date TEXT NOT NULL DEFAULT '',
        comments TEXT NOT NULL DEFAULT '',
        order_index INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT ''
      );
      ALTER TABLE portfolio_planner
        ADD COLUMN IF NOT EXISTS updated_at TEXT NOT NULL DEFAULT '';
      CREATE TABLE IF NOT EXISTS portfolio_planner_account (
        account_number TEXT PRIMARY KEY,
        total_override DOUBLE PRECISION,
        comments TEXT NOT NULL DEFAULT ''
      );
      ALTER TABLE portfolio_planner_account
        ADD COLUMN IF NOT EXISTS comments TEXT NOT NULL DEFAULT '';
    `)
    .then(() => undefined)
    .catch((error: unknown) => {
      // Allow a retry on the next call instead of caching a failed bootstrap.
      ensurePromise = null;
      throw error;
    });
  return ensurePromise;
}

type PlannerDbRow = {
  id: number;
  account_number: string;
  symbol: string;
  shares: number | string;
  share_price: number | string;
  total: number | string;
  allocation_percent: number | string | null;
  as_of_date: string | null;
  comments: string | null;
  order_index: number;
  updated_at: string | null;
};

type DbPortfolioAccount = Awaited<
  ReturnType<typeof buildPortfolioState>
>["accounts"][number];

export async function getPlannerState(): Promise<PlannerState> {
  await ensurePlannerTable();
  const [rowsResult, portfolio, budgetResult, symbolResult] = await Promise.all(
    [
      pool.query<PlannerDbRow>(
        `SELECT id, account_number, symbol, shares, share_price, total,
              allocation_percent, as_of_date, comments, order_index, updated_at
       FROM portfolio_planner
       ORDER BY account_number ASC, order_index ASC, id ASC`,
      ),
      buildPortfolioState(),
      pool.query<{ account_number: string; total_override: number | string | null; comments: string | null }>(
        `SELECT account_number, total_override, comments FROM portfolio_planner_account`,
      ),
      pool.query<{ symbol: string }>(
        `SELECT DISTINCT symbol FROM portfolio_holdings
         UNION
         SELECT DISTINCT symbol FROM portfolio_watchlist
         UNION
         SELECT DISTINCT symbol FROM market_cache`,
      ),
    ],
  );

  const budgetByAccount = new Map<string, number | null>();
  const budgetRawName = new Map<string, string>();
  for (const row of budgetResult.rows) {
    budgetByAccount.set(
      normAcc(row.account_number),
      row.total_override === null ? null : round2(Number(row.total_override)),
    );
    budgetRawName.set(normAcc(row.account_number), row.account_number);
  }

  const symbols = symbolResult.rows
    .map((row) => normSym(row.symbol))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const cacheResult = await pool.query<{
    symbol: string;
    price: number;
    sector: string | null;
  }>(`SELECT symbol, price, sector FROM market_cache`);
  const marketPriceBySymbol = new Map<string, number>();
  const sectorBySymbol = new Map<string, string>();
  for (const row of cacheResult.rows) {
    const price = Number(row.price) || 0;
    const sym = normSym(row.symbol);
    if (!marketPriceBySymbol.has(sym) || price > 0) {
      marketPriceBySymbol.set(sym, price);
    }
    const cachedSector = String(row.sector ?? "").trim();
    if (cachedSector) sectorBySymbol.set(sym, cachedSector);
  }
  const watchlistResult = await pool.query<{ symbol: string; name: string }>(
    `SELECT symbol, name FROM portfolio_watchlist`,
  );
  const nameBySymbol = new Map<string, string>(
    watchlistResult.rows.map((row) => [normSym(row.symbol), row.name]),
  );

  const accountsByNorm = new Map<string, DbPortfolioAccount>();
  for (const account of portfolio.accounts) {
    accountsByNorm.set(normAcc(account.accountNumber), account);
  }

  const storedByAccount = new Map<string, PlannerDbRow[]>();
  for (const row of rowsResult.rows) {
    const list = storedByAccount.get(normAcc(row.account_number)) ?? [];
    list.push(row);
    storedByAccount.set(normAcc(row.account_number), list);
  }

  // Accounts with planner rows or a budget override but no live account
  // record still get a block.
  const orphans = Array.from(
    new Set([...storedByAccount.keys(), ...budgetByAccount.keys()]),
  ).filter((key) => !accountsByNorm.has(key));

  const groups: PlannerAccountGroup[] = [];

  const buildGroup = (
    accountNumber: string,
    account: DbPortfolioAccount | undefined,
  ) => {
    const cashAvailable = round2(Number(account?.cashAvailable) || 0);
    const budgetOverride = budgetByAccount.get(normAcc(accountNumber)) ?? null;
    const budget = budgetOverride ?? cashAvailable;
    const storedRows = storedByAccount.get(normAcc(accountNumber)) ?? [];
    let plannedTotal = 0;
    let actualTotal = 0;
    let allocatedPercent = 0;

    const rows: PlannerRow[] = storedRows.map((row) => {
      const symbol = normSym(row.symbol);
      const holding = (account?.holdings ?? []).find(
        (h: { symbol?: string }) => normSym(h.symbol ?? "") === symbol,
      );
      const total = round2(Number(row.total) || 0);
      const actualTotalAmount = round2(Number(holding?.investAmount) || 0);
      const currentMarketPrice =
        round2(Number(holding?.currentPrice) || 0) ||
        marketPriceBySymbol.get(symbol) ||
        0;
      const storedAlloc =
        row.allocation_percent === null
          ? null
          : round2(Number(row.allocation_percent) || 0);
      // Amount is auto-derived: % Allocation × budget when a % is stored,
      // falling back to the stored Total for rows planned before % editing.
      const amount =
        storedAlloc !== null ? round2((storedAlloc / 100) * budget) : total;
      const autoAlloc =
        budget > 0 ? round2((amount / budget) * 100) : 0;
      const effectiveAllocation = storedAlloc ?? autoAlloc;
      // # of Shares is auto-calculated from the manually entered Share Price:
      // trunc(Amount ÷ Share Price). Share Price itself stays editable.
      const enteredSharePrice = Number(row.share_price) || 0;
      const sharesView =
        amount > 0 && enteredSharePrice > 0
          ? Math.trunc(amount / enteredSharePrice)
          : Number(row.shares) || 0;
      const sharePriceView = enteredSharePrice;

      plannedTotal += amount;
      actualTotal += actualTotalAmount;
      allocatedPercent += effectiveAllocation;

      return {
        id: row.id,
        accountNumber: row.account_number,
        symbol: row.symbol,
        shares: sharesView,
        sharePrice: sharePriceView,
        total,
        allocationPercent: storedAlloc,
        asOfDate: String(row.as_of_date ?? ""),
        comments: String(row.comments ?? ""),
        orderIndex: row.order_index,
        effectiveAllocation,
        currentMarketPrice,
        sharesPurchased: Number(holding?.quantity) || 0,
        actualSharePrice: Number(holding?.purchasePrice) || 0,
        actualTotalAmount,
        balanceAmount: round2(amount - actualTotalAmount),
        updatedAt: String(row.updated_at ?? ""),
        amount,
        symbolName: nameBySymbol.get(symbol) ?? "",
        sector:
          sectorBySymbol.get(symbol) ??
          (symbol ? fallbackSectorForSymbol(symbol) : ""),
      };
    });

    const allocatedPercent2 = round2(allocatedPercent);
    groups.push({
      accountNumber,
      accountName: account?.accountName ?? accountNumber,
      cashAvailable,
      budgetOverride,
      budget: round2(budget),
      rows,
      plannedTotal: round2(plannedTotal),
      actualTotal: round2(actualTotal),
      balanceTotal: round2(plannedTotal - actualTotal),
      allocatedPercent: allocatedPercent2,
      remainingPercent: round2(100 - allocatedPercent2),
      cashRemaining: round2(budget - plannedTotal),
    });
  };

  for (const account of portfolio.accounts) {
    buildGroup(account.accountNumber, account);
  }
  for (const orphan of orphans) {
    const raw =
      rowsResult.rows.find((r) => normAcc(r.account_number) === orphan) ?? null;
    buildGroup(raw?.account_number ?? budgetRawName.get(orphan) ?? orphan, undefined);
  }

  const sheetComment = (await getSetting(SHEET_COMMENT_KEY).catch(() => "")) ?? "";
  return { groups, symbols, sheetComment };
}

/** Save the single overall comment for the planner sheet. */
export async function setPlannerSheetComment(data: {
  value?: unknown;
}): Promise<PlannerState> {
  await setSetting(
    SHEET_COMMENT_KEY,
    String(data?.value ?? "")
      .trim()
      .slice(0, 2000),
  );
  return getPlannerState();
}

/** Edit the "Total - Account Level - Cash Allocation" budget for an account.
 *  Empty/null reverts to the live account cash balance. */
export async function setPlannerAccountBudget(data: {
  accountNumber?: string;
  value?: unknown;
}): Promise<PlannerState> {
  await ensurePlannerTable();
  const accountNumber = String(data?.accountNumber ?? "").trim();
  if (!accountNumber) throw new Error("Choose an account first.");

  const raw = data?.value;
  const blank = raw === null || raw === undefined || String(raw).trim() === "";
  if (blank) {
    // Clear the override but never wipe out the account's comments.
    await pool.query(
      `INSERT INTO portfolio_planner_account (account_number, total_override, comments)
       VALUES ($1, NULL, '')
       ON CONFLICT (account_number) DO UPDATE SET total_override = NULL`,
      [accountNumber],
    );
    return getPlannerState();
  }
  const parsed = Number(String(raw).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Total must be a non-negative number.");
  }
  await pool.query(
    `INSERT INTO portfolio_planner_account (account_number, total_override)
     VALUES ($1, $2)
     ON CONFLICT (account_number) DO UPDATE SET total_override = EXCLUDED.total_override`,
    [accountNumber, round2(parsed)],
  );
  return getPlannerState();
}

export async function addPlannerRow(data: {
  accountNumber?: string;
}): Promise<PlannerState> {
  await ensurePlannerTable();
  const accountNumber = String(data?.accountNumber ?? "").trim();
  if (!accountNumber) {
    throw new Error("Choose an account before adding a planner row.");
  }
  const maxResult = await pool.query<{ next: number | null }>(
    `SELECT COALESCE(MAX(order_index), 0) + 1 AS next
     FROM portfolio_planner WHERE account_number = $1`,
    [accountNumber],
  );
  const nextIndex = Number(maxResult.rows[0]?.next) || 1;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
  await pool.query(
    `INSERT INTO portfolio_planner
       (account_number, symbol, shares, share_price, total,
        allocation_percent, as_of_date, comments, order_index)
     VALUES ($1, '', 0, 0, 0, NULL, $2, '', $3)`,
    [accountNumber, today, nextIndex],
  );
  return getPlannerState();
}

type PlannerField =
  | "symbol"
  | "shares"
  | "sharePrice"
  | "total"
  | "allocationPercent"
  | "asOfDate"
  | "comments";

const TEXT_FIELDS: PlannerField[] = ["symbol", "asOfDate", "comments"];
const MONEY_FIELDS: PlannerField[] = ["shares", "sharePrice", "total"];

const COLUMN_BY_FIELD: Record<PlannerField, string> = {
  symbol: "symbol",
  shares: "shares",
  sharePrice: "share_price",
  total: "total",
  allocationPercent: "allocation_percent",
  asOfDate: "as_of_date",
  comments: "comments",
};

/** Effective allocation budget for an account: planner override ?? live cash. */
async function resolveAccountBudget(accountNumber: string): Promise<number> {
  const [accountsResult, overrideResult] = await Promise.all([
    pool.query<{ account_number: string; cash_available: number | string }>(
      `SELECT account_number, cash_available FROM portfolio_accounts`,
    ),
    pool.query<{ account_number: string; total_override: number | string | null }>(
      `SELECT account_number, total_override FROM portfolio_planner_account`,
    ),
  ]);
  const key = normAcc(accountNumber);
  const account = accountsResult.rows.find(
    (row) => normAcc(row.account_number) === key,
  );
  const cash = account ? round2(Number(account.cash_available) || 0) : 0;
  const override = overrideResult.rows.find(
    (row) => normAcc(row.account_number) === key,
  );
  return override?.total_override === null || override === undefined
    ? cash
    : round2(Number(override.total_override));
}

export async function editPlannerRow(data: {
  id?: number;
  field?: PlannerField;
  value?: unknown;
}): Promise<PlannerState> {
  await ensurePlannerTable();
  const id = Number(data?.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("A valid planner row id is required.");
  }
  const field = data?.field;
  if (field === "total") {
    // Amount is auto-calculated (allocation % × budget); no manual edits.
    throw new Error(
      "Amount is auto-calculated from % Allocation and cannot be edited directly.",
    );
  }
  if (field === "shares") {
    // # of Shares is auto-calculated: trunc(Amount ÷ Share Price).
    throw new Error(
      "# of Shares is auto-calculated and cannot be edited.",
    );
  }
  if (!field || !(field in COLUMN_BY_FIELD)) {
    throw new Error("That planner field cannot be edited.");
  }

  const column = COLUMN_BY_FIELD[field];
  let value: unknown = data?.value;
  /** Stamped only for editable-field changes (Actual/auto fields skip it). */
  const editedAt = new Date().toISOString();

  if (field === "symbol") {
    value = String(value ?? "")
      .trim()
      .toUpperCase()
      .slice(0, 40);
  } else if (field === "asOfDate") {
    value = String(value ?? "")
      .trim()
      .slice(0, 10);
  } else if (field === "comments") {
    value = String(value ?? "")
      .trim()
      .slice(0, 500);
  } else if (MONEY_FIELDS.includes(field)) {
    const parsed = Number(value);
    value = Number.isFinite(parsed) ? round2(parsed) : 0;
  } else if (field === "allocationPercent") {
    if (value === null || value === "" || value === undefined) {
      value = null;
    } else {
      const parsed = Number(value);
      value = Number.isFinite(parsed) ? round2(parsed) : null;
    }
  }

  let result;
  if (field === "symbol") {
    // Symbols are unique per account: a symbol can only be planned once in
    // an account block. Blank drafts (no symbol yet) are exempt.
    if (value) {
      const current = await pool.query<{ account_number: string }>(
        `SELECT account_number FROM portfolio_planner WHERE id = $1`,
        [id],
      );
      const accountNumber = current.rows[0]?.account_number;
      if (accountNumber) {
        const duplicate = await pool.query<{ id: number }>(
          `SELECT id FROM portfolio_planner
           WHERE account_number = $1 AND UPPER(BTRIM(symbol)) = $2 AND id <> $3
           LIMIT 1`,
          [accountNumber, value, id],
        );
        if (duplicate.rows.length > 0) {
          throw new Error(
            `"${value}" is already in this account's plan. Edit that row instead of adding a duplicate.`,
          );
        }
      }
    }
    result = await pool.query(
      `UPDATE portfolio_planner SET symbol = $2, updated_at = $3 WHERE id = $1`,
      [id, value, editedAt],
    );
  } else if (field === "allocationPercent" && value !== null) {
    // Typing a % Allocation drives the row Total off the cash allocation:
    // Total = % × budget, so planned dollars always tie to the percentage.
    const current = await pool.query<{ account_number: string }>(
      `SELECT account_number FROM portfolio_planner WHERE id = $1`,
      [id],
    );
    const row = current.rows[0];
    if (!row) {
      throw new Error("That planner row no longer exists. Refresh the sheet.");
    }
    const budget = await resolveAccountBudget(row.account_number);
    const total = round2(((value as number) / 100) * budget);
    result = await pool.query(
      `UPDATE portfolio_planner
       SET allocation_percent = $2, total = $3, updated_at = $4
       WHERE id = $1`,
      [id, value, total, editedAt],
    );
  } else {
    result = await pool.query(
      `UPDATE portfolio_planner SET ${column} = $2, updated_at = $3 WHERE id = $1`,
      [id, value, editedAt],
    );
  }
  if (result.rowCount === 0) {
    throw new Error("That planner row no longer exists. Refresh the sheet.");
  }
  return getPlannerState();
}

/**
 * Market pull for the Planner: refreshes every held/watched symbol via the
 * shared market refresh, then pulls quotes for planner-only symbols that have
 * never been quoted (so a brand-new symbol picked from the market search gets
 * a Market Price right away).
 */
export async function refreshPlannerMarketPrices(): Promise<PlannerState> {
  await ensurePlannerTable();
  await refreshAllMarketPrices();
  const plannerSymbols = await pool.query<{ symbol: string }>(
    `SELECT DISTINCT UPPER(BTRIM(symbol)) AS symbol
     FROM portfolio_planner WHERE BTRIM(symbol) <> ''`,
  );
  const cached = await pool.query<{ symbol: string }>(
    `SELECT symbol FROM market_cache`,
  );
  const cachedSet = new Set(
    cached.rows.map((row) => normSym(row.symbol)),
  );
  const missing = plannerSymbols.rows
    .map((row) => normSym(row.symbol))
    .filter((symbol) => symbol && !cachedSet.has(symbol));
  for (const symbol of missing) {
    await fetchSymbolQuote(symbol).catch(() => null);
  }
  return getPlannerState();
}

export async function deletePlannerRow(rowId: number): Promise<PlannerState> {
  await ensurePlannerTable();
  const id = Number(rowId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("A valid planner row id is required.");
  }
  await pool.query(`DELETE FROM portfolio_planner WHERE id = $1`, [id]);
  return getPlannerState();
}

export { TEXT_FIELDS, MONEY_FIELDS };
