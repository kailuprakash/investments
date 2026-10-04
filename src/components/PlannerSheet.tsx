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
  LoaderCircle,
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
  /** Kept in the signature for the workbook host; refreshes are manual. */
  accounts: AccountInfo[];
  onNotify?: (msg: string, type?: "success" | "error" | "info") => void;
}

type EditableField =
  | "symbol"
  | "shares"
  | "sharePrice"
  | "total"
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

/* ------------------------- editable primitives ------------------------- */

const inputBase =
  "planner-cell-input w-full bg-transparent px-1.5 py-1 outline-none border border-transparent focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-500/40 rounded-[2px]";

function PlannerEditCell({
  value,
  displayValue,
  onCommit,
  align = "left",
  placeholder,
  type = "text",
  className = "",
  inputClassName = "",
}: {
  value: string;
  displayValue?: string;
  onCommit: (next: string) => void;
  align?: "left" | "right" | "center";
  placeholder?: string;
  type?: "text" | "number" | "date";
  className?: string;
  inputClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const shown = editing ? draft : displayValue ?? value;
  return (
    <input
      type={type === "date" ? "date" : "text"}
      step={type === "number" ? "any" : undefined}
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
      title={displayValue && !editing ? displayValue : undefined}
      onFocus={() => {
        setDraft(value);
        setEditing(true);
      }}
      onChange={(event) => setDraft(event.target.value)}
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

/** Symbol cell with a type-ahead suggestion dropdown (holdings/watchlist). */
function SymbolSuggestInput({
  value,
  options,
  onCommit,
}: {
  value: string;
  options: string[];
  onCommit: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
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
              matches.length ? Math.min(prev + 1, matches.length - 1) : prev,
            );
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlight((prev) => Math.max(prev - 1, 0));
          } else if (event.key === "Enter") {
            event.preventDefault();
            if (open && matches[highlight]) {
              setDraft(matches[highlight]);
              commit(matches[highlight], true);
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
      {open && editing && matches.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-0.5 max-h-56 w-44 overflow-auto rounded border border-slate-300 bg-white py-0.5 shadow-lg"
        >
          {matches.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === highlight}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setHighlight(index)}
              onClick={() => commit(option, true)}
              className={`cursor-pointer px-2 py-1 text-[11px] font-semibold ${
                index === highlight
                  ? "bg-emerald-600 text-white"
                  : "text-slate-800 hover:bg-emerald-50"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ main sheet ------------------------------ */

const COLLAPSED_KEY = "planner-collapsed-accounts-v1";

/** Fixed column layout (Account's Summary style). */
const COL_WIDTHS = [176, 110, 90, 100, 122, 112, 124, 144, 100, 122, 126, 210, 34];

export default function PlannerSheet({ onNotify }: Props) {
  const [state, setState] = useState<PlannerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  // Manual refresh: pull the latest Actual columns (market price, purchased
  // shares, deployed amount) from the Consolidated View on demand.
  const refreshActuals = async () => {
    setRefreshing(true);
    try {
      await load(true);
    } finally {
      setRefreshing(false);
    }
  };

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

  /* Account's Summary table chrome: navy-on-blue headers, golden editable
     cells, green calculated footer, 12px text and full cell borders. */
  const pane = "rounded-[7px] border border-[#bfcfc8] bg-white overflow-hidden shadow-sm";
  const th = "border border-slate-300 px-2 py-1 whitespace-nowrap bg-[#D9E1F2] text-[#1F4E79]";
  const thEditable = `${th} !bg-[#FFF2CC] !text-[#78350F] font-bold`;
  const td = "border border-slate-300 px-2 py-1 whitespace-nowrap";
  const tdMoney = `${td} text-right tabular-nums`;
  const editableTd =
    "border border-slate-300 p-0 bg-[#FFF2CC] text-[#78350F] whitespace-nowrap";
  const stickyLeft = "sticky left-0 z-[19] shadow-[3px_0_5px_-4px_#33415566]";

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-emerald-950 tracking-wide">
            Planner
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold">
          {status === "saving" && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Saving…
            </span>
          )}
          {status === "saved" && (
            <span className="text-emerald-700">All changes saved</span>
          )}
          <button
            type="button"
            onClick={() => void refreshActuals()}
            disabled={refreshing || loading}
            title="Refresh Actual columns from the Consolidated View and market data"
            className="inline-flex min-h-[29px] items-center gap-1 rounded border border-emerald-700 bg-emerald-700 px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
          >
            <RefreshCw
              size={13}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing…" : "Refresh Actuals"}
          </button>
        </div>
      </div>

      <section className={pane}>
        <div className="max-h-[62vh] overflow-auto">
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
                  data-field-kind="readonly"
                  className={`${th} text-left font-bold sticky left-0 top-0 z-40`}
                >
                  <FieldHeader label="Account" kind="readonly" />
                </th>
                <th
                  colSpan={5}
                  className={`${th} text-center font-bold sticky top-0 z-30`}
                >
                  Plan - Budget Allocation
                </th>
                <th
                  colSpan={4}
                  className={`${th} text-center font-bold sticky top-0 z-30`}
                >
                  Actual
                </th>
                <th
                  rowSpan={2}
                  data-field-kind="calculated"
                  className={`${th} text-right font-bold sticky top-0 z-30`}
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
                  className={`${th} align-middle sticky top-0 z-30`}
                  aria-label="Row actions"
                />
              </tr>
              <tr className="border-b border-slate-400">
                <th data-field-kind="editable" className={`${thEditable} text-left sticky top-[25px] z-30`}>
                  <FieldHeader label="Symbol" kind="editable" />
                </th>
                <th data-field-kind="editable" className={`${thEditable} text-right sticky top-[25px] z-30`}>
                  <FieldHeader label="Shares" kind="editable" />
                </th>
                <th data-field-kind="editable" className={`${thEditable} text-right sticky top-[25px] z-30`}>
                  <FieldHeader label="Share Price" kind="editable" />
                </th>
                <th data-field-kind="editable" className={`${thEditable} text-right sticky top-[25px] z-30`}>
                  <FieldHeader label="Amount" kind="editable" />
                </th>
                <th data-field-kind="editable" className={`${thEditable} text-right sticky top-[25px] z-30`}>
                  <FieldHeader label="% Allocation" kind="editable" />
                </th>
                <th data-field-kind="readonly" className={`${th} text-right font-semibold sticky top-[25px] z-30`}>
                  <FieldHeader label="Market Price" kind="readonly" />
                </th>
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[25px] z-30`}>
                  <FieldHeader label="Shares Purchased" kind="calculated" />
                </th>
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[25px] z-30`}>
                  <FieldHeader label="Share Price" kind="calculated" />
                </th>
                <th data-field-kind="calculated" className={`${th} text-right font-semibold sticky top-[25px] z-30`}>
                  <FieldHeader label="Total Amount" kind="calculated" />
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group: PlannerAccountGroup) => {
                const isCollapsed = !!collapsed[group.accountNumber];
                const cashRemainingLow = group.cashRemaining < 0;
                // Account cell spans all symbol rows (or the empty notice
                // row) plus the Cash Balance and Total footer rows.
                const rowSpan = isCollapsed
                  ? 1
                  : Math.max(group.rows.length, 1) + 2;
                const accountCell = (
                  <td
                    key={`${group.accountNumber}-account`}
                    rowSpan={rowSpan}
                    data-field-kind="readonly"
                    className={`${td} ${stickyLeft} bg-white align-top`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleAccount(group.accountNumber)}
                          aria-expanded={!isCollapsed}
                          aria-label={
                            isCollapsed
                              ? `Expand ${group.accountNumber}`
                              : `Collapse ${group.accountNumber}`
                          }
                          title={isCollapsed ? "Expand" : "Collapse"}
                          className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border border-emerald-700/30 bg-emerald-50 text-emerald-800 transition-colors hover:bg-emerald-100"
                        >
                          {isCollapsed ? (
                            <ChevronRight size={12} strokeWidth={2.5} />
                          ) : (
                            <ChevronDown size={12} strokeWidth={2.5} />
                          )}
                        </button>
                        <span className="whitespace-nowrap text-xs font-bold leading-tight text-emerald-950">
                          {group.accountNumber}
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-[10px] text-slate-400">
                        {group.rows.length}{" "}
                        {group.rows.length === 1 ? "row" : "rows"}
                      </span>
                      <button
                        type="button"
                        onClick={() => void addRow(group.accountNumber)}
                        disabled={addingFor === group.accountNumber}
                        title={`Add a planned row to ${group.accountNumber}`}
                        className="inline-flex items-center gap-1 self-start whitespace-nowrap rounded border border-emerald-700 bg-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                      >
                        {addingFor === group.accountNumber ? (
                          <LoaderCircle className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus size={11} strokeWidth={2.5} />
                        )}
                        Row
                      </button>
                    </div>
                  </td>
                );

                if (isCollapsed) {
                  return (
                    <tr
                      key={group.accountNumber}
                      className="bg-white transition-colors hover:bg-blue-50/40"
                    >
                      {accountCell}
                      <td
                        colSpan={12}
                        className={`${td} italic text-slate-500`}
                      >
                        Collapsed — {group.rows.length}{" "}
                        {group.rows.length === 1 ? " Planned row" : " Planned rows"} ·
                        Planned {money(group.plannedTotal)} of{" "}
                        {money(group.budget)} · Cash Balance{" "}
                        {money(group.cashRemaining)}
                      </td>
                    </tr>
                  );
                }

                return (
                  <Fragment key={group.accountNumber}>
                    {group.rows.length === 0 ? (
                      <tr>
                        {accountCell}
                        <td colSpan={12} className={`${td} italic text-slate-500`}>
                          No planned rows yet — press “Row” to start the
                          allocation plan for this account.
                        </td>
                      </tr>
                    ) : (
                      group.rows.map((row, rowIndex) => {
                        const autoAlloc =
                          group.budget > 0
                            ? (row.total / group.budget) * 100
                            : 0;
                        return (
                          <tr
                            key={row.id}
                            className="bg-white transition-colors hover:bg-blue-50/40"
                          >
                            {rowIndex === 0 && accountCell}
                            <td data-field-kind="editable" className={editableTd}>
                              <SymbolSuggestInput
                                value={row.symbol}
                                options={symbolOptions}
                                onCommit={(next) =>
                                  void commit(row.id, "symbol", next)
                                }
                              />
                            </td>
                            <td data-field-kind="editable" className={editableTd}>
                              <PlannerEditCell
                                type="number"
                                align="right"
                                value={rowNumeric(row, "shares")}
                                displayValue={qty(row.shares)}
                                onCommit={(next) =>
                                  void commit(row.id, "shares", num(next))
                                }
                              />
                            </td>
                            <td data-field-kind="editable" className={editableTd}>
                              <PlannerEditCell
                                type="number"
                                align="right"
                                value={rowNumeric(row, "sharePrice")}
                                displayValue={
                                  row.sharePrice ? money(row.sharePrice) : ""
                                }
                                onCommit={(next) =>
                                  void commit(row.id, "sharePrice", num(next))
                                }
                              />
                            </td>
                            <td data-field-kind="editable" className={editableTd}>
                              <PlannerEditCell
                                type="number"
                                align="right"
                                value={rowNumeric(row, "total")}
                                displayValue={row.total ? money(row.total) : ""}
                                onCommit={(next) =>
                                  void commit(row.id, "total", num(next))
                                }
                              />
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
                            <td data-field-kind="readonly" className={tdMoney}>
                              {row.currentMarketPrice
                                ? money(row.currentMarketPrice)
                                : "—"}
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
                              title="Plan Total − Actual Total Amount"
                            >
                              {money(row.balanceAmount)}
                            </td>
                            <td data-field-kind="editable" className={editableTd} style={{ whiteSpace: "normal" }}>
                              <PlannerEditCell
                                value={row.comments}
                                placeholder="Notes…"
                                onCommit={(next) =>
                                  void commit(row.id, "comments", next)
                                }
                              />
                            </td>
                            <td className={`${td} text-center`}>
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
                          </tr>
                        );
                      })
                    )}
                    <tr className="bg-[#f6f8fa]">
                      <td className={`${td} font-semibold italic text-slate-600`}>
                        Cash Balance
                      </td>
                      <td className={td} />
                      <td className={td} />
                      <td
                        className={`${tdMoney} font-semibold ${
                          cashRemainingLow ? "text-red-700" : "text-slate-700"
                        }`}
                        title="Auto-calculated: Total Account Level Cash Allocation − Σ symbol totals"
                      >
                        {money(group.cashRemaining)}
                      </td>
                      <td className={`${tdMoney} italic text-slate-600`}>
                        {pct(group.remainingPercent)}
                      </td>
                      <td className={`${td} bg-[#eceff2]`} />
                      <td className={`${td} bg-[#eceff2]`} />
                      <td className={`${td} bg-[#eceff2]`} />
                      <td className={`${td} bg-[#eceff2]`} />
                      <td className={`${td} bg-[#eceff2]`} />
                      <td className={`${td} bg-[#eceff2]`} />
                      <td className={`${td} bg-[#eceff2]`} />
                    </tr>
                    <tr data-field-kind="calculated" className="bg-[#DCEFE5] font-bold">
                      {/* Label spans Symbol + Shares + Share Price */}
                      <td
                        colSpan={3}
                        className={`${td} text-emerald-950`}
                      >
                        Total - Account Level - Cash Allocation
                      </td>
                      <td
                        data-field-kind="editable"
                        className={editableTd}
                        title="Editable. Cleared value falls back to the account cash balance from Account Details."
                      >
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
                      </td>
                      <td className={`${tdMoney} text-emerald-950`}>
                        100.00%
                      </td>
                      <td className={`${td}`} />
                      <td className={`${td}`} />
                      <td className={`${td}`} />
                      <td className={`${td}`} />
                      <td
                        className={`${tdMoney} ${
                          group.balanceTotal < 0
                            ? "text-red-700"
                            : "text-emerald-800"
                        }`}
                        title="Σ Plan Total − Σ Actual Total Amount"
                      >
                        {money(group.balanceTotal)}
                      </td>
                      <td className={`${td}`} />
                      <td className={`${td}`} />
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
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
