"use client";

import type { ReactNode } from "react";
import HoldingsPerformanceTable, {
  type AnalyticsHolding,
} from "@/components/HoldingsPerformanceTable";
import type { WorkbookHit } from "@/lib/workbook-search";
import {
  BarChart3,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type AnalyticsAccount = {
  accountNumber: string;
  accountOverallMoney?: number;
  cashAvailable?: number;
  isInactive?: boolean;
  activeStatus?: string;
  holdings?: AnalyticsHolding[];
};

type PortfolioTotal = {
  accountOverallMoney?: number;
  cashAvailable?: number;
  amountInvested?: number;
  investmentCurrent?: number;
  gainLoss?: number;
  gainLossPercent?: number;
};

function amount(value: number | undefined) {
  const number = Number(value) || 0;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(number));
  return number < 0 ? `(${formatted})` : formatted;
}

function percent(value: number | undefined, digits = 1) {
  const number = Number(value) || 0;
  return `${number > 0 ? "+" : ""}${number.toFixed(digits)}%`;
}

function ratio(value: number, total: number) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.min(100, Math.max(0, (value / total) * 100));
}

function MetricCard({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "default" | "positive" | "negative" | "primary";
}) {
  const valueClass = {
    default: "text-slate-900",
    positive: "text-emerald-700",
    negative: "text-red-600",
    primary: "text-blue-900",
  }[tone];

  return (
    <div className="rounded border border-slate-200 bg-white p-3.5 shadow-xs">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className={`mt-1 font-mono text-lg font-black ${valueClass}`}>
        {value}
      </div>
      <span className="text-[10px] text-slate-400">{note}</span>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  status,
  statusClass,
  detail,
}: {
  icon: ReactNode;
  title: string;
  status: string;
  statusClass: string;
  detail: string;
}) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#1F4E79]">
          {icon}
          <span>{title}</span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}
        >
          {status}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600">{detail}</p>
    </div>
  );
}

export default function VisualAnalytics({
  accounts,
  grandTotal,
  jumpHit,
  onJumpHandled,
}: {
  accounts: AnalyticsAccount[];
  grandTotal: PortfolioTotal;
  jumpHit?: WorkbookHit | null;
  onJumpHandled?: () => void;
}) {
  const holdings = accounts.flatMap((account) => account.holdings || []);
  const netWorth = Number(grandTotal.accountOverallMoney) || 0;
  const cash = Number(grandTotal.cashAvailable) || 0;
  const invested = Number(grandTotal.amountInvested) || 0;
  const marketValue = Number(grandTotal.investmentCurrent) || 0;
  const gainLoss = Number(grandTotal.gainLoss) || 0;
  const returnPercent = Number(grandTotal.gainLossPercent) || 0;
  const cashPercent = ratio(cash, netWorth);
  const equityPercent = ratio(marketValue, netWorth);
  const activeAccounts = accounts.filter(
    (account) =>
      !account.isInactive &&
      String(account.activeStatus || "Active").toUpperCase() !== "INACTIVE",
  ).length;
  const symbols = new Set(
    holdings
      .map((holding) => String(holding.symbol || "").trim().toUpperCase())
      .filter(Boolean),
  );
  const topHolding = [...holdings].sort(
    (left, right) =>
      (Number(right.overallCurrentPrice) || 0) -
      (Number(left.overallCurrentPrice) || 0),
  )[0];
  const topHoldingValue = Number(topHolding?.overallCurrentPrice) || 0;
  const topHoldingWeight = ratio(topHoldingValue, marketValue);
  const gainers = holdings.filter(
    (holding) => (Number(holding.profitLossAmt) || 0) > 0,
  ).length;
  const losers = holdings.filter(
    (holding) => (Number(holding.profitLossAmt) || 0) < 0,
  ).length;
  const liquidityStatus =
    cashPercent >= 20 ? "Strong" : cashPercent >= 10 ? "Balanced" : "Low";
  const liquidityClass =
    cashPercent >= 20
      ? "bg-emerald-100 text-emerald-800"
      : cashPercent >= 10
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-700";
  const concentrationStatus =
    topHoldingWeight >= 50
      ? "High"
      : topHoldingWeight >= 25
        ? "Watch"
        : "Balanced";
  const concentrationClass =
    topHoldingWeight >= 50
      ? "bg-red-100 text-red-700"
      : topHoldingWeight >= 25
        ? "bg-amber-100 text-amber-800"
        : "bg-emerald-100 text-emerald-800";
  const diversificationStatus =
    symbols.size >= 8 ? "Broad" : symbols.size >= 4 ? "Moderate" : "Focused";
  const diversificationClass =
    symbols.size >= 8
      ? "bg-emerald-100 text-emerald-800"
      : symbols.size >= 4
        ? "bg-blue-100 text-blue-800"
        : "bg-amber-100 text-amber-800";

  return (
    <div className="min-h-[500px] space-y-5 bg-slate-50/70 p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          label="Account Value"
          value={amount(netWorth)}
          note="Total net worth"
        />
        <MetricCard
          label="Cash Balance"
          value={amount(cash)}
          note={`${cashPercent.toFixed(1)}% of total`}
          tone="positive"
        />
        <MetricCard
          label="Amount Invested"
          value={amount(invested)}
          note="Cost basis"
        />
        <MetricCard
          label="Market Value"
          value={amount(marketValue)}
          note={`${equityPercent.toFixed(1)}% of total`}
          tone="primary"
        />
        <MetricCard
          label="Total Gain / Loss"
          value={amount(gainLoss)}
          note="Unrealized P&L"
          tone={gainLoss < 0 ? "negative" : "positive"}
        />
        <MetricCard
          label="Total Return"
          value={percent(returnPercent, 2)}
          note="ROI on invested value"
          tone={returnPercent < 0 ? "negative" : "positive"}
        />
      </div>

      <section aria-labelledby="portfolio-insights-heading">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <h2
            id="portfolio-insights-heading"
            className="text-xs font-bold uppercase tracking-wide text-[#1F4E79]"
          >
            Portfolio Insights
          </h2>
          <span className="text-[11px] text-slate-500">
            Liquidity, concentration, diversification, and market breadth
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />}
            title="Liquidity"
            status={liquidityStatus}
            statusClass={liquidityClass}
            detail={`${amount(cash)} is available in cash, representing ${cashPercent.toFixed(1)}% of total account value.`}
          />
          <InsightCard
            icon={<PieChart className="h-4 w-4 text-blue-600" aria-hidden="true" />}
            title="Concentration"
            status={concentrationStatus}
            statusClass={concentrationClass}
            detail={
              topHolding
                ? `${topHolding.symbol} is the largest position at ${amount(topHoldingValue)} (${topHoldingWeight.toFixed(1)}% of invested market value).`
                : "No current holdings are available to assess position concentration."
            }
          />
          <InsightCard
            icon={<BarChart3 className="h-4 w-4 text-indigo-600" aria-hidden="true" />}
            title="Diversification"
            status={diversificationStatus}
            statusClass={diversificationClass}
            detail={`${symbols.size} unique symbol${symbols.size === 1 ? "" : "s"} across ${holdings.length} position${holdings.length === 1 ? "" : "s"} and ${activeAccounts} active account${activeAccounts === 1 ? "" : "s"}.`}
          />
          <InsightCard
            icon={
              gainers >= losers ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" aria-hidden="true" />
              )
            }
            title="Market Breadth"
            status={gainers >= losers ? "Positive" : "Negative"}
            statusClass={
              gainers >= losers
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-700"
            }
            detail={`${gainers} position${gainers === 1 ? " is" : "s are"} positive and ${losers} ${losers === 1 ? "is" : "are"} negative by unrealized profit / loss.`}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="space-y-3 rounded border border-slate-200 bg-white p-4 shadow-xs">
          <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1F4E79]">
            <PieChart className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Asset Composition (Cash vs Equity)
          </h2>
          <div className="flex h-6 w-full overflow-hidden rounded-full border border-slate-300 bg-slate-100">
            <div
              style={{ width: `${cashPercent}%` }}
              className="flex h-full items-center justify-center bg-emerald-500 text-[10px] font-bold text-white"
              title={`Cash: ${cashPercent.toFixed(1)}%`}
            >
              {cashPercent >= 10 ? `Cash ${cashPercent.toFixed(1)}%` : null}
            </div>
            <div
              style={{ width: `${equityPercent}%` }}
              className="flex h-full items-center justify-center bg-blue-600 text-[10px] font-bold text-white"
              title={`Equities: ${equityPercent.toFixed(1)}%`}
            >
              {equityPercent >= 10 ? `Equities ${equityPercent.toFixed(1)}%` : null}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <i className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
              Cash: {amount(cash)}
            </span>
            <span className="flex items-center gap-2">
              <i className="inline-block h-3 w-3 rounded-full bg-blue-600" />
              Equities: {amount(marketValue)}
            </span>
          </div>
        </section>

        <section className="space-y-3 rounded border border-slate-200 bg-white p-4 shadow-xs">
          <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1F4E79]">
            <BarChart3 className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Portfolio Split by Account
          </h2>
          <div className="space-y-2">
            {accounts.length === 0 ? (
              <p className="text-xs text-slate-500">No accounts to display.</p>
            ) : (
              accounts.map((account) => {
                const accountValue = Number(account.accountOverallMoney) || 0;
                const accountWeight = ratio(accountValue, netWorth);
                return (
                  <div key={account.accountNumber} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span className="font-bold">{account.accountNumber}</span>
                      <span className="font-mono">
                        {amount(accountValue)} ({accountWeight.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{ width: `${accountWeight}%` }}
                        className="h-full rounded-full bg-[#1F4E79]"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <section className="rounded border border-slate-200 bg-white p-4 shadow-xs">
        <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1F4E79]">
          <BarChart3 className="h-4 w-4 text-blue-600" aria-hidden="true" />
          Holdings Performance & Unrealized Profit / Loss
        </h2>
        <HoldingsPerformanceTable
          holdings={holdings}
          jumpHit={jumpHit}
          onJumpHandled={onJumpHandled}
        />
      </section>
    </div>
  );
}
