"use client";

import { ArrowDownRight, ArrowUpRight, PieChart, TrendingUp } from "lucide-react";

type Holding = {
  id: number;
  symbol: string;
  accountNumber: string;
  overallCurrentPrice: number;
  dayChangeAmount?: number;
  dayChangePercent?: number;
};

type PortfolioAccount = {
  accountNumber: string;
  cashAvailable: number;
  holdings: Holding[];
};

type PortfolioTotal = {
  accountOverallMoney: number;
  cashAvailable: number;
};

type AllocationRow = {
  label: string;
  value: number;
  holdings: number;
  color: string;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const preciseMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const LEVERAGED_ETFS = new Set([
  "SOXL",
  "SOXS",
  "NVDL",
  "NVDU",
  "AMZU",
  "AMDL",
  "MSFU",
  "GGLL",
  "MUU",
  "SNDG",
  "SNDU",
  "SPCX",
  "TQQQ",
  "SQQQ",
  "FNGU",
  "FNGD",
]);

const FUNDS = new Set([
  "GLD",
  "SPY",
  "QQQ",
  "VTI",
  "VOO",
  "IWM",
  "DIA",
  "XLK",
  "XLF",
  "XLE",
  "XLV",
]);

const SECTORS: Record<string, string> = {
  AAPL: "Technology",
  MSFT: "Technology",
  GOOG: "Communication",
  GOOGL: "Communication",
  META: "Communication",
  NFLX: "Communication",
  NVDA: "Semiconductors",
  MU: "Semiconductors",
  TSLA: "Consumer Discretionary",
  AMZN: "Consumer Discretionary",
  CMG: "Consumer Discretionary",
  SFTBY: "Technology",
  OPK: "Healthcare",
};

const COLORS = [
  "#2563eb",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#64748b",
];

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function moneyValue(value: number) {
  const normalized = numberValue(value);
  return normalized < 0
    ? `(${preciseMoney.format(Math.abs(normalized))})`
    : preciseMoney.format(normalized);
}

function compactMoney(value: number) {
  const normalized = numberValue(value);
  return normalized < 0
    ? `(${money.format(Math.abs(normalized))})`
    : money.format(normalized);
}

function percent(value: number) {
  const normalized = numberValue(value);
  return `${normalized > 0 ? "+" : ""}${normalized.toFixed(1)}%`;
}

function sectorOrAsset(symbol: string) {
  const normalized = symbol.trim().toUpperCase();
  if (LEVERAGED_ETFS.has(normalized)) return "Leveraged ETF";
  if (FUNDS.has(normalized)) return "ETF / Fund";
  return SECTORS[normalized] || "Individual Equity";
}

function donutBackground(rows: AllocationRow[]) {
  const total = rows.reduce((sum, row) => sum + Math.max(0, row.value), 0);
  if (total <= 0) return "conic-gradient(#e2e8f0 0 100%)";
  let current = 0;
  return `conic-gradient(${rows
    .map((row) => {
      const start = current;
      current += (Math.max(0, row.value) / total) * 100;
      return `${row.color} ${start.toFixed(2)}% ${current.toFixed(2)}%`;
    })
    .join(", ")})`;
}

export default function VisualAnalyticsDashboard({
  accounts,
  grandTotal,
}: {
  accounts: PortfolioAccount[];
  grandTotal: PortfolioTotal;
}) {
  const holdings = accounts.flatMap((account) => account.holdings || []);
  const allocationMap = new Map<string, { value: number; holdings: number }>();
  allocationMap.set("Cash", { value: numberValue(grandTotal.cashAvailable), holdings: 0 });
  for (const holding of holdings) {
    const label = sectorOrAsset(holding.symbol);
    const current = allocationMap.get(label) || { value: 0, holdings: 0 };
    current.value += numberValue(holding.overallCurrentPrice);
    current.holdings += 1;
    allocationMap.set(label, current);
  }
  const allocation = [...allocationMap.entries()]
    .filter(([, value]) => value.value > 0)
    .sort(([, left], [, right]) => right.value - left.value)
    .map(([label, value], index) => ({
      label,
      value: value.value,
      holdings: value.holdings,
      color: COLORS[index % COLORS.length],
    }));
  const allocationTotal = allocation.reduce((sum, row) => sum + row.value, 0);

  const movers = holdings.map((holding) => ({
    ...holding,
    dayChangeAmount: numberValue(holding.dayChangeAmount),
    dayChangePercent: numberValue(holding.dayChangePercent),
  }));
  const gainers = [...movers]
    .sort((left, right) => right.dayChangeAmount - left.dayChangeAmount)
    .slice(0, 4);
  const losers = [...movers]
    .sort((left, right) => left.dayChangeAmount - right.dayChangeAmount)
    .slice(0, 4);

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_26px_-22px_rgba(15,23,42,0.65)]">
        <div className="mb-3 flex items-start gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-blue-50 text-blue-700">
            <PieChart size={15} />
          </span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.05em] text-slate-800">
              Sector / Asset-Class Allocation
            </h3>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Cash, equity sectors, funds, and leveraged products by current market value.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div
            role="img"
            aria-label={`Sector and asset allocation: ${allocation.map((row) => `${row.label} ${((row.value / (allocationTotal || 1)) * 100).toFixed(1)} percent`).join(", ")}`}
            style={{ background: donutBackground(allocation) }}
            className="grid h-40 w-40 shrink-0 place-items-center rounded-full border border-slate-200 shadow-inner"
          >
            <div className="grid h-24 w-24 place-items-center rounded-full border border-slate-100 bg-white p-2 text-center shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Total</span>
              <span className="font-mono text-xs font-black text-slate-800">
                {compactMoney(grandTotal.accountOverallMoney)}
              </span>
            </div>
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-2">
            {allocation.map((row) => {
              const allocationPercent = allocationTotal > 0 ? (row.value / allocationTotal) * 100 : 0;
              return (
                <div key={row.label} className="rounded-md border border-slate-100 bg-slate-50/70 px-2.5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 text-[11px] font-bold text-slate-700">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="truncate">{row.label}</span>
                    </span>
                    <span className="font-mono text-[11px] font-black text-slate-700">{allocationPercent.toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 flex justify-between gap-2 font-mono text-[10px] text-slate-500">
                    <span>{compactMoney(row.value)}</span>
                    {row.holdings ? <span>{row.holdings} holding{row.holdings === 1 ? "" : "s"}</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_26px_-22px_rgba(15,23,42,0.65)]">
        <div className="mb-3 flex items-start gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-blue-50 text-blue-700">
            <TrendingUp size={15} />
          </span>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.05em] text-slate-800">Largest Movers</h3>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Current market movement versus the latest stored previous close.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              <ArrowUpRight size={12} /> Top gainers
            </p>
            <div className="space-y-2">
              {gainers.map((holding) => (
                <div key={`g-${holding.id}`} className="flex items-center justify-between gap-2 rounded-md bg-emerald-50/70 px-2.5 py-2 text-xs">
                  <span className="font-mono font-black text-slate-800">{holding.symbol}</span>
                  <span className="text-right font-mono font-bold text-emerald-700">
                    {moneyValue(holding.dayChangeAmount)}
                    <small className="ml-1 text-[10px]">{percent(holding.dayChangePercent)}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-rose-700">
              <ArrowDownRight size={12} /> Top losers
            </p>
            <div className="space-y-2">
              {losers.map((holding) => (
                <div key={`l-${holding.id}`} className="flex items-center justify-between gap-2 rounded-md bg-rose-50/70 px-2.5 py-2 text-xs">
                  <span className="font-mono font-black text-slate-800">{holding.symbol}</span>
                  <span className="text-right font-mono font-bold text-rose-700">
                    {moneyValue(holding.dayChangeAmount)}
                    <small className="ml-1 text-[10px]">{percent(holding.dayChangePercent)}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-slate-400">
          Daily movement refreshes whenever market prices are pulled.
        </p>
      </div>
    </section>
  );
}
