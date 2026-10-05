"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type {
  PlannerAccountGroup,
  PlannerRow,
  PlannerState,
} from "@/db/planner-service";
import { FieldHeader } from "@/components/WorkbookUI";

const PLANNER_REFRESH_EVENT = "planner:refresh-actuals";
const PLANNER_REFRESH_STATUS_EVENT = "planner:refresh-status";

type AccountInfo = {
  accountNumber: string;
  accountName?: string;
  cashAvailable?: number;
  holdings?: Array<{
    symbol?: string;
    quantity?: number;
    purchasePrice?: number;
    currentPrice?: number;
  }>;
};

interface Props {
  accounts: AccountInfo[];
  onNotify?: (msg: string, type?: "success" | "error" | "info") => void;
}

type EditableField =
  | "symbol"
  | "sharePrice"
  | "allocationPercent"
  | "asOfDate"
  | "comments";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const qty = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);

const pct = (value: number) =>
  `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;

const eastFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function formatUpdatedAt(iso: string): string {
  if (!iso) return "—";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  return eastFormatter.format(dt);
}

/** Keep only number characters while typing (digits, one dot, leading minus). */
function sanitizeNumeric(raw: string): string {
  let out = raw.replace(/[^0-9.-]/g, "");
  const firstDot = out.indexOf(".");
  if (firstDot !== -1) {
    out = out.slice(0, firstDot + 1) + out.slice(firstDot + 1).replace(/\./g, "");
  }
  const neg = out.startsWith("-");
  out = out.replace(/-/g, "");
  return (neg ? "-" : "") + out;
}

/* ------------------------- editable primitives ------------------------- */

const inputBase =
  "planner-cell-input w-full h-6 bg-transparent px-1.5 outline-none border border-transparent focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-500/40 rounded-[2px]";

function PlannerEditCell({
  value,
  displayValue,
  onCommit,
  align = "left",
  placeholder,
  type = "text",
  className = "",
  inputClassName = "",
  title,
}: {
  value: string;
  displayValue?: string;
  onCommit: (next: string) => void;
  align?: "left" | "right" | "center";
  placeholder?: string;
  type?: "text" | "number" | "date";
  className?: string;
  inputClassName?: string;
  title?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const shown = editing ? draft : displayValue ?? value;
  return (
    <input
      type={type === "date" ? "date" : "text"}
      inputMode={type === "number" ? "decimal" : undefined}
      className={`${inputBase} ${
        align === "right"
          ? "text-right"
          : align === "center"
            ? "text-center"
            : "text-left"
      } ${className} ${inputClassName}`}
      value={shown}
      placeholder={placeholder ?? displayValue ?? ""}
      title={
        title ?? (displayValue && !editing ? displayValue : undefined)
      }
      onFocus={() => {
        setDraft(value);
        setEditing(true);
      }}
      onChange={(event) => {
        const next = event.target.value;
        // Numeric fields reject non-number characters while typing.
        setDraft(type === "number" ? sanitizeNumeric(next) : next);
      }}
      onBlur={() => {
        setEditing(false);
        if (draft !== value) onCommit(draft);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") (event.target as HTMLInputElement).blur();
        if (event.key === "Escape") {
          setDraft(value);
          setEditing(false);
          (event.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}

/** Symbol cell with a type-ahead suggestion dropdown (holdings/watchlist/market). */
function SymbolSuggestInput({
  value,
  options,
  onCommit,
  tooltip,
}: {
  value: string;
  options: string[];
  onCommit: (next: string) => void;
  tooltip?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [marketSuggestions, setMarketSuggestions] = useState<
    { symbol: string; name: string }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const query = draft.trim().toUpperCase();
    if (!query) return options.slice(0, 12);
    const prefix = options.filter((option) => option.startsWith(query));
    const contains = options.filter(
      (option) => !option.startsWith(query) && option.includes(query),
    );
    return [...prefix, ...contains].slice(0, 12);
  }, [draft, options]);

  // Live market search: typing also pulls suggestions from the market search
  // API (Yahoo search with a local fallback).
  useEffect(() => {
    if (!open || !editing) return;
    const query = draft.trim().toUpperCase();
    if (!query) {
      setMarketSuggestions([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/market-search?q=${encodeURIComponent(query)}`,
        );
        const body = response.ok ? await response.json() : null;
        const suggestions: unknown = body?.suggestions;
        setMarketSuggestions(
          Array.isArray(suggestions)
            ? suggestions
                .map((entry) => ({
                  symbol: String(
                    (entry as { symbol?: unknown })?.symbol ?? "",
                  )
                    .trim()
                    .toUpperCase(),
                  name: String((entry as { name?: unknown })?.name ?? "").trim(),
                }))
                .filter((entry) => entry.symbol !== "")
            : [],
        );
      } catch {
        /* local suggestions remain on search failure */
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draft, open, editing]);

  const combined = useMemo(() => {
    const seen = new Set(matches);
    const list = matches.map((symbol) => ({ symbol, hint: "" }));
    for (const item of marketSuggestions) {
      if (!seen.has(item.symbol)) {
        seen.add(item.symbol);
        list.push({ symbol: item.symbol, hint: item.name });
      }
    }
    return list.slice(0, 12);
  }, [matches, marketSuggestions]);

  const commit = useCallback(
    (raw: string, blur = false) => {
      const next = raw.trim().toUpperCase();
      setOpen(false);
      setEditing(false);
      if (next !== value) onCommit(next);
      if (blur) inputRef.current?.blur();
    },
    [value, onCommit],
  );

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        spellCheck={false}
        className={`${inputBase} text-left font-semibold uppercase whitespace-nowrap`}
        value={editing ? draft : value}
        placeholder="Symbol"
        title={!editing && tooltip ? tooltip : undefined}
        onFocus={() => {
          setDraft(value);
          setEditing(true);
          setOpen(true);
          setHighlight(0);
        }}
        onChange={(event) => {
          setDraft(event.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onBlur={() => commit(editing ? draft : value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlight((prev) =>
              combined.length ? Math.min(prev + 1, combined.length - 1) : prev,
            );
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlight((prev) => Math.max(prev - 1, 0));
          } else if (event.key === "Enter") {
            event.preventDefault();
            const target = combined[highlight];
            if (open && target) {
              commit(target.symbol, true);
            } else {
              commit(draft, true);
            }
          } else if (event.key === "Escape") {
            setDraft(value);
            setOpen(false);
            setEditing(false);
            inputRef.current?.blur();
          }
        }}
      />
      {open && editing && (combined.length > 0 || searching) && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-0.5 max-h-56 w-56 overflow-auto rounded border border-slate-300 bg-white py-0.5 shadow-lg"
        >
          {combined.map((option, index) => (
            <li
              key={option.symbol}
              role="option"
              aria-selected={index === highlight}
              title={option.hint || undefined}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setHighlight(index)}
              onClick={() => commit(option.symbol, true)}
              className={`cursor-pointer px-2 py-1 text-[11px] font-semibold ${
                index === highlight
                  ? "bg-emerald-600 text-white"
                  : "text-slate-800 hover:bg-emerald-50"
              }`}
            >
              {option.symbol}
              {option.hint && (
                <span
                  className={`ml-2 truncate text-[10px] font-normal ${
                    index === highlight ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  {option.hint}
                </span>
              )}
            </li>
          ))}
          {searching && (
            <li className="px-2 py-1 text-[10px] italic text-slate-400">
              Searching market…
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ main sheet ------------------------------ */

const COLLAPSED_KEY = "planner-collapsed-accounts-v1";

/** Fixed column layout (no Account column — accounts are group header rows). */
const COL_WIDTHS = [34, 110, 128, 90, 100, 126, 112, 144, 100, 124, 128, 210, 148];

export default function PlannerSheet({ accounts, onNotify }: Props) {
  const [state, setState] = useState<PlannerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [marketRefreshing, setMarketRefreshing] = useState(false);
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [status, setStatus] = useState<"" | "saving" | "saved">("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const savingRef = useRef(0);

  // Remember per-account expand/collapse between visits.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COLLAPSED_KEY);
      if (saved) setCollapsed(JSON.parse(saved) as Record<string, boolean>);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const toggleAccount = (accountNumber: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [accountNumber]: !prev[accountNumber] };
      try {
        window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  const setAllCollapsed = (next: boolean) => {
    setCollapsed((prev) => {
      const updated: Record<string, boolean> = { ...prev };
      for (const group of state?.groups ?? []) {
        updated[group.accountNumber] = next;
      }
      try {
        window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify(updated));
      } catch {
        /* storage unavailable */
      }
      return updated;
    });
  };

  const fail = useCallback(
    (msg: string) => {
      if (onNotify) onNotify(msg, "error");
      else window.alert(msg);
    },
    [onNotify],
  );

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const response = await fetch("/api/planner", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok)
          throw new Error(body?.error || "Failed to load planner");
        setState(body);
      } catch (error) {
        fail(error instanceof Error ? error.message : "Failed to load planner");
      } finally {
        setLoading(false);
      }
    },
    [fail],
  );

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actual columns re-sync automatically whenever the Consolidated View -
  // Account Level (holdings/cash) changes — no manual refresh needed.
  const accountsKey = useMemo(
    () =>
      JSON.stringify(
        (accounts ?? []).map((account) => [
          account.accountNumber,
          account.cashAvailable,
          (account.holdings ?? []).map((h) => [
            h.symbol,
            h.quantity,
            h.purchasePrice,
            h.currentPrice,
          ]),
        ]),
      ),
    [accounts],
  );
  const prevKeyRef = useRef(accountsKey);
  useEffect(() => {
    if (prevKeyRef.current === accountsKey) return;
    prevKeyRef.current = accountsKey;
    void load(true);
  }, [accountsKey, load]);

  // Manual refresh (Planner tab icon): pull the latest Actual columns.
  const refreshActuals = useCallback(async () => {
    window.dispatchEvent(
      new CustomEvent(PLANNER_REFRESH_STATUS_EVENT, {
        detail: { refreshing: true },
      }),
    );
    setRefreshing(true);
    try {
      await load(true);
    } finally {
      setRefreshing(false);
      window.dispatchEvent(
        new CustomEvent(PLANNER_REFRESH_STATUS_EVENT, {
          detail: { refreshing: false },
        }),
      );
    }
  }, [load]);

  useEffect(() => {
    const handleRefresh = () => void refreshActuals();
    window.addEventListener(PLANNER_REFRESH_EVENT, handleRefresh);
    return () =>
      window.removeEventListener(PLANNER_REFRESH_EVENT, handleRefresh);
  }, [refreshActuals]);

  // Market pull from the Market Price header icon.
  const refreshMarketPrices = useCallback(async () => {
    setMarketRefreshing(true);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh-market" }),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body?.error || "Unable to refresh market prices");
      setState(body);
    } catch (error) {
      fail(
        error instanceof Error
          ? error.message
          : "Unable to refresh market prices",
      );
    } finally {
      setMarketRefreshing(false);
    }
  }, [fail]);

  const markSaving = () => {
    savingRef.current += 1;
    setStatus("saving");
  };
  const doneSaving = () => {
    savingRef.current = Math.max(0, savingRef.current - 1);
    if (savingRef.current === 0) {
      setStatus("saved");
      window.setTimeout(() => setStatus(""), 2500);
    }
  };

  const commit = async (rowId: number, field: EditableField, raw: string) => {
    if (field === "symbol" && raw.trim() !== "") {
      // Symbols must be unique within an account block (server enforces too).
      const nextSymbol = raw.trim().toUpperCase();
      const group = state?.groups.find((g) =>
        g.rows.some((row) => row.id === rowId),
      );
      const duplicate = group?.rows.find(
        (row) => row.id !== rowId && row.symbol.trim().toUpperCase() === nextSymbol,
      );
      if (duplicate) {
        fail(
          `"${nextSymbol}" is already in this account's plan. Edit that row instead of adding a duplicate.`,
        );
        void load(true);
        return;
      }
    }
    markSaving();
    try {
      const value =
        field === "allocationPercent" && raw.trim() === "" ? null : raw;
      const response = await fetch("/api/planner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rowId, field, value }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Save failed");
      setState(body);
    } catch (error) {
      fail(error instanceof Error ? error.message : "Save failed");
      void load(true);
    } finally {
      doneSaving();
    }
  };

  const setBudget = async (accountNumber: string, raw: string) => {
    markSaving();
    try {
      const response = await fetch("/api/planner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-budget",
          accountNumber,
          value: raw,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Save failed");
      setState(body);
    } catch (error) {
      fail(error instanceof Error ? error.message : "Save failed");
      void load(true);
    } finally {
      doneSaving();
    }
  };

  const addRow = async (accountNumber: string) => {
    setAddingFor(accountNumber);
    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Unable to add row");
      setState(body);
    } catch (error) {
      fail(error instanceof Error ? error.message : "Unable to add row");
    } finally {
      setAddingFor(null);
    }
  };

  const deleteRow = async (rowId: number, symbol: string) => {
    const label = symbol ? `"${symbol}"` : "this row";
    if (!window.confirm(`Remove ${label} from the planner?`)) return;
    markSaving();
    try {
      const response = await fetch(`/api/planner?id=${rowId}`, {
        method: "DELETE",
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error || "Delete failed");
      setState(body);
    } catch (error) {
      fail(error instanceof Error ? error.message : "Delete failed");
      void load(true);
    } finally {
      doneSaving();
    }
  };

  const num = (value: string): string => {
    const parsed = Number(String(value).replace(/[$,%\s]/g, ""));
    return Number.isFinite(parsed) ? String(parsed) : "0";
  };

  const rowNumeric = (row: PlannerRow, field: EditableField): string => {
    const raw = row[field];
    if (typeof raw === "number") return raw === 0 ? "" : String(raw);
    if (raw === null) return "";
    return String(raw ?? "");
  };

  /* Account's Summary / Consolidated table chrome. */
  const pane = "rounded-[7px] border border-[#bfcfc8] bg-white overflow-hidden shadow-sm";
  const th = "border border-slate-300 px-2 py-1 h-7 whitespace-nowrap bg-[#D9E1F2] text-[#1F4E79]";
  const thEditable = `${th} !bg-[#FFF2CC] !text-[#78350F] font-bold`;
  const td = "border border-slate-300 px-2 py-1 whitespace-nowrap";
  const tdMoney = `${td} text-right tabular-nums`;
  const editableTd =
    "border border-slate-300 p-0 bg-[#FFF2CC] text-[#78350F] whitespace-nowrap";
  const stickyRight = "sticky right-0 z-[19] shadow-[-3px_0_5px_-4px_#33415566] [background-clip:padding-box]";

  if (loading && !state) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <LoaderCircle className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <span className="font-semibold text-sm">
          Loading Planner &amp; Market Data...
        </span>
      </div>
    );
  }

  const groups = state?.groups ?? [];
  const symbolOptions = state?.symbols ?? [];
  const tableWidth = COL_WIDTHS.reduce((sum, width) => sum + width, 0);

  return (
    <div className="space-y-2">
      {(status !== "" || refreshing || marketRefreshing) && (
        <div className="flex justify-end pr-1 text-[10px] font-semibold">
          {refreshing || marketRefreshing ? (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <LoaderCircle className="w-3 h-3 animate-spin" /> Refreshing…
            </span>
          ) : status === "saving" ? (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <LoaderCircle className="w-3 h-3 animate-spin" /> Saving…
            </span>
          ) : (
            <span className="text-emerald-700">All changes saved</span>
          )}
        </div>
      )}

      <section className={pane}>
        <div className="h-[calc(100dvh-125px)] min-h-[320px] overflow-auto">
          <table
            className="table-fixed border-separate border-spacing-0 text-xs"
            style={{ width: tableWidth, minWidth: tableWidth }}
          >
            <colgroup>
              {COL_WIDTHS.map((width, idx) => (
                <col key={idx} style={{ width, minWidth: width, maxWidth: width }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-400">
                <th
                  rowSpan={2}
                  className={`${th} sticky top-0 z-30 text-center`}
                  aria-label="Expand or collapse all accounts"
                >
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setAllCollapsed(
                        groups.some((g) => !collapsed[g.accountNumber]),
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setAllCollapsed(
                          groups.some((g) => !collapsed[g.accountNumber]),
                        );
                      }
                    }}
                    title={
                      groups.some((g) => !collapsed[g.accountNumber])
                        ? "Collapse all accounts"
                        : "Expand all accounts"
                    }
                    aria-label={
                      groups.some((g) => !collapsed[g.accountNumber])
                        ? "Collapse all accounts"
                        : "Expand all accounts"
                    }
                    className="mx-auto inline-flex h-[16px] w-[16px] items-center justify-center rounded text-[#1F4E79]/80 transition-colors hover:text-[#1F4E79] cursor-pointer"
                  >
                    {groups.some((g) => !collapsed[g.accountNumber]) ? (
                      <ChevronUp size={12} strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={12} strokeWidth={2.5} aria-hidden="true" />
                    )}
                  </span>
                </th>
                <th
                  rowSpan={2}
                  data-field-kind="editable"
                  className={`${thEditable} text-left sticky top-0 z-30`}
                >
                  <FieldHeader label="Symbol" kind="editable" />
                </th>
                <th
                  rowSpan={2}
                  data-field-kind="calculated"
                  className={`${th} text-right font-semibold sticky top-0 z-30`}
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    <FieldHeader label="Market Price" kind="calculated" />
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Pull latest market prices"
                      title="Pull latest market prices for these symbols"
                      aria-busy={marketRefreshing}
                      onClick={() => void refreshMarketPrices()}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          void refreshMarketPrices();
                        }
                      }}
                      className="inline-flex h-[14px] w-[14px] items-center justify-center rounded text-[#1F4E79]/70 transition-colors hover:text-[#1F4E79] cursor-pointer"
                    >
                      <RefreshCw
                        size={11}
                        aria-hidden="true"
                        className={marketRefreshing ? "animate-spin" : ""}
                      />
                    </span>
                  </span>
                </th>
                <th
                  colSpan={4}
                  className={`${th} text-center font-bold sticky top-0 z-30`}
                >
                  Plan - Budget Allocation
                </th>
                <th
                  colSpan={3}
                  className={`${th} text-center font-bold sticky top-0 z-30`}
                >
                  Actual
                </th>
                <th
                  rowSpan={2}
                  data-field-kind="calculated"
                  className={`${th} text-center font-bold sticky top-0 z-30`}
                >
                  <FieldHeader label="Balance Amount" kind="calculated" />
                </th>
                <th
                  rowSpan={2}
                  data-field-kind="editable"
                  className={`${thEditable} text-left sticky top-0 z-30`}
                >
                  <FieldHeader label="Comments" kind="editable" />
                </th>
                <th
                  rowSpan={2}
                  data-field-kind="readonly"
                  className={`${th} text-center font-bold sticky top-0 right-0 z-40 [background-clip:padding-box]`}
                >
                  <FieldHeader label="Updated Date" kind="readonly" />
                </th>
              </tr>
              <tr className="border-b border-slate-400">
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[28px] z-30`} title="Auto-calculated: trunc(Amount ÷ Share Price)">
                  <FieldHeader label="~ # of Shares" kind="calculated" />
                </th>
                <th data-field-kind="editable" className={`${thEditable} text-right sticky top-[28px] z-30`}>
                  <FieldHeader label="Share Price" kind="editable" />
                </th>
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[28px] z-30`}>
                  <FieldHeader label="Amount" kind="calculated" />
                </th>
                <th data-field-kind="editable" className={`${thEditable} text-right sticky top-[28px] z-30`}>
                  <FieldHeader label="% Allocation" kind="editable" />
                </th>
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[28px] z-30`}>
                  <FieldHeader label="Shares Purchased" kind="calculated" />
                </th>
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[28px] z-30`}>
                  <FieldHeader label="Share Price" kind="calculated" />
                </th>
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[28px] z-30`}>
                  <FieldHeader label="Total Amount" kind="calculated" />
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group: PlannerAccountGroup) => {
                const isCollapsed = !!collapsed[group.accountNumber];
                const cashRemainingLow = group.cashRemaining < 0;
                return (
                  <Fragment key={group.accountNumber}>
                    {/* Account group header row — same pattern as the
                        Consolidated View account rows. */}
                    <tr className="h-6 bg-[#E7E6E6] text-[11px] font-semibold text-gray-800 border-y border-gray-300">
                      <td colSpan={13} className="border border-gray-300 px-3 py-1">
  <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleAccount(group.accountNumber)}
                              aria-expanded={!isCollapsed}
                              className="inline-flex items-center gap-2 leading-none font-bold text-[#1F4E79] hover:text-blue-900"
                            >
                              {isCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                              <span>{group.accountNumber}</span>
                              <span className="text-[11px] leading-none font-normal text-gray-500">
                                ({group.rows.length}{" "}
                                {group.rows.length === 1 ? "row" : "rows"})
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void addRow(group.accountNumber)}
                              disabled={addingFor === group.accountNumber}
                              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] leading-none font-medium text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-60 whitespace-nowrap"
                            >
                              {addingFor === group.accountNumber ? (
                                <LoaderCircle className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus size={12} strokeWidth={2.5} />
                              )}
                              Add Row
                            </button>
                            <div className="flex items-center gap-3 whitespace-nowrap text-[11px] leading-none font-normal text-gray-600">
                              <span>
                                Account - Cash Value{" "}
                                <strong className="text-gray-800">
                                  {money(group.cashAvailable)}
                                </strong>
                              </span>
                              <span>
                                Allocation{" "}
                                <strong className="text-gray-800">
                                  {money(group.budget)}
                                </strong>
                              </span>
                              <span>
                                Allocated{" "}
                                <strong className="text-gray-800">
                                  {money(group.plannedTotal)}
                                </strong>
                              </span>
                            </div>
                          </div>
                      </td>
                      </tr>

                    {!isCollapsed && group.rows.length === 0 && (
                      <tr className="h-6">
                        <td
                          colSpan={13}
                          className="border border-gray-300 bg-gray-50 px-4 py-3 text-center italic text-gray-400"
                        >
                          No planned rows for {group.accountNumber} — press
                          “Add Row”.
                        </td>
                      </tr>
                    )}

                    {!isCollapsed &&
                      group.rows.map((row) => {
                        const autoAlloc =
                          group.budget > 0
                            ? (row.amount / group.budget) * 100
                            : 0;
                        const balancePct =
                          row.amount > 0
                            ? (row.balanceAmount / row.amount) * 100
                            : null;
                        return (
                          <tr
                            key={row.id}
                            className="h-6 bg-white transition-colors hover:bg-blue-50/40"
                          >
                            {/* Delete moved to the front of the row */}
                            <td className={`${td} !px-0 text-center`}>
                              <button
                                type="button"
                                aria-label={`Delete planner row ${row.symbol || row.id}`}
                                title="Delete row"
                                onClick={() => void deleteRow(row.id, row.symbol)}
                                className="p-1 text-slate-400 transition-colors hover:text-red-600"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                            <td data-field-kind="editable" className={editableTd}>
                              <SymbolSuggestInput
                                value={row.symbol}
                                options={symbolOptions}
                                tooltip={
                                  row.symbol
                                    ? `${row.symbolName || row.symbol}${
                                        row.sector ? ` · ${row.sector}` : ""
                                      }`
                                    : undefined
                                }
                                onCommit={(next) =>
                                  void commit(row.id, "symbol", next)
                                }
                              />
                            </td>
                            <td data-field-kind="calculated" className={tdMoney}>
                              {row.currentMarketPrice
                                ? money(row.currentMarketPrice)
                                : "—"}
                            </td>
                            <td
                              data-field-kind="calculated"
                              className={tdMoney}
                              title="Auto-calculated: trunc(Amount ÷ Share Price)"
                            >
                              {row.shares ? qty(row.shares) : ""}
                            </td>
                            <td data-field-kind="editable" className={editableTd}>
                              <PlannerEditCell
                                type="number"
                                align="right"
                                value={rowNumeric(row, "sharePrice")}
                                displayValue={
                                  row.sharePrice ? money(row.sharePrice) : ""
                                }
                                inputClassName={
                                  row.sharePrice > 0 &&
                                  row.currentMarketPrice > 0 &&
                                  row.sharePrice < row.currentMarketPrice
                                    ? "font-bold text-emerald-700"
                                    : undefined
                                }
                                title={
                                  row.sharePrice > 0 &&
                                  row.currentMarketPrice > 0 &&
                                  row.sharePrice < row.currentMarketPrice
                                    ? `Below Market Price (${money(row.currentMarketPrice)}) — buying point reached`
                                    : undefined
                                }
                                onCommit={(next) =>
                                  void commit(row.id, "sharePrice", num(next))
                                }
                              />
                            </td>
                            <td
                              data-field-kind="calculated"
                              className={`${tdMoney} font-semibold text-slate-800`}
                              title="Auto-calculated: % Allocation × Total Account Level - Cash Allocation"
                            >
                              {row.amount ? money(row.amount) : ""}
                            </td>
                            <td data-field-kind="editable" className={editableTd}>
                              <PlannerEditCell
                                type="number"
                                align="right"
                                value={rowNumeric(row, "allocationPercent")}
                                displayValue={
                                  row.allocationPercent !== null
                                    ? pct(row.allocationPercent)
                                    : `${pct(autoAlloc)} (auto)`
                                }
                                placeholder={pct(autoAlloc)}
                                className={
                                  row.allocationPercent === null
                                    ? "text-slate-500 italic"
                                    : ""
                                }
                                onCommit={(next) =>
                                  void commit(row.id, "allocationPercent", next)
                                }
                              />
                            </td>
                            <td data-field-kind="calculated" className={tdMoney}>
                              {row.sharesPurchased ? qty(row.sharesPurchased) : "0"}
                            </td>
                            <td data-field-kind="calculated" className={tdMoney}>
                              {row.actualSharePrice
                                ? money(row.actualSharePrice)
                                : "—"}
                            </td>
                            <td data-field-kind="calculated" className={tdMoney}>
                              {row.actualTotalAmount
                                ? money(row.actualTotalAmount)
                                : "—"}
                            </td>
                            <td
                              data-field-kind="calculated"
                              className={`${tdMoney} font-semibold ${
                                row.balanceAmount < 0
                                  ? "text-red-700"
                                  : "text-emerald-800"
                              }`}
                              title="Plan Amount − Actual Total Amount"
                            >
                              {money(row.balanceAmount)}
                              {balancePct !== null &&
                                ` (${pct(balancePct)})`}
                            </td>
                            <td data-field-kind="editable" className={editableTd} style={{ whiteSpace: "nowrap" }}>
                              <PlannerEditCell
                                value={row.comments}
                                displayValue={row.comments}
                                placeholder="Notes…"
                                onCommit={(next) =>
                                  void commit(row.id, "comments", next)
                                }
                              />
                            </td>
                            <td
                              data-field-kind="readonly"
                              className={`${td} ${stickyRight} bg-white text-center tabular-nums text-slate-600`}
                              title={
                                row.updatedAt
                                  ? `Last edited at ${row.updatedAt}`
                                  : "No edits yet"
                              }
                            >
                              {formatUpdatedAt(row.updatedAt)}
                            </td>
                          </tr>
                        );
                      })}

                    {!isCollapsed && (
                      <tr className="h-6 bg-[#f6f8fa]">
                        <td className={td} />
                        {/* Cash Balance label merges 4 columns like the
                            Total - Account Level - Cash Allocation row. */}
                        <td
                          colSpan={4}
                          className={`${td} font-semibold italic text-slate-600`}
                        >
                          Cash Balance - Unallocated
                        </td>
                        <td
                          className={`${tdMoney} font-semibold ${
                            cashRemainingLow ? "text-red-700" : "text-slate-700"
                          }`}
                          title="Auto-calculated: Total Account Level Cash Allocation − Σ symbol amounts"
                        >
                          {money(group.cashRemaining)}
                        </td>
                        <td className={`${tdMoney} italic text-slate-600`}>
                          {pct(group.remainingPercent)}
                        </td>
                        {/* Empty cells after % Allocation merge into one span;
                            only Updated Date stays pinned to the right. */}
                        <td colSpan={5} className={`${td} bg-[#f6f8fa]`} />
                        <td className={`${td} ${stickyRight} bg-[#f6f8fa]`} />
                      </tr>
                    )}

                    {!isCollapsed && (
                      <tr data-field-kind="calculated" className="h-6 bg-[#DCEFE5] font-bold">
                        <td className={td} />
                        {/* Label spans Symbol + Market Price + ~ # of Shares + Share Price */}
                        <td colSpan={4} className={`${td} text-emerald-950`}>
                          Total - Account Level - Cash Allocation
                        </td>
                        <td
                          data-field-kind="editable"
                          className={editableTd}
                          title="Editable. Cleared value falls back to the account cash balance from Account Details."
                        >
                          <div className="flex items-center gap-1">
                            <Pencil
                              size={11}
                              aria-hidden="true"
                              className="ml-1 shrink-0 text-[#78350F]/70"
                            />
                            <PlannerEditCell
                              type="number"
                              align="right"
                              value={String(group.budget ?? 0)}
                              displayValue={money(group.budget)}
                              inputClassName="font-bold text-emerald-950"
                              onCommit={(next) =>
                                void setBudget(group.accountNumber, next)
                              }
                            />
                          </div>
                        </td>
                        <td className={`${tdMoney} text-emerald-950`}>
                          100.00%
                        </td>
                        {/* No total Balance Amount; empty cells merge into one
                            span; only Updated Date stays pinned to the right. */}
                        <td colSpan={5} className={`${td}`} />
                        <td className={`${td} ${stickyRight} bg-[#DCEFE5]`} />
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Color legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#d5dde2] bg-[#fbfcfd] px-3 py-1.5 text-[10px] text-slate-500">
          <span className="font-bold text-slate-600">Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-slate-300 bg-[#FFF2CC]" />
            Editable field
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="font-bold text-emerald-700">$34.00</span>
            Share Price below Market Price — buying point reached
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="font-semibold text-emerald-800">$10.00</span>
            Positive balance ·{" "}
            <span className="font-semibold text-red-700">($10.00)</span> negative
            balance
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-slate-300 bg-[#DCEFE5]" />
            Total - Account Level - Cash Allocation row
          </span>
        </div>
      </section>

      {groups.length === 0 && !loading && (
        <div className="rounded-md border border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No accounts found. Add accounts via Account Details first, then plan
          allocations here.
        </div>
      )}
    </div>
  );
}
