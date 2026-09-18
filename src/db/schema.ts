import {
  pgTable,
  serial,
  text,
  doublePrecision,
  integer,
} from "drizzle-orm/pg-core";

export const accountsTable = pgTable("portfolio_accounts", {
  id: serial("id").primaryKey(),
  sNo: integer("s_no").notNull().default(1),
  accountNumber: text("account_number").notNull(),
  accountName: text("account_name").notNull(),
  cashAvailable: doublePrecision("cash_available").notNull().default(0),
  comments: text("comments").notNull().default(""),
});

export const holdingsTable = pgTable("portfolio_holdings", {
  id: serial("id").primaryKey(),
  accountNumber: text("account_number").notNull(),
  symbol: text("symbol").notNull(),
  quantity: doublePrecision("quantity").notNull().default(0),
  purchasePrice: doublePrecision("purchase_price").notNull().default(0),
  investAmount: doublePrecision("invest_amount").notNull().default(0),
  currentPrice: doublePrecision("current_price").notNull().default(0),
  overallCurrentPrice: doublePrecision("overall_current_price").notNull().default(0),
  comments: text("comments").notNull().default(""),
  highlight: text("highlight").notNull().default(""),
  profitLossAmt: doublePrecision("profit_loss_amt").notNull().default(0),
  gainLossPercent: doublePrecision("gain_loss_percent").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const futureInvestmentsTable = pgTable("portfolio_future_investments", {
  id: serial("id").primaryKey(),
  accountNumber: text("account_number").notNull(),
  dateTime: text("date_time").notNull(),
  action: text("action").notNull(),
  symbol: text("symbol").notNull(),
  quantity: doublePrecision("quantity").notNull().default(0),
  pricePerShare: doublePrecision("price_per_share").notNull().default(0),
  totalAmount: doublePrecision("total_amount").notNull().default(0),
  currentPrice: doublePrecision("current_price").notNull().default(0),
  averageCost: doublePrecision("average_cost").notNull().default(0),
  costBasisPerShare: doublePrecision("cost_basis_per_share").notNull().default(0),
  differenceAmount: doublePrecision("difference_amount").notNull().default(0),
  differencePercent: doublePrecision("difference_percent").notNull().default(0),
  comments: text("comments").notNull().default(""),
  status: text("status").notNull().default("EXECUTED"),
  remainingQuantity: doublePrecision("remaining_quantity").notNull().default(0),
  sourceTransactionId: integer("source_transaction_id"),
});

export const watchlistTable = pgTable("portfolio_watchlist", {
  symbol: text("symbol").primaryKey(),
  name: text("name").notNull(),
  exchange: text("exchange").notNull().default("NASDAQ"),
  quoteType: text("quote_type").notNull().default("Equity"),
  createdAt: text("created_at").notNull(),
});

export const weeklyHistoryTable = pgTable("portfolio_weekly_history", {
  id: serial("id").primaryKey(),
  accountNumber: text("account_number").notNull(),
  snapshotWeek: text("snapshot_week").notNull(),
  investmentCurrentValue: doublePrecision("investment_current_value").notNull().default(0),
  gainLossAmount: doublePrecision("gain_loss_amount").notNull().default(0),
  gainLossPercent: doublePrecision("gain_loss_percent").notNull().default(0),
  capturedAt: text("captured_at").notNull(),
  source: text("source").notNull().default("SATURDAY_9PM_ET"),
});

export const transactionHistoryTable = pgTable("portfolio_transaction_history", {
  id: serial("id").primaryKey(),
  accountNumber: text("account_number").notNull(),
  snapshotWeek: text("snapshot_week").notNull(),
  buyValue: doublePrecision("buy_value").notNull().default(0),
  sellValue: doublePrecision("sell_value").notNull().default(0),
  netCashFlow: doublePrecision("net_cash_flow").notNull().default(0),
  realizedGainLoss: doublePrecision("realized_gain_loss").notNull().default(0),
  buyCount: integer("buy_count").notNull().default(0),
  sellCount: integer("sell_count").notNull().default(0),
  capturedAt: text("captured_at").notNull(),
  source: text("source").notNull().default("SATURDAY_9PM_ET"),
});

export const marketCacheTable = pgTable("market_cache", {
  symbol: text("symbol").primaryKey(),
  price: doublePrecision("price").notNull().default(0),
  previousClose: doublePrecision("previous_close").notNull().default(0),
  changeAmount: doublePrecision("change_amount").notNull().default(0),
  changePercent: doublePrecision("change_percent").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  lastUpdated: text("last_updated").notNull(),
});

export const accountDetailsTable = pgTable("portfolio_account_details", {
  id: serial("id").primaryKey(),
  financialInstitute: text("financial_institute").notNull().default("CS"),
  activeStatus: text("active_status").notNull().default("Active"),
  accountType: text("account_type").notNull().default("Trading Account"),
  accountNumber: text("account_number").notNull().unique("portfolio_account_details_account_number_key"),
  startDate: text("start_date").notNull().default(""),
  comments: text("comments").notNull().default(""),
  taxPeriod: text("tax_period").notNull().default("Yearly Tax on Profit in US."),
  orderIndex: integer("order_index").notNull().default(0),
});

export const depositDetailsTable = pgTable("portfolio_deposit_details", {
  id: serial("id").primaryKey(),
  accountNumber: text("account_number").notNull(),
  dateInvested: text("date_invested").notNull(),
  amount: doublePrecision("amount").notNull().default(0),
  comments: text("comments").notNull().default(""),
  orderIndex: integer("order_index").notNull().default(0),
});

// Named export aliases for compatibility across all modules & routes
export const accounts = accountsTable;
export const masterAccounts = accountsTable;
export const holdings = holdingsTable;
export const currentHoldings = holdingsTable;
export const consolidationInventory = holdingsTable;
export const futureInvestments = futureInvestmentsTable;
export const dailyTransactions = futureInvestmentsTable;
export const watchlist = watchlistTable;
export const marketWatchlist = watchlistTable;
export const weeklyHistory = weeklyHistoryTable;
export const weeklyAccountHistory = weeklyHistoryTable;
export const transactionHistory = transactionHistoryTable;
export const weeklyTransactionHistory = transactionHistoryTable;
export const marketCache = marketCacheTable;
export const accountDetails = accountDetailsTable;
export const depositDetails = depositDetailsTable;
