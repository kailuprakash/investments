-- ============================================================================
-- Investment Portfolio Tracker: PostgreSQL DDL and bootstrap DML
-- ============================================================================
-- Source of truth: src/db/schema.ts, src/db/portfolio-service.ts, and
-- src/db/seed-data.json. This file is intentionally self-contained so it can
-- be run manually with:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f src/db/schema.sql
--
-- The default execution is NON-DESTRUCTIVE: creates missing tables/indexes and
-- inserts only missing starter rows. Existing user data is not overwritten.
--
-- For a clean local rebuild, uncomment the reset block immediately below, then
-- execute this file. The reset permanently deletes every portfolio record.
-- ============================================================================

-- OPTIONAL DESTRUCTIVE RESET (uncomment only when you want a blank database)
-- DROP TABLE IF EXISTS market_cache CASCADE;
-- DROP TABLE IF EXISTS portfolio_settings CASCADE;
-- DROP TABLE IF EXISTS portfolio_deposit_details CASCADE;
-- DROP TABLE IF EXISTS portfolio_account_details CASCADE;
-- DROP TABLE IF EXISTS portfolio_transaction_history CASCADE;
-- DROP TABLE IF EXISTS portfolio_weekly_history CASCADE;
-- DROP TABLE IF EXISTS portfolio_watchlist CASCADE;
-- DROP TABLE IF EXISTS portfolio_future_investments CASCADE;
-- DROP TABLE IF EXISTS portfolio_holdings CASCADE;
-- DROP TABLE IF EXISTS portfolio_accounts CASCADE;

BEGIN;

-- ---------------------------------------------------------------------------
-- DDL: Application tables (intentionally no foreign keys; matches Drizzle
-- schema and supports imports/migrations with independently saved sheets).
-- ---------------------------------------------------------------------------
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

CREATE TABLE IF NOT EXISTS market_cache (
  symbol TEXT PRIMARY KEY,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  previous_close DOUBLE PRECISION NOT NULL DEFAULT 0,
  change_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  change_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  last_updated TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'cached',
  error TEXT NOT NULL DEFAULT '',
  last_live_at TEXT NOT NULL DEFAULT ''
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

CREATE TABLE IF NOT EXISTS portfolio_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT ''
);

-- DDL: indexes/compatibility columns used by weekly snapshots and quote cache.
CREATE UNIQUE INDEX IF NOT EXISTS uq_weekly_history_account_week
  ON portfolio_weekly_history (account_number, snapshot_week);
CREATE UNIQUE INDEX IF NOT EXISTS uq_transaction_history_account_week
  ON portfolio_transaction_history (account_number, snapshot_week);
ALTER TABLE market_cache ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'cached';
ALTER TABLE market_cache ADD COLUMN IF NOT EXISTS error TEXT NOT NULL DEFAULT '';
ALTER TABLE market_cache ADD COLUMN IF NOT EXISTS last_live_at TEXT NOT NULL DEFAULT '';

-- ---------------------------------------------------------------------------
-- DML: Default setting and complete application starter dataset.
-- Every insert is idempotent; re-running this script will not overwrite data.
-- ---------------------------------------------------------------------------
INSERT INTO portfolio_settings (key, value, updated_at)
VALUES ('auto_refresh_interval', '300', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
ON CONFLICT (key) DO NOTHING;


INSERT INTO portfolio_accounts (s_no, account_number, account_name, cash_available, comments)
SELECT s_no, account_number, account_name, cash_available, comments
FROM (VALUES
  (1, 'CS 9271', 'CS 9271', 64205.8, ''),
  (2, 'CS 9538', 'CS 9538', 34572.59, 'Divided by 2.'),
  (3, 'RH 8031', 'RH 8031', 3068.81, ''),
  (4, 'ME-CMA 82K32', 'ME-CMA 82K32', 21643, ''),
  (5, 'ME-IRA 85363', 'ME-IRA 85363', 116729.87, ''),
  (6, 'ME-IRRA 73444', 'ME-IRRA 73444', 70158.31, ''),
  (7, 'ME-Roth 82T11', 'ME-Roth 82T11', 15238.56, '')
) AS seed (s_no, account_number, account_name, cash_available, comments)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio_accounts AS existing
  WHERE existing.account_number = seed.account_number
);

INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at)
SELECT account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at
FROM (VALUES
  ('CS 9271', 'GOOG', 5, 385.14, 1925.7, 343.68, 1718.4, '', '', -207.3, -10.76, '2026-09-17T03:00:46.539Z'),
  ('CS 9538', 'SOXL', 1, 108.11, 108.11, 114.82, 114.82, '', '', 6.71, 6.21, '2026-09-17T03:00:46.576Z'),
  ('CS 9538', 'AAPL', 81, 537.4572, 43534.03, 337, 27297, '', '', -16237.03, -37.3, '2026-09-17T11:28:42.392Z'),
  ('RH 8031', 'SOXL', 4, 0, 0, 114.82, 459.28, '', '', 459.28, 0, '2026-09-17T03:18:00.154Z'),
  ('RH 8031', 'SNDG', 1, 5.31, 5.31, 9.15, 9.15, '', '', 3.84, 72.32, '2026-09-17T03:00:46.551Z'),
  ('RH 8031', 'MSFT', 5, 414.84, 2074.2, 497.75, 2488.75, '', '', 414.55, 19.99, '2026-09-17T03:17:46.434Z'),
  ('RH 8031', 'GGLL', 5, 120, 600, 102.5, 512.5, '', '', -87.5, -14.58, '2026-09-17T03:00:46.601Z'),
  ('ME-Roth 82T11', 'SOXL', 5, 108.1, 540.5, 114.82, 574.1, '', '', 33.6, 6.22, '2026-09-17T03:00:46.563Z')
) AS seed (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio_holdings AS existing
  WHERE existing.account_number = seed.account_number AND existing.symbol = seed.symbol AND existing.purchase_price = seed.purchase_price AND existing.quantity = seed.quantity
);

INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id)
SELECT account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id
FROM (VALUES
  ('RH 8031', '2026-09-16T16:54:30.435Z', 'BUY', 'GGLL', 5, 120, 600, 102.5, 0, 120, -87.50, -14.58, '', 'EXECUTED', 5, NULL::INTEGER),
  ('CS 9538', '2026-09-16T16:33:11.924Z', 'SELL', 'AAPL', 1, 100, 100, 337, 110, 110, -10.00, -9.09, '', 'EXECUTED', 0, NULL::INTEGER),
  ('CS 9538', '2026-09-16T16:29:53.728Z', 'SELL', 'AAPL', 1, 20, 20, 337, 200, 200, -180.00, -90.00, '', 'EXECUTED', 0, NULL::INTEGER),
  ('CS 9538', '2026-09-16T16:22:59.911Z', 'SELL', 'AAPL', 12, 10, 120, 337, 332.36, 332.36, -3868.32, -96.99, '', 'EXECUTED', 0, NULL::INTEGER),
  ('CS 9538', '2026-09-16T16:22:13.164Z', 'SELL', 'AAPL', 5, 300, 1500, 337, 10, 10, 1450.00, 2900.00, '', 'EXECUTED', 0, NULL::INTEGER),
  ('RH 8031', '2026-09-16T16:19:32.754Z', 'SELL', 'MSFT', 5, 400, 2000, 497.75, 493.95, 493.95, -469.75, -19.02, '', 'EXECUTED', 0, NULL::INTEGER),
  ('RH 8031', '2026-09-16T16:13:47.650Z', 'SELL', 'SOXL', 3, 107, 321, 114.82, 108.17, 108.17, -3.51, -1.08, '', 'EXECUTED', 0, NULL::INTEGER),
  ('CS 9538', '2026-09-16T16:06:05.236Z', 'BUY', 'SOXL', 1, 108.11, 108.11, 114.82, 0, 108.11, 6.71, 6.21, '', 'EXECUTED', 1, NULL::INTEGER),
  ('ME-Roth 82T11', '2026-09-16T16:05:53.556Z', 'BUY', 'SOXL', 5, 108.1, 540.5, 114.82, 0, 108.1, 33.60, 6.22, '', 'EXECUTED', 5, NULL::INTEGER),
  ('RH 8031', '2026-09-16T16:05:42.496Z', 'BUY', 'SNDG', 1, 5.31, 5.31, 9.15, 0, 5.31, 3.84, 72.32, '', 'EXECUTED', 1, NULL::INTEGER),
  ('RH 8031', '2026-09-16T16:05:16.471Z', 'BUY', 'SOXL', 2, 108.11, 216.22, 114.82, 0, 108.11, 13.42, 6.21, '', 'EXECUTED', 2, NULL::INTEGER),
  ('RH 8031', '2026-09-16T16:05:06.611Z', 'BUY', 'SOXL', 5, 107.94, 539.7, 114.82, 0, 107.94, 34.40, 6.37, '', 'EXECUTED', 5, NULL::INTEGER)
) AS seed (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio_future_investments AS existing
  WHERE existing.account_number = seed.account_number AND existing.date_time = seed.date_time AND existing.action = seed.action AND existing.symbol = seed.symbol AND existing.quantity = seed.quantity AND existing.price_per_share = seed.price_per_share
);

INSERT INTO portfolio_watchlist (symbol, name, exchange, quote_type, created_at)
VALUES
  ('AAPL', 'Apple Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('GOOG', 'Alphabet Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('MSFT', 'Microsoft Corporation', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('NFLX', 'Netflix, Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('NVDA', 'NVIDIA Corporation', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('SOXL', 'Direxion Daily Semiconductor Bull 3X Shares', 'NYSE Arca', 'ETF', '2026-09-16T05:46:05.050Z'),
  ('SPY', 'SPDR S&P 500 ETF Trust', 'NYSE Arca', 'ETF', '2026-09-16T05:46:05.050Z'),
  ('TSLA', 'Tesla, Inc.', 'NASDAQ', 'Equity', '2026-09-16T05:46:05.050Z'),
  ('AMDL', 'GraniteShares 2x Long AMD Daily', 'NASDAQ', 'ETF', '2026-09-16T14:19:02.428Z')
ON CONFLICT (symbol) DO NOTHING;

INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source)
VALUES
  ('CS 9271', '2026-09-12', 0, 0, 0, '2026-09-16T10:51:19.000Z', 'SATURDAY_9PM_ET'),
  ('CS 9538', '2026-09-12', 0, 0, 0, '2026-09-16T10:53:19.000Z', 'SATURDAY_9PM_ET'),
  ('ME-CMA 82K32', '2026-09-12', 0, 0, 0, '2026-09-16T10:54:19.000Z', 'SATURDAY_9PM_ET'),
  ('ME-IRA 85363', '2026-09-12', 0, 0, 0, '2026-09-16T10:54:19.000Z', 'SATURDAY_9PM_ET'),
  ('ME-IRRA 73444', '2026-09-12', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SATURDAY_9PM_ET'),
  ('ME-Roth 82T11', '2026-09-12', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SATURDAY_9PM_ET'),
  ('RH 8031', '2026-09-12', 0, 0, 0, '2026-09-16T10:53:19.000Z', 'SATURDAY_9PM_ET'),
  ('CS 9271', '2026-09-05', 0, 0, 0, '2026-09-16T10:51:19.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('CS 9538', '2026-09-05', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-CMA 82K32', '2026-09-05', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-IRA 85363', '2026-09-05', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-IRRA 73444', '2026-09-05', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-Roth 82T11', '2026-09-05', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('RH 8031', '2026-09-05', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('CS 9271', '2026-08-29', 0, 0, 0, '2026-09-16T10:51:19.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('CS 9538', '2026-08-29', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-CMA 82K32', '2026-08-29', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-IRA 85363', '2026-08-29', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-IRRA 73444', '2026-08-29', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('ME-Roth 82T11', '2026-08-29', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY'),
  ('RH 8031', '2026-08-29', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY')
ON CONFLICT (account_number, snapshot_week) DO NOTHING;

INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source)
VALUES
  ('CS 9271', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET'),
  ('CS 9538', '2026-09-12', 108.11, 3482.36, 3374.25, 0, 1, 4, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET'),
  ('ME-CMA 82K32', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET'),
  ('ME-IRA 85363', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET'),
  ('ME-IRRA 73444', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET'),
  ('ME-Roth 82T11', '2026-09-12', 540.5, 0, -540.5, 0, 1, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET'),
  ('RH 8031', '2026-09-12', 1361.23, 2794.26, 1433.03, 0, 4, 2, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET'),
  ('CS 9271', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('CS 9538', '2026-09-05', 84.33, 2716.24, 2631.92, 0, 1, 3, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-CMA 82K32', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-IRA 85363', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-IRRA 73444', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-Roth 82T11', '2026-09-05', 421.59, 0, -421.59, 0, 1, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('RH 8031', '2026-09-05', 1061.76, 2179.52, 1117.76, 0, 3, 2, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('CS 9271', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('CS 9538', '2026-08-29', 60.54, 1950.12, 1889.58, 0, 1, 2, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-CMA 82K32', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-IRA 85363', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-IRRA 73444', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('ME-Roth 82T11', '2026-08-29', 302.68, 0, -302.68, 0, 1, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY'),
  ('RH 8031', '2026-08-29', 762.29, 1564.79, 802.5, 0, 2, 1, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY')
ON CONFLICT (account_number, snapshot_week) DO NOTHING;

INSERT INTO market_cache (symbol, price, previous_close, change_amount, change_percent, currency, last_updated, source, error, last_live_at)
VALUES
  ('TSLA', 358.0800, 356.5800, 1.5000, 0.4200, 'USD', '2026-09-17T03:14:25.390Z', 'cached', '', ''),
  ('AMDL', 56.6500, 54.8800, 1.7700, 3.2300, 'USD', '2026-09-17T03:14:25.495Z', 'cached', '', ''),
  ('NVDA', 213.9000, 212.1700, 1.7300, 0.8200, 'USD', '2026-09-17T03:14:26.158Z', 'cached', '', ''),
  ('SPY', 754.0500, 757.3900, -3.3400, -0.4400, 'USD', '2026-09-17T03:14:26.137Z', 'cached', '', ''),
  ('NFLX', 76.4100, 77.9000, -1.4900, -1.9100, 'USD', '2026-09-17T03:14:26.170Z', 'cached', '', ''),
  ('SNDU', 20.6400, 20.6500, -0.0100, -0.0500, 'USD', '2026-09-16T16:05:25.708Z', 'cached', '', ''),
  ('SND', 5.3100, 5.1700, 0.1400, 2.7100, 'USD', '2026-09-16T16:05:36.663Z', 'cached', '', ''),
  ('AA', 47.3300, 46.5200, 0.8100, 1.7400, 'USD', '2026-09-16T16:32:59.571Z', 'cached', '', ''),
  ('GOOG', 343.6800, 339.3600, 4.3200, 1.2700, 'USD', '2026-09-17T20:45:52.955Z', 'cached', '', ''),
  ('SNDG', 9.1500, 8.1700, 0.9800, 12.0000, 'USD', '2026-09-17T20:45:53.041Z', 'cached', '', ''),
  ('SOXL', 114.8200, 103.9700, 10.8500, 10.4400, 'USD', '2026-09-17T20:45:53.101Z', 'cached', '', ''),
  ('GGLL', 102.5000, 99.9200, 2.5800, 2.5800, 'USD', '2026-09-17T20:45:53.155Z', 'cached', '', ''),
  ('MSFT', 497.7500, 490.3000, 7.4500, 1.5200, 'USD', '2026-09-17T20:45:53.210Z', 'cached', '', ''),
  ('AAPL', 337.0000, 332.4100, 4.5900, 1.3800, 'USD', '2026-09-17T20:45:53.291Z', 'cached', '', ''),
  ('MS', 206.2800, 206.5800, -0.3000, -0.1500, 'USD', '2026-09-16T06:03:19.028Z', 'cached', '', ''),
  ('APP', 330.2600, 331.4600, -1.2000, -0.3600, 'USD', '2026-09-16T16:22:33.658Z', 'cached', '', '')
ON CONFLICT (symbol) DO NOTHING;

INSERT INTO portfolio_account_details (financial_institute, active_status, account_type, account_number, start_date, comments, tax_period, order_index)
VALUES
  ('CS', 'Active', 'Trading Account', 'CS 9271', 'Nov-23', '', 'Yearly Tax on Profit in US.', 1),
  ('CS', 'Active', 'Trading Account', 'CS 9538', 'Aug-24', 'Divided by 2.', 'Yearly Tax on Profit in US.', 2),
  ('RH', 'Active', 'Trading Account', 'RH 8031', 'Feb-24', '', 'Yearly Tax on Profit in US.', 3),
  ('ME', 'Active', 'Cash Management', 'ME-CMA 82K32', 'Jan-24', '', 'Yearly Tax on Profit in US.', 4),
  ('ME', 'Active', 'Traditional IRA', 'ME-IRA 85363', 'Jan-24', '', 'Tax Deferred.', 5),
  ('ME', 'Active', 'Rollover IRA', 'ME-IRRA 73444', 'Jan-24', '', 'Tax Deferred.', 6),
  ('ME', 'Active', 'Roth IRA', 'ME-Roth 82T11', 'Jan-24', '', 'Tax Free Growth in US.', 7)
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO portfolio_deposit_details (account_number, date_invested, amount, comments, order_index)
SELECT account_number, date_invested, amount, comments, order_index
FROM (VALUES
  ('CS 9271', '2/22/2024', 15500.0, '', 1),
  ('CS 9271', '4/3/2024', 10500.0, '', 2),
  ('CS 9271', '6/25/2024', 15000.0, '', 3),
  ('CS 9271', '11/6/2024', 6501.95, 'Transfer of Securities(In/Out)', 4),
  ('CS 9271', '11/6/2024', 392.06, 'Transfer of Cash', 5),
  ('CS 9538', '7/29/2024', 100.0, 'Savings Money', 6),
  ('CS 9538', '8/5/2025', 13500.0, 'Money is funded from Dish Shares Sales. Half money each', 7),
  ('CS 9538', '8/15/2025', 22000.0, 'Transfer from Main Bank', 8),
  ('RH 8031', '2/10/2024', 6553.49, 'Initial Deposit', 9),
  ('ME-CMA 82K32', '1/15/2024', 50000.0, 'Core Cash Deposit', 10),
  ('ME-IRA 85363', '1/15/2024', 64000.0, 'Rollover Contribution', 11),
  ('ME-IRRA 73444', '1/15/2024', 150000.0, '401k Rollover', 12),
  ('ME-Roth 82T11', '1/15/2024', 200000.0, 'Roth Conversion Deposit', 13)
) AS seed (account_number, date_invested, amount, comments, order_index)
WHERE NOT EXISTS (
  SELECT 1 FROM portfolio_deposit_details AS existing
  WHERE existing.account_number = seed.account_number AND existing.date_invested = seed.date_invested AND existing.amount = seed.amount AND existing.order_index = seed.order_index
);

COMMIT;

-- ============================================================================
-- OPERATIONAL DML REFERENCE (do not run this section as-is)
-- ============================================================================
-- Replace <...> values before manually executing one of these statements.
-- They mirror the mutation flows in src/db/portfolio-service.ts.
--
-- ACCOUNT
-- INSERT INTO portfolio_accounts (s_no, account_number, account_name, cash_available, comments)
-- VALUES (<sort_order>, '<account_number>', '<account_name>', <cash_available>, '<comments>');
-- UPDATE portfolio_accounts SET account_name = '<account_name>', cash_available = <cash_available>, comments = '<comments>'
-- WHERE id = <account_id>;
-- DELETE FROM portfolio_accounts WHERE id = <account_id>;
--
-- HOLDING
-- INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at)
-- VALUES ('<account_number>', '<symbol>', <quantity>, <purchase_price>, <quantity * purchase_price>, <current_price>, <quantity * current_price>, '<comments>', '<highlight>', <profit_loss>, <gain_loss_percent>, '<ISO-8601 timestamp>');
-- UPDATE portfolio_holdings SET quantity = <quantity>, purchase_price = <purchase_price>, invest_amount = <invest_amount>, current_price = <current_price>, overall_current_price = <overall_current_price>, comments = '<comments>', highlight = '<highlight>', profit_loss_amt = <profit_loss>, gain_loss_percent = <gain_loss_percent>, updated_at = '<ISO-8601 timestamp>' WHERE id = <holding_id>;
-- DELETE FROM portfolio_holdings WHERE id = <holding_id>;
--
-- DAILY TRANSACTION
-- INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id)
-- VALUES ('<account_number>', '<ISO-8601 timestamp>', 'BUY or SELL', '<symbol>', <quantity>, <price_per_share>, <total_amount>, <current_price>, <average_cost>, <cost_basis_per_share>, <difference_amount>, <difference_percent>, '<comments>', 'EXECUTED', <remaining_quantity>, NULL);
-- UPDATE portfolio_future_investments SET quantity = <quantity>, price_per_share = <price_per_share>, total_amount = <total_amount>, current_price = <current_price>, comments = '<comments>', status = '<status>', remaining_quantity = <remaining_quantity> WHERE id = <transaction_id>;
-- DELETE FROM portfolio_future_investments WHERE id = <transaction_id>;
--
-- WATCHLIST / SETTINGS / MARKET CACHE (application uses UPSERTs)
-- INSERT INTO portfolio_watchlist (symbol, name, exchange, quote_type, created_at) VALUES ('<symbol>', '<name>', '<exchange>', '<quote_type>', '<ISO-8601 timestamp>') ON CONFLICT (symbol) DO NOTHING;
-- DELETE FROM portfolio_watchlist WHERE symbol = '<symbol>';
-- INSERT INTO portfolio_settings (key, value, updated_at) VALUES ('<key>', '<value>', '<ISO-8601 timestamp>') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;
-- INSERT INTO market_cache (symbol, price, previous_close, change_amount, change_percent, currency, last_updated, source, error, last_live_at) VALUES ('<symbol>', <price>, <previous_close>, <change_amount>, <change_percent>, 'USD', '<ISO-8601 timestamp>', 'live or cached', '<error_or_empty>', '<ISO-8601 timestamp_or_empty>') ON CONFLICT (symbol) DO UPDATE SET price = EXCLUDED.price, previous_close = EXCLUDED.previous_close, change_amount = EXCLUDED.change_amount, change_percent = EXCLUDED.change_percent, last_updated = EXCLUDED.last_updated, source = EXCLUDED.source, error = EXCLUDED.error, last_live_at = EXCLUDED.last_live_at;
--
-- ACCOUNT DETAIL / DEPOSIT
-- INSERT INTO portfolio_account_details (financial_institute, active_status, account_type, account_number, start_date, comments, tax_period, order_index) VALUES ('<institution>', 'Active', '<account_type>', '<account_number>', '<start_date>', '<comments>', '<tax_period>', <order_index>);
-- UPDATE portfolio_account_details SET financial_institute = '<institution>', active_status = '<active_status>', account_type = '<account_type>', account_number = '<account_number>', start_date = '<start_date>', comments = '<comments>', tax_period = '<tax_period>', order_index = <order_index> WHERE id = <account_detail_id>;
-- DELETE FROM portfolio_account_details WHERE id = <account_detail_id>;
-- INSERT INTO portfolio_deposit_details (account_number, date_invested, amount, comments, order_index) VALUES ('<account_number>', '<date_invested>', <amount>, '<comments>', <order_index>);
-- UPDATE portfolio_deposit_details SET date_invested = '<date_invested>', amount = <amount>, comments = '<comments>', order_index = <order_index> WHERE id = <deposit_id>;
-- DELETE FROM portfolio_deposit_details WHERE id = <deposit_id>;
--
-- WEEKLY SNAPSHOT UPSERTS
-- INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('<account_number>', '<YYYY-MM-DD>', <current_value>, <gain_loss_amount>, <gain_loss_percent>, '<ISO-8601 timestamp>', 'SATURDAY_9PM_ET') ON CONFLICT (account_number, snapshot_week) DO UPDATE SET investment_current_value = EXCLUDED.investment_current_value, gain_loss_amount = EXCLUDED.gain_loss_amount, gain_loss_percent = EXCLUDED.gain_loss_percent, captured_at = EXCLUDED.captured_at, source = EXCLUDED.source;
-- INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('<account_number>', '<YYYY-MM-DD>', <buy_value>, <sell_value>, <net_cash_flow>, <realized_gain_loss>, <buy_count>, <sell_count>, '<ISO-8601 timestamp>', 'SATURDAY_9PM_ET') ON CONFLICT (account_number, snapshot_week) DO UPDATE SET buy_value = EXCLUDED.buy_value, sell_value = EXCLUDED.sell_value, net_cash_flow = EXCLUDED.net_cash_flow, realized_gain_loss = EXCLUDED.realized_gain_loss, buy_count = EXCLUDED.buy_count, sell_count = EXCLUDED.sell_count, captured_at = EXCLUDED.captured_at, source = EXCLUDED.source;
