"use client";

import "./daily-transactions.css";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  GripVertical,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { FieldHeader, GainLossValue } from "@/components/WorkbookUI";
import {
  DEFAULT_TRADE_COLUMNS,
  LEGACY_TRADE_COLUMNS_KEY,
  TRADE_COLUMNS_STORAGE_KEY,
  calculateTransactionValues,
  groupTransactionsByAccount,
  restoreTradeColumns,
  type DailyTransaction,
  type EditableTradeField,
  type TradeColumn,
  type TradeColumnId,
  type TradeEdit,
  type TradeSide,
} from "@/lib/daily-transactions";
import {
  highlightWorkbookRow,
  selectorForHit,
  type WorkbookHit,
} from "@/lib/workbook-search";

interface SelectedCell {
  cellId: string;
  label: string;
  value: string;
  formula?: string;
}
interface Props {
  entries: DailyTransaction[];
  inventoryAccounts: { accountNumber: string }[];
  selectedCell?: SelectedCell | null;
  onSelectCell: (cell: SelectedCell) => void;
  onOpenAddModal: (side: TradeSide, accountNumber?: string) => void;
  onSellSelected: (row: DailyTransaction) => void;
  onSaveInlineField: (id: number, patch: TradeEdit) => Promise<void>;
  jumpHit?: WorkbookHit | null;
  onJumpHandled?: () => void;
  /** Active sub-tab: All (consolidated), Buy, or Sell. */
  activeOrderTypeTab?: "ALL" | "BUY" | "SELL";
  onSelectOrderTypeTab?: (tab: "ALL" | "BUY" | "SELL") => void;
}

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
const quantity = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(value);
const eastern = "America/New_York";

function TransactionDate({ value }: { value: string }) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return <span>{value || "—"}</span>;
  return (
    <span
      className="transaction-date"
      title={date.toLocaleString("en-US", { timeZone: eastern }) + " Eastern"}
    >
      <span>
        {date.toLocaleDateString("en-US", {
          timeZone: eastern,
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}
      </span>
      <span className="transaction-secondary">
        {date.toLocaleTimeString("en-US", {
          timeZone: eastern,
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </span>
  );
}

/**
 * Analytics-style multi-select combobox filter with type-ahead, chips, and
 * All/Clear controls. `null` selection means "all". Mirrors the Visual
 * Analytics MultiFilter so the two screens feel consistent.
 */
function TransactionMultiFilter({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[] | null;
  onChange: (next: string[] | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = `tx-${label.toLowerCase()}-filter-suggestions`;
  const chosen = selected ?? [];
  const matches = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [options, query],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  function selectOption(option: string) {
    if (!options.includes(option)) return;
    const next = chosen.includes(option) ? chosen : [...chosen, option];
    onChange(next.length === options.length ? null : next);
    setQuery("");
    setOpen(true);
    input.current?.focus();
  }
  function removeOption(option: string) {
    const next = chosen.filter((item) => item !== option);
    onChange(next.length === 0 ? null : next);
  }
  function commitTypedValue() {
    const typed = query.trim();
    if (!typed) return false;
    const exact = options.find(
      (option) => option.toLowerCase() === typed.toLowerCase(),
    );
    const highlighted = matches[activeIndex];
    const unique = matches.length === 1 ? matches[0] : null;
    const next = exact ?? highlighted ?? unique;
    if (!next) return false;
    selectOption(next);
    return true;
  }

  return (
    <div className="analytics-filter" ref={root}>
      <div className="analytics-combobox">
        {chosen.map((option) => (
          <button
            key={option}
            type="button"
            className="analytics-filter-chip"
            aria-label={`Remove ${label} filter ${option}`}
            onClick={() => removeOption(option)}
          >
            <span>{option}</span>
            <X size={12} aria-hidden="true" />
          </button>
        ))}
        <input
          ref={input}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={`Filter by ${label}`}
          placeholder={
            chosen.length
              ? `Add ${label.toLowerCase()}…`
              : `Type to filter ${label.toLowerCase()}s`
          }
          value={query}
          autoComplete="off"
          spellCheck={false}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) =>
                matches.length === 0 ? 0 : (index + 1) % matches.length,
              );
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) =>
                matches.length === 0
                  ? 0
                  : (index - 1 + matches.length) % matches.length,
              );
            } else if (event.key === "Enter") {
              event.preventDefault();
              if (!commitTypedValue()) setOpen(true);
            } else if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              setQuery("");
            } else if (event.key === "Backspace" && !query && chosen.length) {
              removeOption(chosen[chosen.length - 1]);
            }
          }}
        />
      </div>
      {open && (
        <div
          className="analytics-filter-menu"
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
        >
          <div className="analytics-filter-controls">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setQuery("");
              }}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                onChange([]);
                setQuery("");
              }}
            >
              Clear
            </button>
          </div>
          {options.length === 0 ? (
            <p className="analytics-filter-empty">
              No {label.toLowerCase()}s available.
            </p>
          ) : matches.length === 0 ? (
            <p className="analytics-filter-empty" role="status">
              No matching {label.toLowerCase()}s for “{query.trim()}”.
            </p>
          ) : (
            matches.map((option, index) => {
              const active = index === activeIndex;
              const checked = chosen.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={active}
                  className={`analytics-filter-option ${active ? "is-active" : ""} ${checked ? "is-checked" : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  {option}
                  {checked ? (
                    <span className="analytics-filter-selected-mark">
                      Selected
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function EditableTransactionCell({
  row,
  column,
  children,
  value,
  selected,
  onInspect,
  onSave,
}: {
  row: DailyTransaction;
  column: TradeColumn;
  children: ReactNode;
  value: number | string;
  selected: boolean;
  onInspect: () => void;
  onSave: Props["onSaveInlineField"];
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const field = column.id as EditableTradeField;

  function start() {
    if (!inFlight.current) {
      setDraft(String(value));
      setError(null);
      setEditing(true);
    }
  }
  function cancel() {
    if (!inFlight.current) {
      setEditing(false);
      setError(null);
    }
  }
  async function save() {
    if (inFlight.current) return;
    let patch: TradeEdit;
    if (field === "comments") {
      if (draft.length > 2000) {
        setError("Comments must be 2,000 characters or fewer.");
        return;
      }
      patch = { comments: draft.trim() };
    } else {
      const numeric = Number(draft);
      if (!draft.trim() || !Number.isFinite(numeric) || numeric <= 0) {
        setError("Enter a number greater than zero.");
        return;
      }
      patch = { [field]: numeric };
    }
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      await onSave(row.id, patch);
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save. Please try again.",
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <td
      data-field={column.id}
      data-field-kind="editable"
      data-align={column.align}
      className={
        selected ? "transaction-cell is-inspected" : "transaction-cell"
      }
      onClick={onInspect}
      onDoubleClick={start}
    >
      {editing ? (
        <div
          className="transaction-editor"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="transaction-editor-controls">
            <input
              aria-label={`Edit ${column.label} for ${row.symbol} transaction ${row.id}`}
              type={field === "comments" ? "text" : "number"}
              step={field === "comments" ? undefined : "any"}
              maxLength={field === "comments" ? 2000 : undefined}
              autoFocus
              value={draft}
              disabled={busy}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void save();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  cancel();
                }
              }}
            />
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy}
              aria-label={`Save ${column.label}`}
              title="Save (Enter)"
            >
              {busy ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={busy}
              aria-label={`Cancel ${column.label} edit`}
              title="Cancel (Escape)"
            >
              <X size={16} />
            </button>
          </div>
          {error && (
            <span className="transaction-edit-error" role="alert">
              {error}
            </span>
          )}
        </div>
      ) : (
        <div className="transaction-editable-value">
          <button
            type="button"
            className="transaction-edit-button"
            onClick={(event) => {
              event.stopPropagation();
              start();
            }}
            aria-label={`Edit ${column.label} for ${row.symbol} transaction ${row.id}`}
            title={`Edit ${column.label}`}
          >
            <Pencil size={13} />
          </button>
          <span
            className={
              field === "comments"
                ? "transaction-comments"
                : "transaction-cell-value"
            }
          >
            {children}
          </span>
        </div>
      )}
    </td>
  );
}

export default function DailyTransactionsSheet({
  entries,
  inventoryAccounts,
  selectedCell,
  onSelectCell,
  onOpenAddModal,
  onSellSelected,
  onSaveInlineField,
  jumpHit,
  onJumpHandled,
  activeOrderTypeTab = "ALL",
  onSelectOrderTypeTab,
}: Props) {
  // Two sub-tabs within Daily Transactions:
  //   ALL    – a single consolidated, filterable/sortable table.
  //   TRADES – the classic Buy & Sell tables shown side by side.
  // BUY/SELL from the parent both resolve to the combined TRADES view.
  const activeTab: "ALL" | "TRADES" =
    activeOrderTypeTab === "BUY" || activeOrderTypeTab === "SELL"
      ? "TRADES"
      : "ALL";
  const selectTab = (tab: "ALL" | "TRADES") =>
    onSelectOrderTypeTab?.(tab === "ALL" ? "ALL" : "BUY");
  const [columns, setColumns] = useState<Record<TradeSide, TradeColumn[]>>({
    BUY: DEFAULT_TRADE_COLUMNS.BUY,
    SELL: DEFAULT_TRADE_COLUMNS.SELL,
  });
  const [layoutReady, setLayoutReady] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[] | null>(
    null,
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizeSide, setCustomizeSide] = useState<TradeSide>("BUY");
  const [dragColumn, setDragColumn] = useState<{
    side: TradeSide;
    id: TradeColumnId;
  } | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );
  const [selectedBuyId, setSelectedBuyId] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // "All" tab consolidated view: multi-select account / symbol / type filters
  // (analytics-style comboboxes), a date range, and a sortable single table.
  // `null` means "all" for a given filter.
  const [allAccountFilter, setAllAccountFilter] = useState<string[] | null>(null);
  const [allSymbolFilter, setAllSymbolFilter] = useState<string[] | null>(null);
  const [allTypeFilter, setAllTypeFilter] = useState<string[] | null>(null);
  const [allFromDate, setAllFromDate] = useState<string>("");
  const [allToDate, setAllToDate] = useState<string>("");
  const [allSort, setAllSort] = useState<{
    key: "dateTime" | "accountNumber" | "symbol" | "action" | "quantity" | "pricePerShare" | "totalAmount" | "gainLoss";
    dir: "asc" | "desc";
  }>({ key: "dateTime", dir: "desc" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TRADE_COLUMNS_STORAGE_KEY);
      const legacy = localStorage.getItem(LEGACY_TRADE_COLUMNS_KEY);
      const parsed: unknown = saved
        ? JSON.parse(saved)
        : legacy
          ? JSON.parse(legacy)
          : null;
      const layouts =
        parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? (parsed as Record<string, unknown>)
          : null;
      setColumns({
        BUY: restoreTradeColumns("BUY", layouts?.BUY ?? parsed),
        SELL: restoreTradeColumns("SELL", layouts?.SELL ?? parsed),
      });
    } catch {
      /* Invalid / blocked localStorage falls back to the new defaults. */
    }
    setLayoutReady(true);
  }, []);

  useEffect(() => {
    if (layoutReady) {
      try {
        localStorage.setItem(
          TRADE_COLUMNS_STORAGE_KEY,
          JSON.stringify(columns),
        );
      } catch {
        /* Storage may be disabled. */
      }
    }
  }, [columns, layoutReady]);

  useEffect(() => {
    if (!filterOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!filterRef.current?.contains(event.target as Node))
        setFilterOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!jumpHit || jumpHit.sheet !== "future") return;
    const accountNumber = jumpHit.accountNumber;
    if (accountNumber) {
      setCollapsedGroups((prev) => {
        const next = new Set(prev);
        next.delete(`BUY:${accountNumber}`);
        next.delete(`SELL:${accountNumber}`);
        return next;
      });
    }
    let tries = 0;
    const timer = window.setInterval(() => {
      const node = document.querySelector(selectorForHit(jumpHit) || "");
      tries += 1;
      if (
        highlightWorkbookRow(node instanceof HTMLElement ? node : null) ||
        tries > 20
      ) {
        window.clearInterval(timer);
        onJumpHandled?.();
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [jumpHit, onJumpHandled]);

  const accountOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...inventoryAccounts.map((account) => account.accountNumber.trim()),
          ...entries.map((entry) => entry.accountNumber.trim()),
        ]),
      )
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [inventoryAccounts, entries],
  );
  const buyGroups = useMemo(
    () => groupTransactionsByAccount(entries, "BUY", selectedAccounts),
    [entries, selectedAccounts],
  );
  const sellGroups = useMemo(
    () => groupTransactionsByAccount(entries, "SELL", selectedAccounts),
    [entries, selectedAccounts],
  );
  const visibleBuys = buyGroups.flatMap((group) => group.rows);
  const selectedBuy = visibleBuys.find(
    (row) => row.id === selectedBuyId && row.remainingQuantity > 0,
  );
  const buyCount = visibleBuys.length;
  const sellCount = sellGroups.reduce(
    (sum, group) => sum + group.rows.length,
    0,
  );

  // Distinct account / symbol option lists for the "All" tab filters.
  const allAccountOptions = useMemo(
    () =>
      Array.from(new Set(entries.map((e) => e.accountNumber.trim())))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [entries],
  );
  const allSymbolOptions = useMemo(
    () =>
      Array.from(new Set(entries.map((e) => e.symbol.trim().toUpperCase())))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [entries],
  );

  // Combined "All" view: a single flat table of every transaction (Buy + Sell),
  // filtered by account / symbol / type / date range and sorted by column.
  const allRows = useMemo(() => {
    const accountSet = allAccountFilter ? new Set(allAccountFilter) : null;
    const symbolSet = allSymbolFilter ? new Set(allSymbolFilter) : null;
    const typeSet = allTypeFilter ? new Set(allTypeFilter) : null;
    const fromMs = allFromDate ? Date.parse(`${allFromDate}T00:00:00`) : null;
    const toMs = allToDate ? Date.parse(`${allToDate}T23:59:59.999`) : null;
    const filtered = entries.filter((e) => {
      if (accountSet && !accountSet.has(e.accountNumber.trim())) return false;
      if (symbolSet && !symbolSet.has(e.symbol.trim().toUpperCase()))
        return false;
      if (typeSet && !typeSet.has(e.action.toUpperCase())) return false;
      if (fromMs !== null || toMs !== null) {
        const ts = Date.parse(e.dateTime);
        if (!Number.isFinite(ts)) return false;
        if (fromMs !== null && ts < fromMs) return false;
        if (toMs !== null && ts > toMs) return false;
      }
      return true;
    });
    const dir = allSort.dir === "asc" ? 1 : -1;
    const val = (row: DailyTransaction): string | number => {
      switch (allSort.key) {
        case "dateTime":
          return Date.parse(row.dateTime) || 0;
        case "accountNumber":
          return row.accountNumber.toUpperCase();
        case "symbol":
          return row.symbol.toUpperCase();
        case "action":
          return row.action.toUpperCase();
        case "quantity":
          return Number(row.quantity) || 0;
        case "pricePerShare":
          return Number(row.pricePerShare) || 0;
        case "totalAmount":
          return calculateTransactionValues(row).totalAmount;
        case "gainLoss":
          return calculateTransactionValues(row).gainLoss;
      }
    };
    return [...filtered].sort((a, b) => {
      const av = val(a);
      const bv = val(b);
      const cmp =
        typeof av === "string" && typeof bv === "string"
          ? av.localeCompare(bv, undefined, { numeric: true })
          : Number(av) - Number(bv);
      return (cmp || a.id - b.id) * dir;
    });
  }, [
    entries,
    allAccountFilter,
    allSymbolFilter,
    allTypeFilter,
    allFromDate,
    allToDate,
    allSort,
  ]);
  const allCount = allRows.length;
  const allFiltersActive =
    allAccountFilter !== null ||
    allSymbolFilter !== null ||
    allTypeFilter !== null ||
    allFromDate !== "" ||
    allToDate !== "";

  function toggleAllSort(key: typeof allSort.key) {
    setAllSort((cur) =>
      cur.key === key
        ? { key, dir: cur.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "dateTime" ? "desc" : "asc" },
    );
  }

  function toggleGroup(key: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function changeFilter(next: string[] | null) {
    setSelectedAccounts(next);
    setSelectedBuyId(null);
  }
  function reorder(
    side: TradeSide,
    source: TradeColumnId,
    target: TradeColumnId,
  ) {
    if (source === target || source === "symbol" || target === "symbol") return;
    setColumns((prev) => {
      const next = [...prev[side]];
      const from = next.findIndex((col) => col.id === source),
        to = next.findIndex((col) => col.id === target);
      if (from < 0 || to < 0) return prev;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...prev, [side]: next };
    });
  }
  function patchColumn(
    side: TradeSide,
    id: TradeColumnId,
    patch: Partial<Pick<TradeColumn, "label" | "visible">>,
  ) {
    setColumns((prev) => ({
      ...prev,
      [side]: prev[side].map((col) =>
        col.id === id
          ? {
              ...col,
              ...patch,
              visible: id === "symbol" || (patch.visible ?? col.visible),
            }
          : col,
      ),
    }));
  }
  function dropColumn(side: TradeSide, id: TradeColumnId) {
    if (dragColumn?.side === side) reorder(side, dragColumn.id, id);
    setDragColumn(null);
  }

  function renderCell(row: DailyTransaction, column: TradeColumn) {
    const values = calculateTransactionValues(row);
    const isSell = row.action.toUpperCase() === "SELL";
    const id = column.id;
    const cellId = `TX-${row.id}-${id}`;
    const raw: Record<TradeColumnId, string | number> = {
      symbol: row.symbol,
      dateTime: row.dateTime,
      quantity: row.quantity,
      pricePerShare: row.pricePerShare,
      averageCost: values.averagePurchasePrice,
      totalAmount: values.totalAmount,
      currentPrice: row.currentPrice,
      gainLoss: values.gainLoss,
      comments: row.comments || "",
    };
    const formula =
      id === "gainLoss"
        ? isSell
          ? "=([Sell Price/Share]-[Avg. Purchase Price/Share])*[Quantity]"
          : "=([Market Price/Share]-[Purchase Price/Share])*[Quantity]"
        : id === "totalAmount"
          ? `=[${isSell ? "Sell" : "Purchase"} Price/Share]*[Quantity]`
          : String(raw[id]);
    const inspect = () =>
      onSelectCell({
        cellId,
        label: `${row.accountNumber} · ${row.symbol} · ${column.label}`,
        value:
          id === "gainLoss"
            ? `${money(values.gainLoss)} (${values.gainLossPercent.toFixed(2)}%)`
            : String(raw[id]),
        formula,
      });
    let display: ReactNode;
    switch (id) {
      case "symbol":
        display = (
          <div className="transaction-symbol">
            {!isSell && (
              <input
                type="checkbox"
                aria-label={`Select ${row.symbol} buy ${row.id} for sale`}
                checked={selectedBuy?.id === row.id}
                disabled={row.remainingQuantity <= 0}
                onChange={() =>
                  setSelectedBuyId((prev) => (prev === row.id ? null : row.id))
                }
              />
            )}
            <span>
              <strong>{row.symbol}</strong>
              {isSell && row.sourceTransactionId ? (
                <span className="transaction-secondary">
                  Buy #{row.sourceTransactionId}
                </span>
              ) : null}
            </span>
          </div>
        );
        break;
      case "dateTime":
        display = <TransactionDate value={row.dateTime} />;
        break;
      case "quantity":
        display = (
          <span className="transaction-quantity">
            <span>{quantity(row.quantity)}</span>
          </span>
        );
        break;
      case "gainLoss":
        display = (
          <GainLossValue
            amount={values.gainLoss}
            percent={values.gainLossPercent}
          />
        );
        break;
      case "comments":
        display = row.comments || "—";
        break;
      default:
        display = money(Number(raw[id]));
    }
    if (column.kind === "editable")
      return (
        <EditableTransactionCell
          key={id}
          row={row}
          column={column}
          value={raw[id]}
          selected={selectedCell?.cellId === cellId}
          onInspect={inspect}
          onSave={onSaveInlineField}
        >
          {display}
        </EditableTransactionCell>
      );
    return (
      <td
        key={id}
        data-field={id}
        data-field-kind={column.kind}
        data-align={column.align}
        className={`transaction-cell ${id === "symbol" ? "transaction-symbol-cell" : ""} ${selectedCell?.cellId === cellId ? "is-inspected" : ""}`}
        title={id === "gainLoss" ? formula.slice(1) : undefined}
        onClick={inspect}
      >
        {display}
      </td>
    );
  }

  // Combined columns for the "All" tab. Fixed single-table layout showing both
  // Buy and Sell rows. `sortKey` marks columns whose header can sort the table.
  const ALL_COLUMNS: {
    id: TradeColumnId | "action" | "accountNumber";
    label: string;
    kind: TradeColumn["kind"];
    align: TradeColumn["align"];
    width: number;
    sortKey?: typeof allSort.key;
  }[] = [
    { id: "action", label: "Type", kind: "readonly", align: "center", width: 74, sortKey: "action" },
    { id: "accountNumber", label: "Account", kind: "readonly", align: "left", width: 132, sortKey: "accountNumber" },
    { id: "symbol", label: "Symbol", kind: "readonly", align: "left", width: 120, sortKey: "symbol" },
    { id: "dateTime", label: "Date/time", kind: "readonly", align: "center", width: 130, sortKey: "dateTime" },
    { id: "quantity", label: "Quantity", kind: "editable", align: "center", width: 100, sortKey: "quantity" },
    { id: "pricePerShare", label: "Price/Share", kind: "editable", align: "right", width: 128, sortKey: "pricePerShare" },
    { id: "averageCost", label: "Avg. Cost/Share", kind: "readonly", align: "right", width: 138 },
    { id: "currentPrice", label: "Market Price/Share", kind: "readonly", align: "right", width: 138 },
    { id: "totalAmount", label: "Total Amount", kind: "calculated", align: "right", width: 138, sortKey: "totalAmount" },
    { id: "gainLoss", label: "Gain/Loss", kind: "calculated", align: "right", width: 148, sortKey: "gainLoss" },
    { id: "comments", label: "Comments", kind: "editable", align: "left", width: 180 },
  ];

  function renderAllTable() {
    const totalWidth = ALL_COLUMNS.reduce((sum, col) => sum + col.width, 0);
    return (
      <section
        className="transaction-pane transaction-pane-all"
        aria-labelledby="ALL-transactions-title"
        data-side="ALL"
      >
        <div className="transaction-pane-toolbar">
          <div className="transaction-pane-title">
            <h3 id="ALL-transactions-title">All Transactions</h3>
            <span className="transaction-count">
              {allCount} {allCount === 1 ? "row" : "rows"}
            </span>
          </div>
          <div className="transaction-pane-actions">
            <button type="button" onClick={() => onOpenAddModal("BUY")}>
              <Plus size={15} /> Add Buy
            </button>
            <button type="button" onClick={() => onOpenAddModal("SELL")}>
              <Plus size={15} /> Add Sell
            </button>
          </div>
        </div>

        <div className="transaction-all-filters">
          <div className="transaction-all-filter">
            <span className="transaction-all-filter-label">Account</span>
            <TransactionMultiFilter
              label="Account"
              options={allAccountOptions}
              selected={allAccountFilter}
              onChange={setAllAccountFilter}
            />
          </div>
          <div className="transaction-all-filter">
            <span className="transaction-all-filter-label">Symbol</span>
            <TransactionMultiFilter
              label="Symbol"
              options={allSymbolOptions}
              selected={allSymbolFilter}
              onChange={setAllSymbolFilter}
            />
          </div>
          <div className="transaction-all-filter">
            <span className="transaction-all-filter-label">Type</span>
            <TransactionMultiFilter
              label="Type"
              options={["BUY", "SELL"]}
              selected={allTypeFilter}
              onChange={setAllTypeFilter}
            />
          </div>
          <div className="transaction-all-filter">
            <span className="transaction-all-filter-label">From date</span>
            <input
              type="date"
              className="transaction-all-date"
              value={allFromDate}
              max={allToDate || undefined}
              onChange={(e) => setAllFromDate(e.target.value)}
            />
          </div>
          <div className="transaction-all-filter">
            <span className="transaction-all-filter-label">To date</span>
            <input
              type="date"
              className="transaction-all-date"
              value={allToDate}
              min={allFromDate || undefined}
              onChange={(e) => setAllToDate(e.target.value)}
            />
          </div>
          {allFiltersActive && (
            <button
              type="button"
              className="transaction-all-filter-reset"
              onClick={() => {
                setAllAccountFilter(null);
                setAllSymbolFilter(null);
                setAllTypeFilter(null);
                setAllFromDate("");
                setAllToDate("");
              }}
            >
              <X size={13} /> Reset filters
            </button>
          )}
        </div>

        <div
          className="transaction-table-scroll freeze-header-scroll"
          tabIndex={0}
          role="region"
          aria-label="All transactions"
        >
          <table
            className="daily-transactions-table freeze-header-table"
            aria-label="All transactions"
            style={{ minWidth: totalWidth }}
          >
            <colgroup>
              {ALL_COLUMNS.map((col) => (
                <col key={col.id} style={{ width: col.width }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {ALL_COLUMNS.map((col) => {
                  const active = col.sortKey && allSort.key === col.sortKey;
                  return (
                    <th
                      key={col.id}
                      scope="col"
                      data-field={col.id}
                      data-field-kind={col.kind}
                      aria-sort={
                        active
                          ? allSort.dir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      {col.sortKey ? (
                        <button
                          type="button"
                          className="transaction-sort-button"
                          onClick={() => toggleAllSort(col.sortKey!)}
                          title={`Sort by ${col.label}`}
                        >
                          <FieldHeader label={col.label} kind={col.kind} />
                          <span
                            className={`transaction-sort-icon ${active ? "is-active" : ""}`}
                            aria-hidden="true"
                          >
                            {active && allSort.dir === "desc" ? (
                              <ChevronDown size={12} />
                            ) : (
                              <ChevronUp size={12} />
                            )}
                          </span>
                        </button>
                      ) : (
                        <div className="transaction-column-heading">
                          <FieldHeader label={col.label} kind={col.kind} />
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {allRows.length === 0 ? (
                <tr>
                  <td className="transaction-empty" colSpan={ALL_COLUMNS.length}>
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                allRows.map((row) => (
                  <tr
                    key={row.id}
                    data-transaction-id={row.id}
                    data-account={row.accountNumber}
                    data-symbol={row.symbol}
                    className="transaction-data-row"
                  >
                    {ALL_COLUMNS.map((col) =>
                      col.id === "action" ? (
                        <td
                          key="action"
                          data-field="action"
                          data-field-kind="readonly"
                          data-align="center"
                          className="transaction-cell transaction-action-cell"
                        >
                          <span
                            className={`transaction-action-badge ${row.action.toUpperCase() === "SELL" ? "is-sell" : "is-buy"}`}
                          >
                            {row.action.toUpperCase() === "SELL" ? "Sell" : "Buy"}
                          </span>
                        </td>
                      ) : col.id === "accountNumber" ? (
                        <td
                          key="accountNumber"
                          data-field="accountNumber"
                          data-field-kind="readonly"
                          data-align="left"
                          className="transaction-cell transaction-account-cell"
                        >
                          {row.accountNumber}
                        </td>
                      ) : col.id === "averageCost" &&
                        row.action.toUpperCase() !== "SELL" ? (
                        // Avg. Cost/Share is meaningful for Sell rows only.
                        <td
                          key="averageCost"
                          data-field="averageCost"
                          data-field-kind="readonly"
                          data-align="right"
                          className="transaction-cell transaction-blank-cell"
                        >
                          —
                        </td>
                      ) : col.id === "currentPrice" &&
                        row.action.toUpperCase() === "SELL" ? (
                        // Market Price/Share is meaningful for Buy rows only.
                        <td
                          key="currentPrice"
                          data-field="currentPrice"
                          data-field-kind="readonly"
                          data-align="right"
                          className="transaction-cell transaction-blank-cell"
                        >
                          —
                        </td>
                      ) : (
                        renderCell(row, col as TradeColumn)
                      ),
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  function renderTable(side: TradeSide) {
    const groups = side === "BUY" ? buyGroups : sellGroups;
    const visible = columns[side].filter((col) => col.visible);
    const count = side === "BUY" ? buyCount : sellCount;
    const buy = side === "BUY";
    const label = buy ? "Buy" : "Sell";
    const keyPrefix = side;
    const contextAccount =
      selectedAccounts?.length === 1 ? selectedAccounts[0] : undefined;
    return (
      <section
        className={`transaction-pane transaction-pane-${side.toLowerCase()}`}
        aria-labelledby={`${keyPrefix}-transactions-title`}
        data-side={side}
      >
        <div className="transaction-pane-toolbar">
          <div className="transaction-pane-title">
            <h3 id={`${keyPrefix}-transactions-title`}>
              {`${label} Transactions`}
            </h3>
            <span className="transaction-count">
              {count} {count === 1 ? "row" : "rows"}
            </span>
          </div>
          <div className="transaction-pane-actions">
            {buy && selectedBuy && (
              <button
                type="button"
                className="transaction-sell-selected"
                onClick={() => onSellSelected(selectedBuy)}
              >
                Sell Selected Buy
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenAddModal(side, contextAccount)}
            >
              <Plus size={15} /> Add {label}
            </button>
          </div>
        </div>
        <div
          className="transaction-table-scroll freeze-header-scroll"
          tabIndex={0}
          role="region"
          aria-label={`${label} transactions by account`}
        >
          <table
            className="daily-transactions-table freeze-header-table"
            aria-label={`${label} transactions`}
            style={{
              minWidth: visible.reduce((sum, col) => sum + col.width, 0),
            }}
          >
            <colgroup>
              {visible.map((col) => (
                <col key={col.id} style={{ width: col.width }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {visible.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    data-field={col.id}
                    data-field-kind={col.kind}
                    draggable={col.id !== "symbol"}
                    onDragStart={() => setDragColumn({ side, id: col.id })}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => dropColumn(side, col.id)}
                    onDragEnd={() => setDragColumn(null)}
                    title={
                      col.id === "gainLoss" && !buy
                        ? "(Sell Price/Share − Avg. Purchase Price/Share) × Quantity"
                        : col.id === "symbol"
                          ? "Symbol stays visible when scrolling"
                          : "Drag to rearrange this table's columns"
                    }
                  >
                    <div className="transaction-column-heading">
                      {col.id !== "symbol" && (
                        <GripVertical size={12} aria-hidden="true" />
                      )}
                      <FieldHeader
                        label={
                          col.label ||
                          DEFAULT_TRADE_COLUMNS[side].find(
                            (item) => item.id === col.id,
                          )?.label
                        }
                        kind={col.kind}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.length === 0 ? (
                <tr>
                  <td className="transaction-empty" colSpan={visible.length}>
                    No {label.toLowerCase()} transactions
                    {selectedAccounts !== null
                      ? " for the selected accounts"
                      : " yet"}
                    .
                  </td>
                </tr>
              ) : (
                groups.map(({ accountNumber, rows }) => {
                  const key = `${keyPrefix}:${accountNumber}`;
                  const collapsed = collapsedGroups.has(key);
                  return (
                    <Fragment key={key}>
                      <tr
                        className="transaction-account-group"
                        data-account={accountNumber}
                      >
                        <th colSpan={visible.length} scope="rowgroup">
                          <div className="transaction-account-group-inner">
                            <button
                              type="button"
                              className="transaction-group-toggle"
                              onClick={() => toggleGroup(key)}
                              aria-expanded={!collapsed}
                              aria-label={`${collapsed ? "Expand" : "Collapse"} ${accountNumber} ${label.toLowerCase()} transactions`}
                            >
                              {collapsed ? (
                                <ChevronRight size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                              <strong>{accountNumber}</strong>
                              <span className="transaction-group-count">
                                {rows.length}{" "}
                                {rows.length === 1
                                  ? "transaction"
                                  : "transactions"}
                              </span>
                             </button>
                            <button
                              type="button"
                              className="transaction-group-add"
                              onClick={() =>
                                onOpenAddModal(side, accountNumber)
                              }
                              aria-label={`Add ${label.toLowerCase()} for ${accountNumber}`}
                            >
                              <Plus size={14} />
                              <span>Add {label}</span>
                            </button>
                          </div>
                        </th>
                      </tr>
                      {!collapsed &&
                        rows.map((row) => (
                          <tr
                            key={row.id}
                            data-transaction-id={row.id}
                            data-account={accountNumber}
                            data-symbol={row.symbol}
                            className={
                              selectedBuy?.id === row.id
                                ? "transaction-data-row is-selected"
                                : "transaction-data-row"
                            }
                          >
                            {visible.map((col) => renderCell(row, col))}
                          </tr>
                        ))}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!buy && (
          <p className="transaction-formula">
            Gain/Loss = (Sell Price/Share − Avg. Purchase Price/Share) ×
            Quantity
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="section-font-daily daily-transactions-sheet">
      <div className="transactions-toolbar">
        <div className="transactions-toolbar-main">
          <h2>Daily Transactions</h2>
          <span className="transactions-count-badge">
            {buyCount} Buy · {sellCount} Sell
          </span>
          <div className="transaction-account-filter" ref={filterRef}>
            <button
              type="button"
              className="transactions-toolbar-button"
              aria-label="Filter transactions by account"
              aria-expanded={filterOpen}
              aria-controls="transaction-account-options"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              {selectedAccounts === null
                ? "All Accounts"
                : selectedAccounts.length === 1
                  ? selectedAccounts[0]
                  : `${selectedAccounts.length} Accounts`}
              <ChevronDown size={14} />
            </button>
            {filterOpen && (
              <div
                id="transaction-account-options"
                className="transaction-account-options"
              >
                <div className="transaction-filter-controls">
                  <button type="button" onClick={() => changeFilter(null)}>
                    All accounts
                  </button>
                  <button type="button" onClick={() => changeFilter([])}>
                    Clear selection
                  </button>
                  <button
                    type="button"
                    aria-label="Close account filter"
                    onClick={() => setFilterOpen(false)}
                  >
                    <X size={15} />
                  </button>
                </div>
                <fieldset>
                  <legend className="sr-only">
                    Accounts to show in both tables
                  </legend>
                  {accountOptions.map((account) => (
                    <label key={account}>
                      <input
                        type="checkbox"
                        checked={
                          selectedAccounts === null ||
                          selectedAccounts.includes(account)
                        }
                        onChange={(event) => {
                          const current = selectedAccounts ?? accountOptions;
                          const next = event.target.checked
                            ? [...current, account]
                            : current.filter((item) => item !== account);
                          changeFilter(
                            next.length === accountOptions.length ? null : next,
                          );
                        }}
                      />
                      <span>{account}</span>
                    </label>
                  ))}
                </fieldset>
              </div>
            )}
          </div>
          {selectedAccounts !== null && (
            <button
              type="button"
              className="transactions-icon-button"
              aria-label="Reset account filter"
              onClick={() => changeFilter(null)}
            >
              <X size={15} />
            </button>
          )}
        </div>
        <div className="transactions-toolbar-actions">
          <button
            type="button"
            className="transactions-toolbar-button"
            onClick={() => setCollapsedGroups(new Set())}
          >
            Expand All
          </button>
          <button
            type="button"
            className="transactions-toolbar-button"
            onClick={() =>
              setCollapsedGroups(
                new Set([
                  ...buyGroups.map((g) => `BUY:${g.accountNumber}`),
                  ...sellGroups.map((g) => `SELL:${g.accountNumber}`),
                ]),
              )
            }
          >
            Collapse All
          </button>
          <button
            type="button"
            className="transactions-toolbar-button"
            aria-expanded={customizeOpen}
            aria-controls="transaction-column-settings"
            onClick={() => setCustomizeOpen((prev) => !prev)}
          >
            <SlidersHorizontal size={15} /> Rearrange Columns
          </button>
        </div>
      </div>
      {customizeOpen && (
        <div
          id="transaction-column-settings"
          className="transaction-column-settings"
        >
          <div className="transaction-settings-heading">
            <div
              className="transaction-side-picker"
              aria-label="Table to customize"
            >
              {(["BUY", "SELL"] as const).map((side) => (
                <button
                  type="button"
                  key={side}
                  aria-pressed={customizeSide === side}
                  onClick={() => setCustomizeSide(side)}
                >
                  {side === "BUY" ? "Buy columns" : "Sell columns"}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="transaction-reset-columns"
              onClick={() =>
                setColumns({
                  BUY: restoreTradeColumns("BUY", null),
                  SELL: restoreTradeColumns("SELL", null),
                })
              }
            >
              <RotateCcw size={14} /> Reset Default Layout
            </button>
          </div>
          <p>
            Drag headers or use arrows to reorder. Rename or hide columns
            separately for Buy and Sell.
          </p>
          <div className="transaction-column-cards">
            {columns[customizeSide].map((col, index) => (
              <div
                key={`${customizeSide}-${col.id}`}
                className="transaction-column-card"
                draggable={col.id !== "symbol"}
                onDragStart={() =>
                  setDragColumn({ side: customizeSide, id: col.id })
                }
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropColumn(customizeSide, col.id)}
                onDragEnd={() => setDragColumn(null)}
              >
                <GripVertical size={14} />
                <input
                  aria-label={`Rename ${customizeSide.toLowerCase()} ${DEFAULT_TRADE_COLUMNS[customizeSide].find((item) => item.id === col.id)?.label} column`}
                  value={col.label}
                  maxLength={80}
                  onPointerDown={(event) => event.stopPropagation()}
                  onChange={(event) =>
                    patchColumn(customizeSide, col.id, {
                      label: event.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  aria-label={`Move ${col.label} left`}
                  disabled={index < 2}
                  onClick={() =>
                    reorder(
                      customizeSide,
                      col.id,
                      columns[customizeSide][index - 1].id,
                    )
                  }
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${col.label} right`}
                  disabled={
                    col.id === "symbol" ||
                    index === columns[customizeSide].length - 1
                  }
                  onClick={() =>
                    reorder(
                      customizeSide,
                      col.id,
                      columns[customizeSide][index + 1].id,
                    )
                  }
                >
                  <ArrowRight size={14} />
                </button>
                <input
                  type="checkbox"
                  aria-label={`Show ${customizeSide.toLowerCase()} ${col.label} column`}
                  checked={col.visible}
                  disabled={
                    col.id === "symbol" ||
                    (col.visible &&
                      columns[customizeSide].filter((item) => item.visible)
                        .length <= 2)
                  }
                  onChange={(event) =>
                    patchColumn(customizeSide, col.id, {
                      visible: event.target.checked,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        className="transaction-subtabs"
        role="tablist"
        aria-label="All and Buy & Sell transaction pages"
      >
        <button
          type="button"
          role="tab"
          id="subtab-all"
          aria-selected={activeTab === "ALL"}
          aria-controls="subtab-panel-all"
          className={`transaction-subtab ${activeTab === "ALL" ? "is-active" : ""}`}
          onClick={() => selectTab("ALL")}
        >
          All
          <span className="transaction-subtab-count">{buyCount + sellCount}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="subtab-trades"
          aria-selected={activeTab === "TRADES"}
          aria-controls="subtab-panel-trades"
          className={`transaction-subtab ${activeTab === "TRADES" ? "is-active" : ""}`}
          onClick={() => selectTab("TRADES")}
        >
          Buy &amp; Sell
          <span className="transaction-subtab-count">{buyCount + sellCount}</span>
        </button>
      </div>

      {activeTab === "ALL" ? (
        <div
          className="transaction-subtab-panel"
          role="tabpanel"
          id="subtab-panel-all"
          aria-labelledby="subtab-all"
        >
          {renderAllTable()}
        </div>
      ) : (
        <div
          className="transaction-subtab-panel transactions-side-by-side"
          role="tabpanel"
          id="subtab-panel-trades"
          aria-labelledby="subtab-trades"
        >
          {renderTable("BUY")}
          {renderTable("SELL")}
        </div>
      )}
    </section>
  );
}
