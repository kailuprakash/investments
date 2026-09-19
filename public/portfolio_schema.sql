-- ============================================================================
-- PORTFOLIO TRACKER - COMPLETE DATABASE SCHEMA (DDL) AND INITIAL DATA (DML)
-- PostgreSQL Compatible Database Script
-- ============================================================================

BEGIN;

-- ============================================================================
-- PART 1: DATA DEFINITION LANGUAGE (DDL)
-- ============================================================================

-- 1. Accounts Summary Table
CREATE TABLE IF NOT EXISTS portfolio_accounts (
  id SERIAL PRIMARY KEY,
  s_no INTEGER NOT NULL DEFAULT 1,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL DEFAULT '',
  cash_available DOUBLE PRECISION NOT NULL DEFAULT 0,
  comments TEXT NOT NULL DEFAULT '',
  CONSTRAINT uq_portfolio_accounts_acc_num UNIQUE (account_number)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_accounts_acc_num ON portfolio_accounts (account_number);

-- 2. Account Details Table
CREATE TABLE IF NOT EXISTS portfolio_account_details (
  id SERIAL PRIMARY KEY,
  financial_institute TEXT NOT NULL DEFAULT 'CS',
  active_status TEXT NOT NULL DEFAULT 'Active',
  account_type TEXT NOT NULL DEFAULT 'Trading Account',
  account_number TEXT NOT NULL,
  start_date TEXT NOT NULL DEFAULT '',
  comments TEXT NOT NULL DEFAULT '',
  tax_period TEXT NOT NULL DEFAULT 'Yearly Tax on Profit in US.',
  order_index INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT uq_portfolio_account_details_acc_num UNIQUE (account_number)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_account_details_acc_num ON portfolio_account_details (account_number);

-- 3. Deposit Details Table
CREATE TABLE IF NOT EXISTS portfolio_deposit_details (
  id SERIAL PRIMARY KEY,
  account_number TEXT NOT NULL,
  date_invested TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  comments TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_portfolio_deposit_details_acc_num ON portfolio_deposit_details (account_number);

-- 4. Consolidated View - Holdings Table
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
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_acc_num ON portfolio_holdings (account_number);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_sym ON portfolio_holdings (symbol);

-- 5. Daily Transactions Table (Buy & Sell Orders)
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
CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_acc_num ON portfolio_future_investments (account_number);
CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_sym ON portfolio_future_investments (symbol);
CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_action ON portfolio_future_investments (action);
CREATE INDEX IF NOT EXISTS idx_portfolio_future_inv_datetime ON portfolio_future_investments (date_time DESC);

-- 6. Market Watchlist Table
CREATE TABLE IF NOT EXISTS portfolio_watchlist (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  exchange TEXT NOT NULL DEFAULT 'NASDAQ',
  quote_type TEXT NOT NULL DEFAULT 'Equity',
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

-- 7. Market Cache Table
CREATE TABLE IF NOT EXISTS market_cache (
  symbol TEXT PRIMARY KEY,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  previous_close DOUBLE PRECISION NOT NULL DEFAULT 0,
  change_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  change_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  last_updated TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

-- 8. Application Settings Table (Auto-Refresh Interval & Preferences)
CREATE TABLE IF NOT EXISTS portfolio_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT
);

-- 9. Weekly Account Value History Table
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
CREATE INDEX IF NOT EXISTS idx_portfolio_weekly_hist_week ON portfolio_weekly_history (snapshot_week DESC, account_number ASC);

-- 10. Weekly Transaction History Table
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
CREATE INDEX IF NOT EXISTS idx_portfolio_tx_hist_week ON portfolio_transaction_history (snapshot_week DESC, account_number ASC);

-- ============================================================================
-- PART 2: DATA MANIPULATION LANGUAGE (DML) - SEED DATA
-- ============================================================================

-- 1. Seed Accounts Summary (portfolio_accounts)
INSERT INTO portfolio_accounts (s_no, account_number, account_name, cash_available, comments) VALUES
  (1, 'CS 9271', 'CS 9271', 64205.80, ''),
  (2, 'CS 9538', 'CS 9538', 34572.59, 'Divided by 2.'),
  (3, 'RH 8031', 'RH 8031', 6033.67, ''),
  (4, 'ME-CMA 82K32', 'ME-CMA 82K32', 21643.00, ''),
  (5, 'ME-IRA 85363', 'ME-IRA 85363', 116729.87, ''),
  (6, 'ME-IRRA 73444', 'ME-IRRA 73444', 70158.31, ''),
  (7, 'ME-Roth 82T11', 'ME-Roth 82T11', 15238.56, '')
ON CONFLICT (account_number) DO NOTHING;

-- 2. Seed Account Details (portfolio_account_details)
INSERT INTO portfolio_account_details (financial_institute, active_status, account_type, account_number, start_date, comments, tax_period, order_index) VALUES
  ('CS', 'Active', 'Trading Account', 'CS 9271', '11/01/2023', '', 'Yearly Tax on Profit in US.', 1),
  ('CS', 'Active', 'Trading Account', 'CS 9538', '8/01/2024', 'Divided by 2.', 'Yearly Tax on Profit in US.', 2),
  ('RH', 'Active', 'Trading Account', 'RH 8031', '2/01/2024', '', 'Yearly Tax on Profit in US.', 3),
  ('ME', 'Active', 'Cash Management', 'ME-CMA 82K32', '1/01/2024', '', 'Yearly Tax on Profit in US.', 4),
  ('ME', 'Active', 'Traditional IRA', 'ME-IRA 85363', '1/01/2024', '', 'Tax Deferred.', 5),
  ('ME', 'Active', 'Rollover IRA', 'ME-IRRA 73444', '1/01/2024', '', 'Tax Deferred.', 6),
  ('ME', 'Active', 'Roth IRA', 'ME-Roth 82T11', '1/01/2024', '', 'Tax Free Growth in US.', 7)
ON CONFLICT (account_number) DO NOTHING;

-- 3. Seed Deposit Details (portfolio_deposit_details) - Ordered chronologically by deposit date
INSERT INTO portfolio_deposit_details (account_number, date_invested, amount, comments, order_index) VALUES
  ('CS 9271', '2/22/2024', 15500.00, '', 1),
  ('CS 9271', '4/3/2024', 10500.00, '', 2),
  ('CS 9271', '6/25/2024', 15000.00, '', 3),
  ('CS 9271', '11/6/2024', 6501.95, 'Transfer of Securities(In/Out)', 4),
  ('CS 9271', '11/6/2024', 392.06, 'Transfer of Cash', 5),

  ('CS 9538', '7/29/2024', 100.00, 'Savings Money', 6),
  ('CS 9538', '8/5/2025', 13500.00, 'Money is funded from Dish Shares Sales. Half money each', 7),
  ('CS 9538', '8/15/2025', 22000.00, 'Transfer from Main Bank', 8),

  ('RH 8031', '2/10/2024', 6553.49, 'Initial Deposit', 9),
  ('ME-CMA 82K32', '1/15/2024', 50000.00, 'Core Cash Deposit', 10),
  ('ME-IRA 85363', '1/15/2024', 64000.00, 'Rollover Contribution', 11),
  ('ME-IRRA 73444', '1/15/2024', 150000.00, '401k Rollover', 12),
  ('ME-Roth 82T11', '1/15/2024', 200000.00, 'Roth Conversion Deposit', 13);

-- 4. Seed Holdings (portfolio_holdings)
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('CS 9271', 'GOOG', 5, 385.14, 1925.7, 343.68, 1718.4, '', '', -207.3, -10.76, '2026-09-17T03:00:46.539Z');
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('CS 9538', 'SOXL', 1, 108.11, 108.11, 114.82, 114.82, '', '', 6.71, 6.21, '2026-09-17T03:00:46.576Z');
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('CS 9538', 'AAPL', 81, 537.4572, 43534.03, 337, 27297, '', '', -16237.03, -37.3, '2026-09-17T11:28:42.392Z');
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('RH 8031', 'SOXL', 4, 0, 0, 114.82, 459.28, '', '', 459.28, 0, '2026-09-17T03:18:00.154Z');
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('RH 8031', 'SNDG', 1, 5.31, 5.31, 9.15, 9.15, '', '', 3.84, 72.32, '2026-09-17T03:00:46.551Z');
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('RH 8031', 'MSFT', 5, 414.84, 2074.2, 497.75, 2488.75, '', '', 414.55, 19.99, '2026-09-17T03:17:46.434Z');
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('RH 8031', 'GGLL', 5, 120, 600, 102.5, 512.5, '', '', -87.5, -14.58, '2026-09-17T03:00:46.601Z');
INSERT INTO portfolio_holdings (account_number, symbol, quantity, purchase_price, invest_amount, current_price, overall_current_price, comments, highlight, profit_loss_amt, gain_loss_percent, updated_at) VALUES ('ME-Roth 82T11', 'SOXL', 5, 108.1, 540.5, 114.82, 574.1, '', '', 33.6, 6.22, '2026-09-17T03:00:46.563Z');

-- 5. Seed Daily Transactions (portfolio_future_investments)
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('RH 8031', '2026-09-16T16:54:30.435Z', 'BUY', 'GGLL', 5, 120, 600, 102.5, 0, 120, -87.5, -14.58, '', 'EXECUTED', 5, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('CS 9538', '2026-09-16T16:33:11.924Z', 'SELL', 'AAPL', 1, 100, 100, 337, 110, 110, -10, -9.09, '', 'EXECUTED', 0, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('CS 9538', '2026-09-16T16:29:53.728Z', 'SELL', 'AAPL', 1, 20, 20, 337, 200, 200, -180, -90, '', 'EXECUTED', 0, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('CS 9538', '2026-09-16T16:22:59.911Z', 'SELL', 'AAPL', 12, 10, 120, 337, 332.36, 332.36, -3868.32, -96.99, '', 'EXECUTED', 0, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('CS 9538', '2026-09-16T16:22:13.164Z', 'SELL', 'AAPL', 5, 300, 1500, 337, 10, 10, 1450, 2900, '', 'EXECUTED', 0, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('RH 8031', '2026-09-16T16:19:32.754Z', 'SELL', 'MSFT', 5, 400, 2000, 497.75, 493.95, 493.95, -469.75, -19.02, '', 'EXECUTED', 0, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('RH 8031', '2026-09-16T16:13:47.650Z', 'SELL', 'SOXL', 3, 107, 321, 114.82, 108.17, 108.17, -3.51, -1.08, '', 'EXECUTED', 0, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('CS 9538', '2026-09-16T16:06:05.236Z', 'BUY', 'SOXL', 1, 108.11, 108.11, 114.82, 0, 108.11, 6.71, 6.21, '', 'EXECUTED', 1, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('ME-Roth 82T11', '2026-09-16T16:05:53.556Z', 'BUY', 'SOXL', 5, 108.1, 540.5, 114.82, 0, 108.1, 33.6, 6.22, '', 'EXECUTED', 5, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('RH 8031', '2026-09-16T16:05:42.496Z', 'BUY', 'SNDG', 1, 5.31, 5.31, 9.15, 0, 5.31, 3.84, 72.32, '', 'EXECUTED', 1, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('RH 8031', '2026-09-16T16:05:16.471Z', 'BUY', 'SOXL', 2, 108.11, 216.22, 114.82, 0, 108.11, 13.42, 6.21, '', 'EXECUTED', 2, NULL);
INSERT INTO portfolio_future_investments (account_number, date_time, action, symbol, quantity, price_per_share, total_amount, current_price, average_cost, cost_basis_per_share, difference_amount, difference_percent, comments, status, remaining_quantity, source_transaction_id) VALUES ('RH 8031', '2026-09-16T16:05:06.611Z', 'BUY', 'SOXL', 5, 107.94, 539.7, 114.82, 0, 107.94, 34.4, 6.37, '', 'EXECUTED', 5, NULL);

-- 6. Seed Market Watchlist (portfolio_watchlist)
INSERT INTO portfolio_watchlist (symbol, name, exchange, quote_type, created_at) VALUES
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

-- 7. Seed Market Quotes Cache (market_cache)
INSERT INTO market_cache (symbol, price, previous_close, change_amount, change_percent, currency, last_updated) VALUES
  ('AAPL', 337.00, 332.41, 4.59, 1.38, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('GOOG', 185.00, 182.60, 2.40, 1.31, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('MSFT', 448.50, 444.20, 4.30, 0.97, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('NFLX', 712.80, 705.00, 7.80, 1.11, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('NVDA', 136.20, 133.50, 2.70, 2.02, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('SOXL', 114.82, 111.90, 2.92, 2.61, 'USD', CURRENT_TIMESTAMP::TEXT),
  ('GGLL', 102.50, 100.80, 1.70, 1.69, 'USD', CURRENT_TIMESTAMP::TEXT)
ON CONFLICT (symbol) DO NOTHING;

-- 8. Seed Application Settings (portfolio_settings)
INSERT INTO portfolio_settings (key, value, updated_at) VALUES
  ('auto_refresh_interval', '60', (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TEXT)
ON CONFLICT (key) DO NOTHING;

-- 9. Seed Weekly Account Value History (portfolio_weekly_history)
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('CS 9271', '2026-09-12', 0, 0, 0, '2026-09-16T10:51:19.000Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('CS 9538', '2026-09-12', 0, 0, 0, '2026-09-16T10:53:19.000Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-CMA 82K32', '2026-09-12', 0, 0, 0, '2026-09-16T10:54:19.000Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-IRA 85363', '2026-09-12', 0, 0, 0, '2026-09-16T10:54:19.000Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-IRRA 73444', '2026-09-12', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-Roth 82T11', '2026-09-12', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('RH 8031', '2026-09-12', 0, 0, 0, '2026-09-16T10:53:19.000Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('CS 9271', '2026-09-05', 0, 0, 0, '2026-09-16T10:51:19.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('CS 9538', '2026-09-05', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-CMA 82K32', '2026-09-05', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-IRA 85363', '2026-09-05', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-IRRA 73444', '2026-09-05', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-Roth 82T11', '2026-09-05', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('RH 8031', '2026-09-05', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('CS 9271', '2026-08-29', 0, 0, 0, '2026-09-16T10:51:19.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('CS 9538', '2026-08-29', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-CMA 82K32', '2026-08-29', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-IRA 85363', '2026-08-29', 0, 0, 0, '2026-09-16T10:54:20.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-IRRA 73444', '2026-08-29', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('ME-Roth 82T11', '2026-08-29', 0, 0, 0, '2026-09-16T10:55:19.000Z', 'SIMULATED_3_WEEK_HISTORY');
INSERT INTO portfolio_weekly_history (account_number, snapshot_week, investment_current_value, gain_loss_amount, gain_loss_percent, captured_at, source) VALUES ('RH 8031', '2026-08-29', 0, 0, 0, '2026-09-16T10:53:20.000Z', 'SIMULATED_3_WEEK_HISTORY');

-- 10. Seed Weekly Transaction History (portfolio_transaction_history)
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('CS 9271', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('CS 9538', '2026-09-12', 108.11, 3482.36, 3374.25, 0, 1, 4, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-CMA 82K32', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-IRA 85363', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-IRRA 73444', '2026-09-12', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-Roth 82T11', '2026-09-12', 540.5, 0, -540.5, 0, 1, 0, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('RH 8031', '2026-09-12', 1361.23, 2794.26, 1433.03, 0, 4, 2, '2026-09-17T02:59:54.805Z', 'SATURDAY_9PM_ET');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('CS 9271', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('CS 9538', '2026-09-05', 84.33, 2716.24, 2631.92, 0, 1, 3, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-CMA 82K32', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-IRA 85363', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-IRRA 73444', '2026-09-05', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-Roth 82T11', '2026-09-05', 421.59, 0, -421.59, 0, 1, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('RH 8031', '2026-09-05', 1061.76, 2179.52, 1117.76, 0, 3, 2, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('CS 9271', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('CS 9538', '2026-08-29', 60.54, 1950.12, 1889.58, 0, 1, 2, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-CMA 82K32', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-IRA 85363', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-IRRA 73444', '2026-08-29', 0, 0, 0, 0, 0, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('ME-Roth 82T11', '2026-08-29', 302.68, 0, -302.68, 0, 1, 0, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');
INSERT INTO portfolio_transaction_history (account_number, snapshot_week, buy_value, sell_value, net_cash_flow, realized_gain_loss, buy_count, sell_count, captured_at, source) VALUES ('RH 8031', '2026-08-29', 762.29, 1564.79, 802.5, 0, 2, 1, '2026-09-17T02:59:54.805Z', 'SIMULATED_3_WEEK_TRANSACTION_HISTORY');

COMMIT;
