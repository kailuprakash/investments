import { db, pool } from "@/db";
import {
  accountsTable,
  holdingsTable,
  futureInvestmentsTable,
  watchlistTable,
  weeklyHistoryTable,
  transactionHistoryTable,
  accountDetailsTable,
  depositDetailsTable,
} from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import seedData from "@/db/seed-data.json";

let initializedPromise: Promise<void> | null = null;

const DEFAULT_QUOTES: Record<
  string,
  { price: number; previousClose: number; change: number; changePercent: number; name: string; exchange: string; quoteType: string }
> = {
  AAPL: { price: 337.0, previousClose: 332.41, change: 4.59, changePercent: 1.38, name: "Apple Inc.", exchange: "NASDAQ", quoteType: "EQUITY" },
  GOOG: { price: 185.0, previousClose: 182.6, change: 2.4, changePercent: 1.31, name: "Alphabet Inc.", exchange: "NASDAQ", quoteType: "EQUITY" },
  GOOGL: { price: 183.4, previousClose: 181.1, change: 2.3, changePercent: 1.27, name: "Alphabet Inc. Class A", exchange: "NASDAQ", quoteType: "EQUITY" },
  MSFT: { price: 448.5, previousClose: 444.2, change: 4.3, changePercent: 0.97, name: "Microsoft Corporation", exchange: "NASDAQ", quoteType: "EQUITY" },
  NFLX: { price: 712.8, previousClose: 705.0, change: 7.8, changePercent: 1.11, name: "Netflix, Inc.", exchange: "NASDAQ", quoteType: "EQUITY" },
  NVDA: { price: 136.2, previousClose: 133.5, change: 2.7, changePercent: 2.02, name: "NVIDIA Corporation", exchange: "NASDAQ", quoteType: "EQUITY" },
  TSLA: { price: 254.9, previousClose: 250.1, change: 4.8, changePercent: 1.92, name: "Tesla, Inc.", exchange: "NASDAQ", quoteType: "EQUITY" },
  AMZN: { price: 210.4, previousClose: 208.1, change: 2.3, changePercent: 1.11, name: "Amazon.com, Inc.", exchange: "NASDAQ", quoteType: "EQUITY" },
  META: { price: 592.0, previousClose: 585.4, change: 6.6, changePercent: 1.13, name: "Meta Platforms, Inc.", exchange: "NASDAQ", quoteType: "EQUITY" },
  SOXL: { price: 114.82, previousClose: 111.9, change: 2.92, changePercent: 2.61, name: "Direxion Daily Semiconductor Bull 3X Shares", exchange: "NYSEArca", quoteType: "ETF" },
  GGLL: { price: 102.5, previousClose: 100.8, change: 1.7, changePercent: 1.69, name: "Direxion Daily GOOGL Bull 2X Shares", exchange: "NASDAQ", quoteType: "ETF" },
  NVDL: { price: 68.4, previousClose: 66.9, change: 1.5, changePercent: 2.24, name: "GraniteShares 2x Long NVDA Daily ETF", exchange: "NASDAQ", quoteType: "ETF" },
  TQQQ: { price: 78.6, previousClose: 77.1, change: 1.5, changePercent: 1.95, name: "ProShares UltraPro QQQ", exchange: "NASDAQ", quoteType: "ETF" },
  SPY: { price: 584.2, previousClose: 581.5, change: 2.7, changePercent: 0.46, name: "SPDR S&P 500 ETF Trust", exchange: "NYSEArca", quoteType: "ETF" },
  QQQ: { price: 502.3, previousClose: 498.9, change: 3.4, changePercent: 0.68, name: "Invesco QQQ Trust", exchange: "NASDAQ", quoteType: "ETF" },
};

// Populate initial cache from seedData.portfolio.marketCache if present
const marketCacheStore: Record<string, number> = {};
if (Array.isArray(seedData.portfolio.marketCache)) {
  for (const item of seedData.portfolio.marketCache) {
    if (item && item.symbol) {
      marketCacheStore[String(item.symbol).toUpperCase()] = Number(item.price) || 0;
    }
  }
}

function round2(n: number): number {
  return Number((Number(n) || 0).toFixed(2));
}

export async function ensureDbSeeded(): Promise<void> {
  if (initializedPromise) {
    return initializedPromise;
  }
  initializedPromise = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_accounts (
        id SERIAL PRIMARY KEY,
        s_no INTEGER NOT NULL DEFAULT 1,
        account_number TEXT NOT NULL,
        account_name TEXT NOT NULL,
        cash_available DOUBLE PRECISION NOT NULL DEFAULT 0,
        comments TEXT NOT NULL DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS portfolio_holdings (
        id SERIAL PRIMARY KEY,
        account_number TEXT NOT NULL,
        symbol TEXT NOT NULL,
        quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
        purchase_price DOUBLE PRECISION NOT NULL DEFAULT 0,
        invest_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
        current_price DOUBLE PRECISION NOT NULL DEFAULT 0,
        overall_current_price DOUBLE PRECISION NOT NULL DEFAULT 0,
        comments TEXT NOT NULL DEFAULT '',
        highlight TEXT NOT NULL DEFAULT '',
        profit_loss_amt DOUBLE PRECISION NOT NULL DEFAULT 0,
        gain_loss_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS portfolio_future_investments (
        id SERIAL PRIMARY KEY,
        account_number TEXT NOT NULL,
        date_time TEXT NOT NULL,
        action TEXT NOT NULL,
        symbol TEXT NOT NULL,
        quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
        price_per_share DOUBLE PRECISION NOT NULL DEFAULT 0,
        total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
        current_price DOUBLE PRECISION NOT NULL DEFAULT 0,
        average_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
        cost_basis_per_share DOUBLE PRECISION NOT NULL DEFAULT 0,
        difference_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
        difference_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
        comments TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'EXECUTED',
        remaining_quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
        source_transaction_id INTEGER
      );
      ALTER TABLE portfolio_future_investments
        ADD COLUMN IF NOT EXISTS average_cost DOUBLE PRECISION NOT NULL DEFAULT 0;
      UPDATE portfolio_future_investments
        SET average_cost = COALESCE(NULLIF(average_cost, 0), NULLIF(cost_basis_per_share, 0), price_per_share)
        WHERE average_cost = 0 OR average_cost IS NULL;
      CREATE TABLE IF NOT EXISTS portfolio_watchlist (
        symbol TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        exchange TEXT NOT NULL DEFAULT 'NASDAQ',
        quote_type TEXT NOT NULL DEFAULT 'Equity',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS portfolio_weekly_history (
        id SERIAL PRIMARY KEY,
        account_number TEXT NOT NULL,
        snapshot_week TEXT NOT NULL,
        investment_current_value DOUBLE PRECISION NOT NULL DEFAULT 0,
        gain_loss_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
        gain_loss_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
        captured_at TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'SATURDAY_9PM_ET'
      );
      CREATE TABLE IF NOT EXISTS portfolio_transaction_history (
        id SERIAL PRIMARY KEY,
        account_number TEXT NOT NULL,
        snapshot_week TEXT NOT NULL,
        buy_value DOUBLE PRECISION NOT NULL DEFAULT 0,
        sell_value DOUBLE PRECISION NOT NULL DEFAULT 0,
        net_cash_flow DOUBLE PRECISION NOT NULL DEFAULT 0,
        realized_gain_loss DOUBLE PRECISION NOT NULL DEFAULT 0,
        buy_count INTEGER NOT NULL DEFAULT 0,
        sell_count INTEGER NOT NULL DEFAULT 0,
        captured_at TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'SATURDAY_9PM_ET'
      );
      CREATE TABLE IF NOT EXISTS portfolio_account_details (
        id SERIAL PRIMARY KEY,
        financial_institute TEXT NOT NULL DEFAULT 'CS',
        active_status TEXT NOT NULL DEFAULT 'Active',
        account_type TEXT NOT NULL DEFAULT 'Trading Account',
        account_number TEXT NOT NULL UNIQUE,
        start_date TEXT NOT NULL DEFAULT '',
        comments TEXT NOT NULL DEFAULT '',
        tax_period TEXT NOT NULL DEFAULT 'Yearly Tax on Profit in US.',
        order_index INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS portfolio_deposit_details (
        id SERIAL PRIMARY KEY,
        account_number TEXT NOT NULL,
        date_invested TEXT NOT NULL,
        amount DOUBLE PRECISION NOT NULL DEFAULT 0,
        comments TEXT NOT NULL DEFAULT '',
        order_index INTEGER NOT NULL DEFAULT 0
      );
    `);

    const existingAccounts = await db.select().from(accountsTable);
    if (existingAccounts.length === 0) {
      // Seed accounts and holdings
      for (const acc of seedData.portfolio.accounts) {
        await db.insert(accountsTable).values({
          sNo: acc.sNo,
          accountNumber: acc.accountNumber,
          accountName: acc.accountName,
          cashAvailable: acc.cashAvailable,
          comments: acc.comments || "",
        });
        for (const h of acc.holdings || []) {
          marketCacheStore[h.symbol.toUpperCase()] = h.currentPrice;
          await db.insert(holdingsTable).values({
            accountNumber: h.accountNumber,
            symbol: h.symbol,
            quantity: h.quantity,
            purchasePrice: h.purchasePrice,
            investAmount: h.investAmount,
            currentPrice: h.currentPrice,
            overallCurrentPrice: h.overallCurrentPrice,
            comments: h.comments || "",
            highlight: h.highlight || "",
            profitLossAmt: h.profitLossAmt,
            gainLossPercent: h.gainLossPercent,
            updatedAt: h.updatedAt || new Date().toISOString(),
          });
        }
      }

      // Seed futureInvestments (Daily Transactions)
      for (const tx of seedData.portfolio.futureInvestments || []) {
        marketCacheStore[tx.symbol.toUpperCase()] = tx.currentPrice;
        const isSell = String(tx.action).toUpperCase() === "SELL";
        const avgCost = isSell ? round2(tx.costBasisPerShare ?? tx.pricePerShare) : 0;
        const diffPerShare = isSell
          ? tx.pricePerShare - (avgCost || tx.pricePerShare)
          : tx.currentPrice - tx.pricePerShare;
        const baseForPct = isSell ? avgCost || tx.pricePerShare : tx.pricePerShare;
        const diffAmt = round2(diffPerShare * tx.quantity);
        const diffPct = baseForPct > 0 ? round2((diffPerShare / baseForPct) * 100) : 0;
        await db.insert(futureInvestmentsTable).values({
          accountNumber: tx.accountNumber,
          dateTime: tx.dateTime,
          action: tx.action,
          symbol: tx.symbol,
          quantity: tx.quantity,
          pricePerShare: tx.pricePerShare,
          totalAmount: tx.totalAmount,
          currentPrice: tx.currentPrice,
          averageCost: avgCost,
          costBasisPerShare: isSell ? avgCost : tx.pricePerShare,
          differenceAmount: diffAmt,
          differencePercent: diffPct,
          comments: tx.comments || "",
          status: tx.status || "EXECUTED",
          remainingQuantity: tx.remainingQuantity ?? (tx.action === "BUY" ? tx.quantity : 0),
          sourceTransactionId: tx.sourceTransactionId ?? null,
        });
      }

      // Seed watchlist
      for (const item of seedData.watchlist || []) {
        await db
          .insert(watchlistTable)
          .values({
            symbol: item.symbol,
            name: item.name,
            exchange: item.exchange || "NASDAQ",
            quoteType: item.quoteType || "Equity",
            createdAt: item.createdAt || new Date().toISOString(),
          })
          .onConflictDoNothing();
      }

      // Seed weeklyHistory
      for (const row of seedData.weeklyHistory || []) {
        await db.insert(weeklyHistoryTable).values({
          accountNumber: row.accountNumber,
          snapshotWeek: row.snapshotWeek,
          investmentCurrentValue: row.investmentCurrentValue,
          gainLossAmount: row.gainLossAmount,
          gainLossPercent: row.gainLossPercent,
          capturedAt: row.capturedAt || new Date().toISOString(),
          source: row.source || "SATURDAY_9PM_ET",
        });
      }

      // Seed transactionHistory
      for (const row of seedData.transactionHistory || []) {
        await db.insert(transactionHistoryTable).values({
          accountNumber: row.accountNumber,
          snapshotWeek: row.snapshotWeek,
          buyValue: row.buyValue,
          sellValue: row.sellValue,
          netCashFlow: row.netCashFlow,
          realizedGainLoss: row.realizedGainLoss,
          buyCount: row.buyCount,
          sellCount: row.sellCount,
          capturedAt: row.capturedAt || new Date().toISOString(),
          source: row.source || "SATURDAY_9PM_ET",
        });
      }
    }

    const existingAccDetails = await db.select().from(accountDetailsTable);
    if (existingAccDetails.length === 0) {
      await db.insert(accountDetailsTable).values([
        { financialInstitute: "CS", activeStatus: "Active", accountType: "Trading Account", accountNumber: "CS 9271", startDate: "Nov-23", comments: "", taxPeriod: "Yearly Tax on Profit in US.", orderIndex: 1 },
        { financialInstitute: "CS", activeStatus: "Active", accountType: "Trading Account", accountNumber: "CS 9538", startDate: "Aug-24", comments: "Divided by 2.", taxPeriod: "Yearly Tax on Profit in US.", orderIndex: 2 },
        { financialInstitute: "RH", activeStatus: "Active", accountType: "Trading Account", accountNumber: "RH 8031", startDate: "Feb-24", comments: "", taxPeriod: "Yearly Tax on Profit in US.", orderIndex: 3 },
        { financialInstitute: "ME", activeStatus: "Active", accountType: "Cash Management", accountNumber: "ME-CMA 82K32", startDate: "Jan-24", comments: "", taxPeriod: "Yearly Tax on Profit in US.", orderIndex: 4 },
        { financialInstitute: "ME", activeStatus: "Active", accountType: "Traditional IRA", accountNumber: "ME-IRA 85363", startDate: "Jan-24", comments: "", taxPeriod: "Tax Deferred.", orderIndex: 5 },
        { financialInstitute: "ME", activeStatus: "Active", accountType: "Rollover IRA", accountNumber: "ME-IRRA 73444", startDate: "Jan-24", comments: "", taxPeriod: "Tax Deferred.", orderIndex: 6 },
        { financialInstitute: "ME", activeStatus: "Active", accountType: "Roth IRA", accountNumber: "ME-Roth 82T11", startDate: "Jan-24", comments: "", taxPeriod: "Tax Free Growth in US.", orderIndex: 7 },
      ]);

      await db.insert(depositDetailsTable).values([
        { accountNumber: "CS 9271", dateInvested: "11/6/2024", amount: 6501.95, comments: "Transfer of Securities(In/Out)", orderIndex: 1 },
        { accountNumber: "CS 9271", dateInvested: "11/6/2024", amount: 392.06, comments: "Transfer of Cash", orderIndex: 2 },
        { accountNumber: "CS 9271", dateInvested: "2/22/2024", amount: 15500.00, comments: "", orderIndex: 3 },
        { accountNumber: "CS 9271", dateInvested: "4/3/2024", amount: 10500.00, comments: "", orderIndex: 4 },
        { accountNumber: "CS 9271", dateInvested: "6/25/2024", amount: 15000.00, comments: "", orderIndex: 5 },

        { accountNumber: "CS 9538", dateInvested: "7/29/2024", amount: 100.00, comments: "Savings Money", orderIndex: 6 },
        { accountNumber: "CS 9538", dateInvested: "8/5/2025", amount: 13500.00, comments: "Money is funded from Dish Shares Sales. Half money each", orderIndex: 7 },
        { accountNumber: "CS 9538", dateInvested: "8/15/2025", amount: 22000.00, comments: "Transfer from Main Bank", orderIndex: 8 },

        { accountNumber: "RH 8031", dateInvested: "2/10/2024", amount: 6553.49, comments: "Initial Deposit", orderIndex: 9 },
        { accountNumber: "ME-CMA 82K32", dateInvested: "1/15/2024", amount: 50000.00, comments: "Core Cash Deposit", orderIndex: 10 },
        { accountNumber: "ME-IRA 85363", dateInvested: "1/15/2024", amount: 64000.00, comments: "Rollover Contribution", orderIndex: 11 },
        { accountNumber: "ME-IRRA 73444", dateInvested: "1/15/2024", amount: 150000.00, comments: "401k Rollover", orderIndex: 12 },
        { accountNumber: "ME-Roth 82T11", dateInvested: "1/15/2024", amount: 200000.00, comments: "Roth Conversion Deposit", orderIndex: 13 },
      ]);
    }
  })();
  return initializedPromise;
}

export async function fetchSymbolQuote(symbolRaw: string) {
  await ensureDbSeeded();
  const symbol = symbolRaw.trim().toUpperCase();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
        cache: "no-store",
      }
    );
    clearTimeout(timer);
    if (res.ok) {
      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === "number") {
        const price = round2(meta.regularMarketPrice);
        const previousClose = round2(meta.chartPreviousClose || meta.previousClose || price);
        const change = round2(price - previousClose);
        const changePercent = previousClose > 0 ? round2((change / previousClose) * 100) : 0;
        marketCacheStore[symbol] = price;
        return { price, previousClose, change, changePercent };
      }
    }
  } catch {
    // Fallback to cached / default quote
  }

  if (DEFAULT_QUOTES[symbol]) {
    const q = DEFAULT_QUOTES[symbol];
    return {
      price: marketCacheStore[symbol] ?? q.price,
      previousClose: q.previousClose,
      change: q.change,
      changePercent: q.changePercent,
    };
  }

  const cachedPrice = marketCacheStore[symbol] ?? 100.0;
  const prevClose = round2(cachedPrice * 0.988);
  const diff = round2(cachedPrice - prevClose);
  const diffPct = prevClose > 0 ? round2((diff / prevClose) * 100) : 1.2;
  return {
    price: cachedPrice,
    previousClose: prevClose,
    change: diff,
    changePercent: diffPct,
  };
}

export async function getPortfolioState() {
  await ensureDbSeeded();

  const accountsRows = await db.select().from(accountsTable).orderBy(asc(accountsTable.sNo), asc(accountsTable.id));
  const holdingsRows = await db.select().from(holdingsTable).orderBy(asc(holdingsTable.id));
  const futureRows = await db
    .select()
    .from(futureInvestmentsTable)
    .orderBy(desc(futureInvestmentsTable.dateTime), desc(futureInvestmentsTable.id));

  const accounts = accountsRows.map((acc, idx) => {
    const accHoldings = holdingsRows
      .filter((h) => h.accountNumber === acc.accountNumber)
      .map((h) => {
        const investAmount = round2(h.quantity * h.purchasePrice);
        const overallCurrentPrice = round2(h.quantity * h.currentPrice);
        const profitLossAmt = round2(overallCurrentPrice - investAmount);
        const gainLossPercent = investAmount > 0 ? round2((profitLossAmt / investAmount) * 100) : 0;
        return {
          id: h.id,
          accountNumber: h.accountNumber,
          symbol: h.symbol,
          quantity: h.quantity,
          purchasePrice: h.purchasePrice,
          investAmount,
          currentPrice: h.currentPrice,
          overallCurrentPrice,
          comments: h.comments || "",
          highlight: h.highlight || "",
          profitLossAmt,
          gainLossPercent,
          updatedAt: h.updatedAt,
        };
      });

    const amountInvested = round2(accHoldings.reduce((sum, h) => sum + h.investAmount, 0));
    const investmentCurrent = round2(accHoldings.reduce((sum, h) => sum + h.overallCurrentPrice, 0));
    const cashAvailable = round2(acc.cashAvailable);
    const accountOverallMoney = round2(cashAvailable + investmentCurrent);
    const gainLoss = round2(investmentCurrent - amountInvested);
    const gainLossPercent = amountInvested > 0 ? round2((gainLoss / amountInvested) * 100) : 0;

    return {
      sNo: idx + 1,
      id: acc.id,
      accountNumber: acc.accountNumber,
      accountName: acc.accountName,
      accountOverallMoney,
      cashAvailable,
      amountInvested,
      investmentCurrent,
      gainLoss,
      gainLossPercent,
      comments: acc.comments || "",
      holdings: accHoldings,
    };
  });

  const totalCash = round2(accounts.reduce((sum, a) => sum + a.cashAvailable, 0));
  const totalInvested = round2(accounts.reduce((sum, a) => sum + a.amountInvested, 0));
  const totalCurrent = round2(accounts.reduce((sum, a) => sum + a.investmentCurrent, 0));
  const totalOverall = round2(totalCash + totalCurrent);
  const totalGainLoss = round2(totalCurrent - totalInvested);
  const totalGainLossPercent = totalInvested > 0 ? round2((totalGainLoss / totalInvested) * 100) : 0;

  const grandTotal = {
    accountOverallMoney: totalOverall,
    cashAvailable: totalCash,
    amountInvested: totalInvested,
    investmentCurrent: totalCurrent,
    gainLoss: totalGainLoss,
    gainLossPercent: totalGainLossPercent,
  };

  const futureInvestments = futureRows.map((tx) => {
    const isSell = String(tx.action).toUpperCase() === "SELL";
    const sellAvgCost = isSell
      ? round2(tx.averageCost || tx.costBasisPerShare || tx.pricePerShare)
      : null;
    const diffPerShare = isSell
      ? tx.pricePerShare - (sellAvgCost || tx.pricePerShare)
      : tx.currentPrice - tx.pricePerShare;
    const baseForPct = isSell ? sellAvgCost || tx.pricePerShare : tx.pricePerShare;
    const differenceAmount = round2(diffPerShare * tx.quantity);
    const differencePercent = baseForPct > 0 ? round2((diffPerShare / baseForPct) * 100) : 0;
    return {
      id: tx.id,
      accountNumber: tx.accountNumber,
      dateTime: tx.dateTime,
      action: tx.action as "BUY" | "SELL",
      symbol: tx.symbol,
      quantity: tx.quantity,
      pricePerShare: tx.pricePerShare,
      totalAmount: tx.totalAmount,
      currentPrice: tx.currentPrice,
      averageCost: sellAvgCost,
      costBasisPerShare: isSell ? sellAvgCost ?? tx.pricePerShare : tx.pricePerShare,
      differenceAmount,
      differencePercent,
      comments: tx.comments || "",
      status: tx.status || "EXECUTED",
      remainingQuantity: tx.remainingQuantity,
      sourceTransactionId: tx.sourceTransactionId,
    };
  });

  return {
    accounts,
    grandTotal,
    futureInvestments,
    marketCache: marketCacheStore,
    lastRefreshed: new Date().toISOString(),
  };
}

export async function refreshAllMarketPrices() {
  await ensureDbSeeded();
  const holdingsRows = await db.select().from(holdingsTable);
  const futureRows = await db.select().from(futureInvestmentsTable);
  const symbols = Array.from(
    new Set([
      ...holdingsRows.map((h) => h.symbol.toUpperCase()),
      ...futureRows.map((f) => f.symbol.toUpperCase()),
    ])
  );

  for (const sym of symbols) {
    const q = await fetchSymbolQuote(sym);
    marketCacheStore[sym] = q.price;
  }

  const nowIso = new Date().toISOString();
  for (const h of holdingsRows) {
    const sym = h.symbol.toUpperCase();
    const curPrice = marketCacheStore[sym] ?? h.currentPrice;
    const investAmount = round2(h.quantity * h.purchasePrice);
    const overallCurrentPrice = round2(h.quantity * curPrice);
    const profitLossAmt = round2(overallCurrentPrice - investAmount);
    const gainLossPercent = investAmount > 0 ? round2((profitLossAmt / investAmount) * 100) : 0;
    await db
      .update(holdingsTable)
      .set({
        currentPrice: curPrice,
        investAmount,
        overallCurrentPrice,
        profitLossAmt,
        gainLossPercent,
        updatedAt: nowIso,
      })
      .where(eq(holdingsTable.id, h.id));
  }

  for (const f of futureRows) {
    const sym = f.symbol.toUpperCase();
    const curPrice = marketCacheStore[sym] ?? f.currentPrice;
    const isSell = String(f.action).toUpperCase() === "SELL";
    const sellAvgCost = isSell
      ? round2(f.averageCost || f.costBasisPerShare || f.pricePerShare)
      : 0;
    const basePrice = isSell ? sellAvgCost || f.pricePerShare : f.pricePerShare;
    const diffPerShare = isSell ? f.pricePerShare - basePrice : curPrice - f.pricePerShare;
    const differenceAmount = round2(diffPerShare * f.quantity);
    const differencePercent = basePrice > 0 ? round2((diffPerShare / basePrice) * 100) : 0;
    await db
      .update(futureInvestmentsTable)
      .set({
        currentPrice: curPrice,
        averageCost: isSell ? sellAvgCost : 0,
        costBasisPerShare: basePrice,
        differenceAmount,
        differencePercent,
      })
      .where(eq(futureInvestmentsTable.id, f.id));
  }

  return getPortfolioState();
}

export async function executeFutureTrade(data: {
  accountNumber: string;
  action: "BUY" | "SELL";
  symbol: string;
  quantity: number;
  pricePerShare: number;
  averageCost?: number;
  costBasisPerShare?: number;
  comments?: string;
  sourceTransactionId?: number;
}) {
  await ensureDbSeeded();
  const accountNumber = data.accountNumber.trim();
  const symbol = data.symbol.trim().toUpperCase();
  const action = data.action === "SELL" ? "SELL" : "BUY";
  const quantity = Number(data.quantity) || 0;
  const pricePerShare = Number(data.pricePerShare) || 0;
  const totalAmount = round2(quantity * pricePerShare);
  const quote = await fetchSymbolQuote(symbol);
  const currentPrice = quote.price || pricePerShare;

  // Find or create account
  const norm = (s: string) =>
    String(s || "")
      .trim()
      .toUpperCase()
      .replace(/^[0-9]+\.\s*/, "")
      .replace(/[\s_-]+/g, "");

  const allAccounts = await db.select().from(accountsTable);
  let account = allAccounts.find((a) => norm(a.accountNumber) === norm(accountNumber));
  if (!account) {
    const [inserted] = await db
      .insert(accountsTable)
      .values({
        sNo: allAccounts.length + 1,
        accountNumber,
        accountName: accountNumber,
        cashAvailable: 50000,
        comments: "",
      })
      .returning();
    account = inserted;
  }

  // Existing holdings for this account + symbol
  const allHoldingsRows = await db.select().from(holdingsTable);
  const existingHolding = allHoldingsRows.find(
    (h) => norm(h.accountNumber) === norm(accountNumber) && h.symbol.trim().toUpperCase() === symbol
  );

  let costBasisPerShare = existingHolding?.purchasePrice || pricePerShare;
  if (action === "SELL" && data.sourceTransactionId) {
    const srcRows = await db
      .select()
      .from(futureInvestmentsTable)
      .where(eq(futureInvestmentsTable.id, Number(data.sourceTransactionId)));
    if (srcRows[0]) {
      costBasisPerShare = srcRows[0].pricePerShare || srcRows[0].averageCost || pricePerShare;
      const newRem = Math.max(0, round2(srcRows[0].remainingQuantity - quantity));
      await db
        .update(futureInvestmentsTable)
        .set({ remainingQuantity: newRem })
        .where(eq(futureInvestmentsTable.id, srcRows[0].id));
    }
  } else if (action === "BUY") {
    costBasisPerShare = pricePerShare;
  }

  if (
    data.averageCost !== undefined &&
    Number.isFinite(Number(data.averageCost)) &&
    Number(data.averageCost) > 0
  ) {
    costBasisPerShare = round2(Number(data.averageCost));
  } else if (
    data.costBasisPerShare !== undefined &&
    Number.isFinite(Number(data.costBasisPerShare)) &&
    Number(data.costBasisPerShare) > 0
  ) {
    costBasisPerShare = round2(Number(data.costBasisPerShare));
  }

  const isSell = action === "SELL";
  const sellAvgCost = isSell ? round2(costBasisPerShare) : 0;
  const basePrice = isSell ? sellAvgCost || pricePerShare : pricePerShare;
  const diffPerShare = isSell ? pricePerShare - basePrice : currentPrice - pricePerShare;
  const differenceAmount = round2(diffPerShare * quantity);
  const differencePercent = basePrice > 0 ? round2((diffPerShare / basePrice) * 100) : 0;

  // Insert transaction
  await db.insert(futureInvestmentsTable).values({
    accountNumber: account.accountNumber,
    dateTime: new Date().toISOString(),
    action,
    symbol,
    quantity,
    pricePerShare,
    totalAmount,
    currentPrice,
    averageCost: sellAvgCost,
    costBasisPerShare: basePrice,
    differenceAmount,
    differencePercent,
    comments: data.comments || "",
    status: "EXECUTED",
    remainingQuantity: action === "BUY" ? quantity : 0,
    sourceTransactionId: data.sourceTransactionId ?? null,
  });

  // Update account cash balance
  const updatedCash =
    action === "BUY"
      ? round2(account.cashAvailable - totalAmount)
      : round2(account.cashAvailable + totalAmount);
  await db
    .update(accountsTable)
    .set({ cashAvailable: updatedCash })
    .where(eq(accountsTable.id, account.id));

  // Update holding in Consolidated View
  const nowIso = new Date().toISOString();
  if (action === "BUY") {
    if (existingHolding) {
      const priorInvest =
        existingHolding.investAmount > 0
          ? existingHolding.investAmount
          : round2(existingHolding.quantity * existingHolding.purchasePrice);
      const newQty = round2(existingHolding.quantity + quantity);
      const newInvest = round2(priorInvest + totalAmount);
      const newAvg = newQty > 0 ? round2(newInvest / newQty) : pricePerShare;
      const newOverall = round2(newQty * currentPrice);
      const newPL = round2(newOverall - newInvest);
      const newPLPct = newInvest > 0 ? round2((newPL / newInvest) * 100) : 0;
      await db
        .update(holdingsTable)
        .set({
          quantity: newQty,
          purchasePrice: newAvg,
          investAmount: newInvest,
          currentPrice,
          overallCurrentPrice: newOverall,
          profitLossAmt: newPL,
          gainLossPercent: newPLPct,
          updatedAt: nowIso,
        })
        .where(eq(holdingsTable.id, existingHolding.id));
    } else {
      const investAmount = totalAmount;
      const overallCurrentPrice = round2(quantity * currentPrice);
      const profitLossAmt = round2(overallCurrentPrice - investAmount);
      const gainLossPercent = investAmount > 0 ? round2((profitLossAmt / investAmount) * 100) : 0;
      await db.insert(holdingsTable).values({
        accountNumber: account.accountNumber,
        symbol,
        quantity,
        purchasePrice: pricePerShare,
        investAmount,
        currentPrice,
        overallCurrentPrice,
        comments: data.comments || "",
        highlight: "",
        profitLossAmt,
        gainLossPercent,
        updatedAt: nowIso,
      });
    }
  } else {
    // SELL: deduct sold quantity and sold cost basis
    if (existingHolding) {
      const newQty = Math.max(0, round2(existingHolding.quantity - quantity));
      if (newQty <= 0) {
        await db.delete(holdingsTable).where(eq(holdingsTable.id, existingHolding.id));
      } else {
        const priorInvest =
          existingHolding.investAmount > 0
            ? existingHolding.investAmount
            : round2(existingHolding.quantity * existingHolding.purchasePrice);
        const soldCost = round2(quantity * basePrice);
        const newInvest = Math.max(0, round2(priorInvest - soldCost));
        const newAvg = newQty > 0 ? round2(newInvest / newQty) : round2(basePrice);
        const newOverall = round2(newQty * currentPrice);
        const newPL = round2(newOverall - newInvest);
        const newPLPct = newInvest > 0 ? round2((newPL / newInvest) * 100) : 0;
        await db
          .update(holdingsTable)
          .set({
            quantity: newQty,
            purchasePrice: newAvg,
            investAmount: newInvest,
            currentPrice,
            overallCurrentPrice: newOverall,
            profitLossAmt: newPL,
            gainLossPercent: newPLPct,
            updatedAt: nowIso,
          })
          .where(eq(holdingsTable.id, existingHolding.id));
      }
    }
  }

  return getPortfolioState();
}
export async function updateCurrentHoldingField(data: {
  id: number;
  quantity?: number;
  purchasePrice?: number;
  currentPrice?: number;
  comments?: string;
}) {
  await ensureDbSeeded();
  const rows = await db.select().from(holdingsTable).where(eq(holdingsTable.id, Number(data.id)));
  if (!rows[0]) throw new Error("Holding not found");
  const h = rows[0];
  const quantity = data.quantity !== undefined ? Number(data.quantity) : h.quantity;
  const purchasePrice = data.purchasePrice !== undefined ? Number(data.purchasePrice) : h.purchasePrice;
  const currentPrice = data.currentPrice !== undefined ? Number(data.currentPrice) : h.currentPrice;
  const comments = data.comments !== undefined ? String(data.comments) : h.comments;

  const investAmount = round2(quantity * purchasePrice);
  const overallCurrentPrice = round2(quantity * currentPrice);
  const profitLossAmt = round2(overallCurrentPrice - investAmount);
  const gainLossPercent = investAmount > 0 ? round2((profitLossAmt / investAmount) * 100) : 0;

  await db
    .update(holdingsTable)
    .set({
      quantity,
      purchasePrice,
      currentPrice,
      comments,
      investAmount,
      overallCurrentPrice,
      profitLossAmt,
      gainLossPercent,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(holdingsTable.id, h.id));

  return getPortfolioState();
}

export async function editFutureTransaction(data: {
  id: number;
  quantity?: number;
  pricePerShare?: number;
  averageCost?: number;
  costBasisPerShare?: number;
  currentPrice?: number;
  comments?: string;
  action?: string;
  symbol?: string;
  accountNumber?: string;
  dateTime?: string;
}) {
  await ensureDbSeeded();
  const rows = await db
    .select()
    .from(futureInvestmentsTable)
    .where(eq(futureInvestmentsTable.id, Number(data.id)));
  if (!rows[0]) throw new Error("Transaction not found");
  const tx = rows[0];

  const quantity = data.quantity !== undefined ? Number(data.quantity) : tx.quantity;
  const pricePerShare = data.pricePerShare !== undefined ? Number(data.pricePerShare) : tx.pricePerShare;
  const currentPrice = data.currentPrice !== undefined ? Number(data.currentPrice) : tx.currentPrice;
  const comments = data.comments !== undefined ? String(data.comments) : tx.comments;
  const action = data.action !== undefined ? String(data.action).toUpperCase() : tx.action.toUpperCase();
  const symbol = data.symbol !== undefined ? String(data.symbol).toUpperCase() : tx.symbol.toUpperCase();
  const accountNumber = data.accountNumber !== undefined ? String(data.accountNumber).trim() : tx.accountNumber.trim();
  const dateTime = data.dateTime !== undefined ? String(data.dateTime) : tx.dateTime;

  const totalAmount = round2(quantity * pricePerShare);
  const isSell = action === "SELL";

  const norm = (s: string) =>
    String(s || "")
      .trim()
      .toUpperCase()
      .replace(/^[0-9]+\.\s*/, "")
      .replace(/[\s_-]+/g, "");

  const allHoldingsRows = await db.select().from(holdingsTable);
  const existingHolding = allHoldingsRows.find(
    (h) => norm(h.accountNumber) === norm(accountNumber) && h.symbol.trim().toUpperCase() === symbol
  );

  const rawAvgCost =
    data.averageCost !== undefined
      ? Number(data.averageCost)
      : data.costBasisPerShare !== undefined
      ? Number(data.costBasisPerShare)
      : tx.averageCost || tx.costBasisPerShare || (existingHolding ? existingHolding.purchasePrice : pricePerShare);

  const sellAvgCost = isSell ? round2(rawAvgCost > 0 ? rawAvgCost : pricePerShare) : 0;
  const basePrice = isSell ? sellAvgCost || pricePerShare : pricePerShare;
  const diffPerShare = isSell ? pricePerShare - basePrice : currentPrice - pricePerShare;
  const differenceAmount = round2(diffPerShare * quantity);
  const differencePercent = basePrice > 0 ? round2((diffPerShare / basePrice) * 100) : 0;

  const oldIsSell = String(tx.action).toUpperCase() === "SELL";
  const oldQty = Number(tx.quantity) || 0;
  const oldPps = Number(tx.pricePerShare) || 0;
  const oldTotalAmount = round2(oldQty * oldPps);
  const oldBasePrice = oldIsSell
    ? round2(tx.averageCost || tx.costBasisPerShare || (existingHolding ? existingHolding.purchasePrice : oldPps))
    : oldPps;

  // 1. Update the transaction in portfolio_future_investments
  await db
    .update(futureInvestmentsTable)
    .set({
      quantity,
      pricePerShare,
      averageCost: sellAvgCost,
      costBasisPerShare: basePrice,
      currentPrice,
      comments,
      action,
      symbol,
      accountNumber,
      dateTime,
      totalAmount,
      differenceAmount,
      differencePercent,
      remainingQuantity: action === "BUY" ? quantity : 0,
    })
    .where(eq(futureInvestmentsTable.id, tx.id));

  // 2. Reconcile account cash balance in portfolio_accounts
  const allAccounts = await db.select().from(accountsTable);
  const targetAcc = allAccounts.find((a) => norm(a.accountNumber) === norm(accountNumber));
  if (targetAcc && oldIsSell === isSell) {
    const cashDelta = isSell
      ? round2(totalAmount - oldTotalAmount)
      : round2(oldTotalAmount - totalAmount);
    if (cashDelta !== 0) {
      await db
        .update(accountsTable)
        .set({ cashAvailable: round2(targetAcc.cashAvailable + cashDelta) })
        .where(eq(accountsTable.id, targetAcc.id));
    }
  }

  // 3. Reconcile portfolio holding quantity, investAmount, and purchasePrice (Avg Price)
  if (oldIsSell === isSell) {
    if (existingHolding) {
      const priorInvest =
        existingHolding.investAmount > 0
          ? existingHolding.investAmount
          : round2(existingHolding.quantity * existingHolding.purchasePrice);
      let newQty = existingHolding.quantity;
      let newInvest = priorInvest;

      if (isSell) {
        // Delta sold quantity: positive if sold MORE, negative if sold FEWER
        const deltaSoldQty = round2(quantity - oldQty);
        newQty = Math.max(0, round2(existingHolding.quantity - deltaSoldQty));

        // Delta sold cost basis: positive if more cost deducted from holding, negative if less
        const oldSoldCost = round2(oldQty * oldBasePrice);
        const newSoldCost = round2(quantity * basePrice);
        const deltaSoldCost = round2(newSoldCost - oldSoldCost);
        newInvest = Math.max(0, round2(priorInvest - deltaSoldCost));
      } else {
        // BUY: delta quantity and delta invest
        const deltaQty = round2(quantity - oldQty);
        newQty = Math.max(0, round2(existingHolding.quantity + deltaQty));
        const deltaInvest = round2(totalAmount - oldTotalAmount);
        newInvest = Math.max(0, round2(priorInvest + deltaInvest));
      }

      if (newQty <= 0) {
        await db.delete(holdingsTable).where(eq(holdingsTable.id, existingHolding.id));
      } else {
        const newAvgPurchasePrice = round2(newInvest / newQty);
        const curMarketPrice = existingHolding.currentPrice || currentPrice;
        const newOverall = round2(newQty * curMarketPrice);
        const newPL = round2(newOverall - newInvest);
        const newPLPct = newInvest > 0 ? round2((newPL / newInvest) * 100) : 0;
        await db
          .update(holdingsTable)
          .set({
            quantity: newQty,
            purchasePrice: newAvgPurchasePrice,
            investAmount: newInvest,
            overallCurrentPrice: newOverall,
            profitLossAmt: newPL,
            gainLossPercent: newPLPct,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(holdingsTable.id, existingHolding.id));
      }
    } else {
      // If holding did not exist previously and positive quantity remains from BUY
      if (!isSell && quantity > 0) {
        const newOverall = round2(quantity * currentPrice);
        const newPL = round2(newOverall - totalAmount);
        const newPLPct = totalAmount > 0 ? round2((newPL / totalAmount) * 100) : 0;
        await db.insert(holdingsTable).values({
          accountNumber,
          symbol,
          quantity,
          purchasePrice: pricePerShare,
          investAmount: totalAmount,
          currentPrice,
          overallCurrentPrice: newOverall,
          comments: "",
          highlight: "",
          profitLossAmt: newPL,
          gainLossPercent: newPLPct,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  return getPortfolioState();
}
export async function saveHolding(data: {
  id?: number;
  accountNumber: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  comments?: string;
}) {
  await ensureDbSeeded();
  const symbol = data.symbol.trim().toUpperCase();
  const quantity = Number(data.quantity) || 0;
  const purchasePrice = Number(data.purchasePrice) || 0;
  const quote = await fetchSymbolQuote(symbol);
  const currentPrice = data.currentPrice !== undefined && Number(data.currentPrice) > 0 ? Number(data.currentPrice) : quote.price;
  const investAmount = round2(quantity * purchasePrice);
  const overallCurrentPrice = round2(quantity * currentPrice);
  const profitLossAmt = round2(overallCurrentPrice - investAmount);
  const gainLossPercent = investAmount > 0 ? round2((profitLossAmt / investAmount) * 100) : 0;

  if (data.id) {
    await db
      .update(holdingsTable)
      .set({
        accountNumber: data.accountNumber,
        symbol,
        quantity,
        purchasePrice,
        currentPrice,
        investAmount,
        overallCurrentPrice,
        profitLossAmt,
        gainLossPercent,
        comments: data.comments || "",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(holdingsTable.id, Number(data.id)));
  } else {
    await db.insert(holdingsTable).values({
      accountNumber: data.accountNumber,
      symbol,
      quantity,
      purchasePrice,
      currentPrice,
      investAmount,
      overallCurrentPrice,
      profitLossAmt,
      gainLossPercent,
      comments: data.comments || "",
      highlight: "",
      updatedAt: new Date().toISOString(),
    });
  }

  return getPortfolioState();
}

export async function saveAccount(data: {
  id?: number;
  accountNumber: string;
  accountName?: string;
  cashAvailable?: number;
  comments?: string;
}) {
  await ensureDbSeeded();
  const accountNumber = data.accountNumber.trim();
  const accountName = (data.accountName || accountNumber).trim();
  const cashAvailable = round2(Number(data.cashAvailable) || 0);
  const comments = data.comments || "";

  if (data.id) {
    await db
      .update(accountsTable)
      .set({
        accountNumber,
        accountName,
        cashAvailable,
        comments,
      })
      .where(eq(accountsTable.id, Number(data.id)));
  } else {
    const existing = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.accountNumber, accountNumber));
    if (existing[0]) {
      await db
        .update(accountsTable)
        .set({ accountName, cashAvailable, comments })
        .where(eq(accountsTable.id, existing[0].id));
    } else {
      const all = await db.select().from(accountsTable);
      await db.insert(accountsTable).values({
        sNo: all.length + 1,
        accountNumber,
        accountName,
        cashAvailable,
        comments,
      });
    }
  }

  return getPortfolioState();
}

export async function importExcelWorkbookData(data: {
  accounts: Array<{ accountNumber: string; accountName?: string; cashAvailable?: number; comments?: string }>;
  holdings: Array<{
    accountNumber: string;
    symbol: string;
    quantity: number;
    purchasePrice: number;
    currentPrice?: number;
    comments?: string;
    updatedAt?: string;
  }>;
  transactions: Array<{
    accountNumber: string;
    dateTime?: string;
    action: string;
    symbol: string;
    quantity: number;
    pricePerShare: number;
    currentPrice?: number;
    costBasisPerShare?: number;
    comments?: string;
    status?: string;
    remainingQuantity?: number;
  }>;
  weeklyHistory?: Array<{
    accountNumber: string;
    snapshotWeek: string;
    investmentCurrentValue: number;
    gainLossAmount: number;
    gainLossPercent: number;
    capturedAt?: string;
    source?: string;
  }>;
  transactionHistory?: Array<{
    accountNumber: string;
    snapshotWeek: string;
    buyValue: number;
    sellValue: number;
    netCashFlow: number;
    realizedGainLoss: number;
    buyCount: number;
    sellCount: number;
    capturedAt?: string;
    source?: string;
  }>;
}) {
  await ensureDbSeeded();

  await db.delete(accountsTable);
  await db.delete(holdingsTable);
  await db.delete(futureInvestmentsTable);

  let accCount = 0;
  for (const [idx, acc] of (data.accounts || []).entries()) {
    await db.insert(accountsTable).values({
      sNo: idx + 1,
      accountNumber: acc.accountNumber,
      accountName: acc.accountName || acc.accountNumber,
      cashAvailable: round2(Number(acc.cashAvailable) || 0),
      comments: acc.comments || "",
    });
    accCount++;
  }

  let holdCount = 0;
  for (const h of data.holdings || []) {
    const qty = Number(h.quantity) || 0;
    const pp = Number(h.purchasePrice) || 0;
    const cp = Number(h.currentPrice) || pp;
    const inv = round2(qty * pp);
    const cur = round2(qty * cp);
    const pl = round2(cur - inv);
    const plPct = inv > 0 ? round2((pl / inv) * 100) : 0;
    await db.insert(holdingsTable).values({
      accountNumber: h.accountNumber,
      symbol: h.symbol.toUpperCase(),
      quantity: qty,
      purchasePrice: pp,
      investAmount: inv,
      currentPrice: cp,
      overallCurrentPrice: cur,
      comments: h.comments || "",
      highlight: "",
      profitLossAmt: pl,
      gainLossPercent: plPct,
      updatedAt: h.updatedAt || new Date().toISOString(),
    });
    holdCount++;
  }

  let txCount = 0;
  for (const tx of data.transactions || []) {
    const isSell = String(tx.action).toUpperCase() === "SELL";
    const qty = Number(tx.quantity) || 0;
    const pps = Number(tx.pricePerShare) || 0;
    const cp = Number(tx.currentPrice) || pps;
    const rawCb = round2(Number((tx as { averageCost?: number }).averageCost || tx.costBasisPerShare) || pps);
    const sellAvgCost = isSell ? rawCb : 0;
    const basePrice = isSell ? sellAvgCost || pps : pps;
    const total = round2(qty * pps);
    const diffPerShare = isSell ? pps - basePrice : cp - pps;
    const diffAmt = round2(diffPerShare * qty);
    const diffPct = basePrice > 0 ? round2((diffPerShare / basePrice) * 100) : 0;
    await db.insert(futureInvestmentsTable).values({
      accountNumber: tx.accountNumber,
      dateTime: tx.dateTime || new Date().toISOString(),
      action: tx.action,
      symbol: tx.symbol.toUpperCase(),
      quantity: qty,
      pricePerShare: pps,
      totalAmount: total,
      currentPrice: cp,
      averageCost: sellAvgCost,
      costBasisPerShare: basePrice,
      differenceAmount: diffAmt,
      differencePercent: diffPct,
      comments: tx.comments || "",
      status: tx.status || "EXECUTED",
      remainingQuantity: tx.remainingQuantity ?? (tx.action === "BUY" ? qty : 0),
      sourceTransactionId: null,
    });
    txCount++;
  }

  let whCount = 0;
  if (data.weeklyHistory && data.weeklyHistory.length > 0) {
    await db.delete(weeklyHistoryTable);
    for (const wh of data.weeklyHistory) {
      await db.insert(weeklyHistoryTable).values({
        accountNumber: wh.accountNumber,
        snapshotWeek: wh.snapshotWeek,
        investmentCurrentValue: round2(wh.investmentCurrentValue),
        gainLossAmount: round2(wh.gainLossAmount),
        gainLossPercent: round2(wh.gainLossPercent),
        capturedAt: wh.capturedAt || new Date().toISOString(),
        source: wh.source || "IMPORTED_EXCEL",
      });
      whCount++;
    }
  }

  let thCount = 0;
  if (data.transactionHistory && data.transactionHistory.length > 0) {
    await db.delete(transactionHistoryTable);
    for (const th of data.transactionHistory) {
      await db.insert(transactionHistoryTable).values({
        accountNumber: th.accountNumber,
        snapshotWeek: th.snapshotWeek,
        buyValue: round2(th.buyValue),
        sellValue: round2(th.sellValue),
        netCashFlow: round2(th.netCashFlow),
        realizedGainLoss: round2(th.realizedGainLoss),
        buyCount: Number(th.buyCount) || 0,
        sellCount: Number(th.sellCount) || 0,
        capturedAt: th.capturedAt || new Date().toISOString(),
        source: th.source || "IMPORTED_EXCEL",
      });
      thCount++;
    }
  }

  const portfolio = await getPortfolioState();
  return {
    portfolio,
    result: {
      accounts: accCount,
      holdings: holdCount,
      transactions: txCount,
      weeklyHistory: whCount,
      transactionHistory: thCount,
    },
  };
}

export async function searchMarketSymbols(queryRaw: string) {
  const q = queryRaw.trim().toUpperCase();
  if (!q) return [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.quotes) && data.quotes.length > 0) {
        return data.quotes
          .filter((item: { symbol?: string }) => Boolean(item.symbol))
          .slice(0, 8)
          .map((item: { symbol: string; shortname?: string; longname?: string; exchDisp?: string; exchange?: string; quoteType?: string }) => ({
            symbol: item.symbol,
            name: item.shortname || item.longname || item.symbol,
            exchange: item.exchDisp || item.exchange || "NASDAQ",
            quoteType: item.quoteType || "EQUITY",
          }));
      }
    }
  } catch {
    // Fallback to local dictionary
  }

  const localList = Object.entries(DEFAULT_QUOTES).map(([symbol, info]) => ({
    symbol,
    name: info.name,
    exchange: info.exchange,
    quoteType: info.quoteType,
  }));
  const matches = localList.filter(
    (item) => item.symbol.includes(q) || item.name.toUpperCase().includes(q)
  );
  if (matches.length > 0) return matches.slice(0, 8);
  return [
    {
      symbol: q,
      name: `${q} Corp.`,
      exchange: "NASDAQ",
      quoteType: "EQUITY",
    },
  ];
}

export async function getAccountDetailsData() {
  await ensureDbSeeded();

  const accDetailsRows = await db
    .select()
    .from(accountDetailsTable)
    .orderBy(asc(accountDetailsTable.orderIndex), asc(accountDetailsTable.id));

  const depositRows = await db
    .select()
    .from(depositDetailsTable)
    .orderBy(asc(depositDetailsTable.orderIndex), asc(depositDetailsTable.id));

  // Compute running cumulative sums per account
  const depositsByAccount: Record<
    string,
    Array<{
      id: number;
      accountNumber: string;
      dateInvested: string;
      amount: number;
      cumulativeAmt: number;
      comments: string;
      orderIndex: number;
      isFinalForAccount?: boolean;
    }>
  > = {};

  const finalCumulativeByAccount: Record<string, number> = {};

  for (const acc of accDetailsRows) {
    const accDeps = depositRows.filter(
      (d) => d.accountNumber.trim().toUpperCase() === acc.accountNumber.trim().toUpperCase()
    );
    let running = 0;
    const computed = accDeps.map((d, idx) => {
      running = round2(running + d.amount);
      const isFinal = idx === accDeps.length - 1;
      return {
        id: d.id,
        accountNumber: d.accountNumber,
        dateInvested: d.dateInvested,
        amount: round2(d.amount),
        cumulativeAmt: running,
        comments: d.comments || "",
        orderIndex: d.orderIndex,
        isFinalForAccount: isFinal,
      };
    });
    depositsByAccount[acc.accountNumber] = computed;
    finalCumulativeByAccount[acc.accountNumber] = running;
  }

  // Map accountDetails with dynamically linked amountFromHand
  const accountDetails = accDetailsRows.map((acc) => {
    const finalCumulative = finalCumulativeByAccount[acc.accountNumber] ?? 0;
    return {
      id: acc.id,
      financialInstitute: acc.financialInstitute,
      activeStatus: acc.activeStatus,
      accountType: acc.accountType,
      accountNumber: acc.accountNumber,
      startDate: acc.startDate,
      comments: acc.comments || "",
      taxPeriod: acc.taxPeriod,
      orderIndex: acc.orderIndex,
      amountFromHand: finalCumulative, // Dynamically linked!
    };
  });

  const totalAmountFromHand = round2(
    accountDetails.reduce((sum, item) => sum + item.amountFromHand, 0)
  );

  return {
    accountDetails,
    depositsByAccount,
    totalAmountFromHand,
  };
}

export async function addDeposit(data: {
  accountNumber: string;
  dateInvested: string;
  amount: number;
  comments?: string;
}) {
  await ensureDbSeeded();
  const allDeps = await db.select().from(depositDetailsTable);
  await db.insert(depositDetailsTable).values({
    accountNumber: data.accountNumber.trim(),
    dateInvested: data.dateInvested.trim(),
    amount: round2(Number(data.amount) || 0),
    comments: data.comments?.trim() || "",
    orderIndex: allDeps.length + 1,
  });
  return getAccountDetailsData();
}

export async function editDeposit(data: {
  id: number;
  accountNumber?: string;
  dateInvested?: string;
  amount?: number;
  comments?: string;
}) {
  await ensureDbSeeded();
  const updateData: Partial<{
    accountNumber: string;
    dateInvested: string;
    amount: number;
    comments: string;
  }> = {};
  if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber.trim();
  if (data.dateInvested !== undefined) updateData.dateInvested = data.dateInvested.trim();
  if (data.amount !== undefined) updateData.amount = round2(Number(data.amount) || 0);
  if (data.comments !== undefined) updateData.comments = data.comments.trim();

  await db
    .update(depositDetailsTable)
    .set(updateData)
    .where(eq(depositDetailsTable.id, Number(data.id)));

  return getAccountDetailsData();
}

export async function deleteDeposit(id: number) {
  await ensureDbSeeded();
  await db.delete(depositDetailsTable).where(eq(depositDetailsTable.id, Number(id)));
  return getAccountDetailsData();
}

export async function editAccountDetail(data: {
  id: number;
  financialInstitute?: string;
  activeStatus?: string;
  accountType?: string;
  accountNumber?: string;
  startDate?: string;
  comments?: string;
  taxPeriod?: string;
}) {
  await ensureDbSeeded();
  const updateData: Partial<{
    financialInstitute: string;
    activeStatus: string;
    accountType: string;
    accountNumber: string;
    startDate: string;
    comments: string;
    taxPeriod: string;
  }> = {};
  if (data.financialInstitute !== undefined) updateData.financialInstitute = data.financialInstitute.trim();
  if (data.activeStatus !== undefined) updateData.activeStatus = data.activeStatus.trim();
  if (data.accountType !== undefined) updateData.accountType = data.accountType.trim();
  if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber.trim();
  if (data.startDate !== undefined) updateData.startDate = data.startDate.trim();
  if (data.comments !== undefined) updateData.comments = data.comments.trim();
  if (data.taxPeriod !== undefined) updateData.taxPeriod = data.taxPeriod.trim();

  await db
    .update(accountDetailsTable)
    .set(updateData)
    .where(eq(accountDetailsTable.id, Number(data.id)));

  return getAccountDetailsData();
}

export async function addAccountDetail(data: {
  financialInstitute?: string;
  activeStatus?: string;
  accountType?: string;
  accountNumber: string;
  startDate?: string;
  comments?: string;
  taxPeriod?: string;
}) {
  await ensureDbSeeded();
  const allAccs = await db.select().from(accountDetailsTable);
  await db.insert(accountDetailsTable).values({
    financialInstitute: data.financialInstitute?.trim() || "CS",
    activeStatus: data.activeStatus?.trim() || "Active",
    accountType: data.accountType?.trim() || "Trading Account",
    accountNumber: data.accountNumber.trim(),
    startDate: data.startDate?.trim() || "",
    comments: data.comments?.trim() || "",
    taxPeriod: data.taxPeriod?.trim() || "Yearly Tax on Profit in US.",
    orderIndex: allAccs.length + 1,
  });
  return getAccountDetailsData();
}
