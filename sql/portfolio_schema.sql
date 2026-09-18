-- ============================================================================
-- PORTFOLIO TRACKER - COMPLETE POSTGRESQL SCHEMA, INDEXES & DEFAULT VALUES
-- File: portfolio_schema.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ACCOUNTS SUMMARY TABLES (portfolio_accounts & accounts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolio_accounts (
  id SERIAL PRIMARY KEY,
  s_no INTEGER NOT NULL DEFAULT 1,
  account_number TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL DEFAULT '',
  cash_available DOUBLE PRECISION NOT NULL DEFAULT 0,
  comments TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  s_no INTEGER NOT NULL DEFAULT 1,
  account_number TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL DEFAULT '',
  cash_available DOUBLE PRECISION NOT NULL DEFAULT 0,
  comments TEXT NOT NULL DEFAULT ''
);

-- ============================================================================
-- 2. CONSOLIDATED VIEW - ACCOUNT LEVEL HOLDINGS (portfolio_holdings & current_holdings)
-- ============================================================================
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
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

CREATE TABLE IF NOT EXISTS current_holdings (
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
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

-- ============================================================================
-- 3. DAILY TRANSACTIONS TABLES (portfolio_future_investments & future_investments)
--    Includes average_cost (populated only for SELL orders; 0 for BUY orders)
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolio_future_investments (
  id SERIAL PRIMARY KEY,
  account_number TEXT NOT NULL,
  date_time TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT,
  action TEXT NOT NULL DEFAULT 'BUY' CHECK (UPPER(action) IN ('BUY', 'SELL')),
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
  source_transaction_id INTEGER DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS future_investments (
  id SERIAL PRIMARY KEY,
  account_number TEXT NOT NULL,
  date_time TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT,
  action TEXT NOT NULL DEFAULT 'BUY' CHECK (UPPER(action) IN ('BUY', 'SELL')),
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
  source_transaction_id INTEGER DEFAULT NULL
);

-- Safe column migrations if tables already existed prior to average_cost
ALTER TABLE portfolio_future_investments
  ADD COLUMN IF NOT EXISTS average_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost_basis_per_share DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remaining_quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source_transaction_id INTEGER DEFAULT NULL;

ALTER TABLE future_investments
  ADD COLUMN IF NOT EXISTS average_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost_basis_per_share DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remaining_quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source_transaction_id INTEGER DEFAULT NULL;

-- ============================================================================
-- 4. MARKET WATCHLIST & MARKET CACHE TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolio_watchlist (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  exchange TEXT NOT NULL DEFAULT 'NASDAQ',
  quote_type TEXT NOT NULL DEFAULT 'Equity',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

CREATE TABLE IF NOT EXISTS watchlist (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  exchange TEXT NOT NULL DEFAULT 'NASDAQ',
  quote_type TEXT NOT NULL DEFAULT 'Equity',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

CREATE TABLE IF NOT EXISTS market_cache (
  symbol TEXT PRIMARY KEY,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  previous_close DOUBLE PRECISION NOT NULL DEFAULT 0,
  change_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  change_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  last_updated TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

-- ============================================================================
-- 5. WEEKLY ACCOUNT HISTORY TABLES (portfolio_weekly_history & weekly_account_history)
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolio_weekly_history (
  id SERIAL PRIMARY KEY,
  account_number TEXT NOT NULL,
  snapshot_week TEXT NOT NULL,
  investment_current_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  gain_loss_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gain_loss_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  captured_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT,
  source TEXT NOT NULL DEFAULT 'SATURDAY_9PM_ET'
);

CREATE TABLE IF NOT EXISTS weekly_account_history (
  id SERIAL PRIMARY KEY,
  account_number TEXT NOT NULL,
  snapshot_week TEXT NOT NULL,
  investment_current_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  gain_loss_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gain_loss_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  captured_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT,
  source TEXT NOT NULL DEFAULT 'SATURDAY_9PM_ET'
);

-- ============================================================================
-- 6. WEEKLY TRANSACTION HISTORY TABLES
--    (portfolio_transaction_history & weekly_transaction_history)
-- ============================================================================
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
  captured_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT,
  source TEXT NOT NULL DEFAULT 'SATURDAY_9PM_ET'
);

CREATE TABLE IF NOT EXISTS weekly_transaction_history (
  id SERIAL PRIMARY KEY,
  account_number TEXT NOT NULL,
  snapshot_week TEXT NOT NULL,
  buy_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  sell_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  net_cash_flow DOUBLE PRECISION NOT NULL DEFAULT 0,
  realized_gain_loss DOUBLE PRECISION NOT NULL DEFAULT 0,
  buy_count INTEGER NOT NULL DEFAULT 0,
  sell_count INTEGER NOT NULL DEFAULT 0,
  captured_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT,
  source TEXT NOT NULL DEFAULT 'SATURDAY_9PM_ET'
);

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_portfolio_accounts_acc_num ON portfolio_accounts (account_number);
CREATE INDEX IF NOT EXISTS idx_accounts_acc_num ON accounts (account_number);

CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_account ON portfolio_holdings (account_number);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_symbol ON portfolio_holdings (symbol);
CREATE INDEX IF NOT EXISTS idx_current_holdings_account ON current_holdings (account_number);
CREATE INDEX IF NOT EXISTS idx_current_holdings_symbol ON current_holdings (symbol);

CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_account ON portfolio_future_investments (account_number);
CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_symbol ON portfolio_future_investments (symbol);
CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_action ON portfolio_future_investments (action);
CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_datetime ON portfolio_future_investments (date_time DESC);
CREATE INDEX IF NOT EXISTS idx_future_inv_account ON future_investments (account_number);
CREATE INDEX IF NOT EXISTS idx_future_inv_symbol ON future_investments (symbol);

CREATE INDEX IF NOT EXISTS idx_portfolio_weekly_hist_week ON portfolio_weekly_history (snapshot_week DESC, account_number ASC);
CREATE INDEX IF NOT EXISTS idx_weekly_account_hist_week ON weekly_account_history (snapshot_week DESC, account_number ASC);

CREATE INDEX IF NOT EXISTS idx_portfolio_tx_hist_week ON portfolio_transaction_history (snapshot_week DESC, account_number ASC);
CREATE INDEX IF NOT EXISTS idx_weekly_tx_hist_week ON weekly_transaction_history (snapshot_week DESC, account_number ASC);

-- ============================================================================
-- 8. DEFAULT VALUES & SEED DATA
-- ============================================================================

-- Default Watchlist Symbols
INSERT INTO portfolio_watchlist (symbol, name, exchange, quote_type, created_at) VALUES
  ('AAPL', 'Apple Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('GOOG', 'Alphabet Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('MSFT', 'Microsoft Corporation', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('NFLX', 'Netflix, Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('NVDA', 'NVIDIA Corporation', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('SOXL', 'Direxion Daily Semiconductor Bull 3X Shares', 'NYSEArca', 'ETF', '2026-09-16T05:46:05.050Z'),
  ('TSLA', 'Tesla, Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('AMZN', 'Amazon.com, Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('META', 'Meta Platforms, Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z')
ON CONFLICT (symbol) DO NOTHING;

INSERT INTO watchlist (symbol, name, exchange, quote_type, created_at)
SELECT symbol, name, exchange, quote_type, created_at FROM portfolio_watchlist
ON CONFLICT (symbol) DO NOTHING;

-- Default Market Cache Quotes
INSERT INTO market_cache (symbol, price, previous_close, change_amount, change_percent, currency, last_updated) VALUES
  ('AAPL', 337.00, 332.41, 4.59, 1.38, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('GOOG', 185.00, 182.60, 2.40, 1.31, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('MSFT', 448.50, 444.20, 4.30, 0.97, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('NFLX', 712.80, 705.00, 7.80, 1.11, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('NVDA', 136.20, 133.50, 2.70, 2.02, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('SOXL', 114.82, 111.90, 2.92, 2.61, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('GGLL', 102.50, 100.80, 1.70, 1.69, 'USD', CURRENT_TIMESTAMP::TEXT)
ON CONFLICT (symbol) DO NOTHING;

-- Ensure average_cost is strictly set for SELL rows (0 for BUY rows) and SELL gain/loss includes average_cost
UPDATE portfolio_future_investments
  SET average_cost = CASE
        WHEN UPPER(action) = 'SELL' THEN COALESCE(NULLIF(average_cost, 0), NULLIF(cost_basis_per_share, 0), price_per_share)
        ELSE 0
      END,
      difference_amount = CASE
        WHEN UPPER(action) = 'SELL' THEN ROUND(((price_per_share - COALESCE(NULLIF(average_cost, 0), NULLIF(cost_basis_per_share, 0), price_per_share)) * quantity)::NUMERIC, 2)::DOUBLE PRECISION
        ELSE ROUND(((current_price - price_per_share) * quantity)::NUMERIC, 2)::DOUBLE PRECISION
      END,
      difference_percent = CASE
        WHEN UPPER(action) = 'SELL' AND COALESCE(NULLIF(average_cost, 0), NULLIF(cost_basis_per_share, 0), price_per_share) > 0
          THEN ROUND((((price_per_share - COALESCE(NULLIF(average_cost, 0), NULLIF(cost_basis_per_share, 0), price_per_share)) / COALESCE(NULLIF(average_cost, 0), NULLIF(cost_basis_per_share, 0), price_per_share)) * 100)::NUMERIC, 2)::DOUBLE PRECISION
        WHEN price_per_share > 0
          THEN ROUND((((current_price - price_per_share) / price_per_share) * 100)::NUMERIC, 2)::DOUBLE PRECISION
        ELSE 0
      END;

COMMIT;
