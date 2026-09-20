export type TradeSide = "BUY" | "SELL";
export type TradeFieldKind = "editable" | "readonly" | "calculated";
export type TradeColumnId =
  | "symbol"
  | "dateTime"
  | "quantity"
  | "pricePerShare"
  | "averageCost"
  | "totalAmount"
  | "currentPrice"
  | "gainLoss"
  | "comments";
export type EditableTradeField =
  | "quantity"
  | "pricePerShare"
  | "averageCost"
  | "comments";
export type TradeEdit = Partial<Pick<DailyTransaction, EditableTradeField>>;

export interface DailyTransaction {
  id: number;
  accountNumber: string;
  action: TradeSide;
  symbol: string;
  dateTime: string;
  quantity: number;
  pricePerShare: number;
  currentPrice: number;
  averageCost?: number | null;
  costBasisPerShare?: number | null;
  totalAmount: number;
  differenceAmount: number;
  differencePercent: number;
  remainingQuantity: number;
  sourceTransactionId?: number | null;
  comments: string;
  status?: string;
}

export interface TradeColumn {
  id: TradeColumnId;
  label: string;
  kind: TradeFieldKind;
  align: "left" | "center" | "right";
  width: number;
  visible: boolean;
}

const column = (
  id: TradeColumnId,
  label: string,
  kind: TradeFieldKind,
  align: TradeColumn["align"],
  width: number,
): TradeColumn => ({ id, label, kind, align, width, visible: true });

export const DEFAULT_TRADE_COLUMNS: Record<TradeSide, TradeColumn[]> = {
  BUY: [
    column("symbol", "Symbol", "readonly", "left", 112),
    column("dateTime", "Date/time", "readonly", "center", 130),
    column("quantity", "Quantity", "editable", "center", 106),
    column("pricePerShare", "Purchase Price/Share", "editable", "right", 145),
    column("totalAmount", "Total Purchase Amount", "calculated", "right", 142),
    column("currentPrice", "Market Price/Share", "readonly", "right", 130),
    column("gainLoss", "Gain/Loss", "calculated", "right", 148),
    column("comments", "Comments", "editable", "left", 186),
  ],
  SELL: [
    column("symbol", "Symbol", "readonly", "left", 112),
    column("dateTime", "Date/time", "readonly", "center", 130),
    column("quantity", "Quantity", "editable", "center", 106),
    column("pricePerShare", "Sell Price/Share", "editable", "right", 134),
    column(
      "averageCost",
      "Avg. Purchase Price/Share",
      "editable",
      "right",
      154,
    ),
    column("totalAmount", "Sold Amount", "calculated", "right", 138),
    column("gainLoss", "Gain/Loss", "calculated", "right", 148),
    column("comments", "Comments", "editable", "left", 186),
  ],
};

export const TRADE_COLUMNS_STORAGE_KEY = "daily-transactions-columns-v6";
export const LEGACY_TRADE_COLUMNS_KEY = "daily-transactions-column-order-v5";
const oldLabels: Partial<Record<TradeColumnId, string[]>> = {
  pricePerShare: [
    "Price Per Share",
    "Price/Share",
    "Purchase Price/Share",
    "Sell Price/Share",
  ],
  averageCost: ["Average Cost", "Avg Cost", "Avg. Purchase Price/Share"],
  totalAmount: ["Total Amount", "Total Purchase Amount", "Sold Amount"],
  currentPrice: ["Current Price", "Current Price/Share", "Market Price/Share"],
};

/** Migrate legacy saved layouts without restoring the removed Account or Sell quote columns. */
export function restoreTradeColumns(
  side: TradeSide,
  saved: unknown,
): TradeColumn[] {
  const defaults = DEFAULT_TRADE_COLUMNS[side];
  if (!Array.isArray(saved)) return defaults.map((col) => ({ ...col }));
  const seen = new Set<string>();
  const restored: TradeColumn[] = [];
  for (const entry of saved) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as { id?: string; label?: unknown; visible?: boolean };
    const def = defaults.find((col) => col.id === item.id);
    if (!def || seen.has(def.id)) continue;
    seen.add(def.id);
    const label =
      typeof item.label === "string" ? item.label.trim().slice(0, 80) : "";
    restored.push({
      ...def,
      label: !label || oldLabels[def.id]?.includes(label) ? def.label : label,
      visible: def.id === "symbol" || item.visible !== false,
    });
  }
  const result = [
    ...restored,
    ...defaults.filter((col) => !seen.has(col.id)).map((col) => ({ ...col })),
  ];
  // Freeze Symbol first so each transaction remains identifiable while scrolling.
  return [
    result.find((col) => col.id === "symbol")!,
    ...result.filter((col) => col.id !== "symbol"),
  ];
}

const roundMoney = (amount: number) => Number(amount.toFixed(2));

/** Realized SELL P&L never depends on today's market quote. */
export function calculateTransactionValues(row: {
  action: string;
  quantity: number;
  pricePerShare: number;
  currentPrice: number;
  averageCost?: number | null;
  costBasisPerShare?: number | null;
}) {
  const isSell = row.action.toUpperCase() === "SELL";
  // Legacy imports store 0 when the recorded average cost is missing.
  const averagePurchasePrice = roundMoney(
    row.averageCost || row.costBasisPerShare || row.pricePerShare,
  );
  const costPerShare = isSell ? averagePurchasePrice : row.pricePerShare;
  const priceDifference = isSell
    ? row.pricePerShare - costPerShare
    : row.currentPrice - row.pricePerShare;
  return {
    averagePurchasePrice,
    totalAmount: roundMoney(row.quantity * row.pricePerShare),
    gainLoss: roundMoney(priceDifference * row.quantity),
    gainLossPercent:
      costPerShare > 0 ? roundMoney((priceDifference / costPerShare) * 100) : 0,
  };
}

export function groupTransactionsByAccount(
  entries: DailyTransaction[],
  side: TradeSide,
  selectedAccounts: string[] | null,
) {
  const selected = selectedAccounts === null ? null : new Set(selectedAccounts);
  const groups = new Map<string, DailyTransaction[]>();
  for (const entry of entries) {
    const account = entry.accountNumber.trim();
    if (
      entry.action.toUpperCase() !== side ||
      (selected && !selected.has(account))
    )
      continue;
    const rows = groups.get(account) ?? [];
    rows.push(entry);
    groups.set(account, rows);
  }
  return Array.from(groups, ([accountNumber, rows]) => ({
    accountNumber,
    rows: [...rows].sort((a, b) => {
      const dateDiff =
        (Date.parse(b.dateTime) || 0) - (Date.parse(a.dateTime) || 0);
      return dateDiff || b.id - a.id;
    }),
  })).sort((a, b) =>
    a.accountNumber.localeCompare(b.accountNumber, undefined, {
      numeric: true,
    }),
  );
}
