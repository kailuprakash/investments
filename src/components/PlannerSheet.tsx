"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import type {
  PlannerAccountGroup,
  PlannerRow,
  PlannerState,
} from "@/db/planner-service";

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
  /** Raw stored value (empty string for zero/blank). */
  value: string;
  /** Pretty value shown when not focused (e.g. "$64,205.80", "25.00%"). */
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
      type={type}
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
        className={`${inputBase} text-left font-semibold uppercase`}
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
              // Prevent input blur so the click can commit the choice.
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

export default function PlannerSheet({ accounts, onNotify }: Props) {
  const [state, setState] = useState<PlannerState | null>(null);
  const [loading, setLoading] = useState(true);
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
        if (!silent)
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

  // Re-pull planner data whenever the workbook portfolio changes (auto-refresh,
  // market pulls, holding edits) so Actual / Balance mirror the Consolidated View.
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

  /* workbook table chrome (matches Daily Transactions / Consolidated View) */
  const pane =
    "rounded-[7px] border border-[#bfcfc8] bg-white overflow-hidden shadow-sm";
  const th = "border-r border-b border-[#d5dde2] px-2 text-slate-800";
  const td = "border-r border-b border-[#d5dde2]";
  const editableTd = `${td} p-0 bg-[#FFF9CC]`;
  const chip =
    "inline-flex items-center gap-1 rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white";

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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-emerald-950 tracking-wide">
            Planner
          </h2>
          <p className="text-[11px] text-slate-500">
            Enter a Symbol (suggestions appear), set % Allocation and the Total
            is auto-calculated from the account cash allocation. Planned columns
            (yellow) are editable; Actual values pull live from the market and
            the Consolidated View.
          </p>
        </div>
        <div className="text-[11px] font-semibold">
          {status === "saving" && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Saving…
            </span>
          )}
          {status === "saved" && (
            <span className="text-emerald-700">All changes saved</span>
          )}
        </div>
      </div>

      {groups.map((group: PlannerAccountGroup) => {
        const isCollapsed = !!collapsed[group.accountNumber];
        const remainingLow = group.remainingPercent < 0;
        const cashRemainingLow = group.cashRemaining < 0;
        return (
          <section key={group.accountNumber} className={pane}>
            {/* Toolbar — same emerald gradient as the Buy & Sell panes */}
            <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2.5 bg-[linear-gradient(110deg,#065f46,#087c59)] px-3 py-[9px] text-white">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAccount(group.accountNumber)}
                  aria-expanded={!isCollapsed}
                  aria-label={
                    isCollapsed
                      ? `Expand ${group.accountNumber} planner rows`
                      : `Collapse ${group.accountNumber} planner rows`
                  }
                  title={isCollapsed ? "Expand" : "Collapse"}
                  className="inline-flex h-[22px] w-[22px] items-center justify-center rounded border border-white/35 bg-white/10 transition-colors hover:bg-white/25"
                >
                  {isCollapsed ? (
                    <ChevronRight size={14} strokeWidth={2.5} />
                  ) : (
                    <ChevronDown size={14} strokeWidth={2.5} />
                  )}
                </button>
                <h3 className="m-0 text-[12px] font-bold">
                  {group.accountNumber}
                </h3>
                <span className={chip}>
                  Account Cash: {money(group.cashAvailable)}
                </span>
                <span className={chip}>
                  Allocation Budget: {money(group.budget)}
                  {group.budgetOverride !== null ? " (custom)" : ""}
                </span>
                <span className={chip}>Planned: {money(group.plannedTotal)}</span>
                <span
                  className={`${chip} ${remainingLow ? "bg-red-500/40" : ""}`}
                >
                  Remaining: {pct(group.remainingPercent)}
                </span>
                {isCollapsed && group.rows.length > 0 && (
                  <span className={`${chip} bg-white/10`}>
                    {group.rows.length}{" "}
                    {group.rows.length === 1 ? "row" : "rows"}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => void addRow(group.accountNumber)}
                disabled={addingFor === group.accountNumber}
                className="inline-flex min-h-[29px] items-center gap-1 rounded border border-white/40 bg-white px-2 py-1 text-[11px] font-semibold text-[#065f46] transition-colors hover:bg-[#f0fdf4] disabled:opacity-60"
              >
                {addingFor === group.accountNumber ? (
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus size={13} strokeWidth={2.5} />
                )}
                Add Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-[11px] leading-[1.25]">
                <thead>
                  <tr className="bg-[#D9EAF7]">
                    <th
                      colSpan={5}
                      className={`${th} py-1 text-center font-bold !bg-[#bcd8ef]`}
                    >
                      Planned
                    </th>
                    <th
                      colSpan={4}
                      className={`${th} py-1 text-center font-bold !bg-[#bcd8ef]`}
                    >
                      Actual
                    </th>
                    <th
                      colSpan={2}
                      className={`${th} py-1 text-center font-bold !bg-[#bcd8ef]`}
                    >
                      Balance
                    </th>
                    <th className={`${th} w-[32px]`} aria-label="Row actions" />
                  </tr>
                  <tr className="bg-[#D9EAF7]">
                    <th className={`${th} py-1 text-left font-semibold min-w-[104px]`}>
                      Symbol
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[82px]`}>
                      Shares
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[92px]`}>
                      Share Price
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[104px]`}>
                      Total
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[100px]`}>
                      % Allocation
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[126px]`}>
                      Current Market Price
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[114px]`}>
                      Shares Purchased
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[92px]`}>
                      Share Price
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[106px]`}>
                      Total Amount
                    </th>
                    <th className={`${th} py-1 text-right font-semibold min-w-[108px]`}>
                      Balance Amount
                    </th>
                    <th className={`${th} py-1 text-center font-semibold min-w-[102px]`}>
                      as of Date
                    </th>
                    <th className={`${th} py-1 text-left font-semibold min-w-[150px]`}>
                      Comments
                    </th>
                    <th className={`${th} !border-r-0`} />
                  </tr>
                </thead>
                <tbody>
                  {!isCollapsed && group.rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={13}
                        className={`${td} px-3 py-3 italic text-slate-500`}
                      >
                        No planned rows yet — press “Add Row” to start the
                        allocation plan for this account.
                      </td>
                    </tr>
                  )}
                  {!isCollapsed &&
                    group.rows.map((row) => {
                      const autoAlloc =
                        group.budget > 0 ? (row.total / group.budget) * 100 : 0;
                      return (
                        <tr key={row.id} className="hover:bg-[#f4f9f6]">
                          <td className={editableTd}>
                            <SymbolSuggestInput
                              value={row.symbol}
                              options={symbolOptions}
                              onCommit={(next) =>
                                void commit(row.id, "symbol", next)
                              }
                            />
                          </td>
                          <td className={editableTd}>
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
                          <td className={editableTd}>
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
                          {/* Total: editable; switches to auto when % Allocation
                              is entered (Total = % × budget). */}
                          <td className={editableTd}>
                            <PlannerEditCell
                              type="number"
                              align="right"
                              value={rowNumeric(row, "total")}
                              displayValue={
                                row.total ? money(row.total) : ""
                              }
                              onCommit={(next) =>
                                void commit(row.id, "total", num(next))
                              }
                            />
                          </td>
                          <td className={editableTd}>
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
                          <td className={`${td} px-2 py-1 text-right tabular-nums`}>
                            {row.currentMarketPrice
                              ? money(row.currentMarketPrice)
                              : "—"}
                          </td>
                          <td className={`${td} px-2 py-1 text-right tabular-nums`}>
                            {row.sharesPurchased ? qty(row.sharesPurchased) : "0"}
                          </td>
                          <td className={`${td} px-2 py-1 text-right tabular-nums`}>
                            {row.actualSharePrice
                              ? money(row.actualSharePrice)
                              : "—"}
                          </td>
                          <td className={`${td} px-2 py-1 text-right tabular-nums`}>
                            {row.actualTotalAmount
                              ? money(row.actualTotalAmount)
                              : "—"}
                          </td>
                          <td
                            className={`${td} px-2 py-1 text-right tabular-nums font-semibold ${
                              row.balanceAmount < 0
                                ? "text-red-700"
                                : "text-emerald-800"
                            }`}
                            title="Planned Total − Actual Total Amount"
                          >
                            {money(row.balanceAmount)}
                          </td>
                          <td className={editableTd}>
                            <PlannerEditCell
                              type="date"
                              align="center"
                              value={row.asOfDate}
                              onCommit={(next) =>
                                void commit(row.id, "asOfDate", next)
                              }
                            />
                          </td>
                          <td className={editableTd}>
                            <PlannerEditCell
                              value={row.comments}
                              placeholder="Notes…"
                              onCommit={(next) =>
                                void commit(row.id, "comments", next)
                              }
                            />
                          </td>
                          <td className={`${td} !border-r-0 text-center`}>
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
                    })}
                  <tr className="bg-[#f6f8fa]">
                    <td className={`${td} px-2 py-1 font-semibold italic text-slate-600`}>
                      Cash Balance
                    </td>
                    <td className={td} />
                    <td className={td} />
                    <td
                      className={`${td} px-2 py-1 text-right tabular-nums font-semibold ${
                        cashRemainingLow ? "text-red-700" : "text-slate-700"
                      }`}
                      title="Auto-calculated: Total Account Level Cash Allocation − Σ symbol totals"
                    >
                      {money(group.cashRemaining)}
                    </td>
                    <td className={`${td} px-2 py-1 text-right italic text-slate-600`}>
                      Remaining Balance {pct(group.remainingPercent)}
                    </td>
                    <td className={`${td} bg-[#eceff2]`} colSpan={4} />
                    <td className={`${td} bg-[#eceff2]`} colSpan={3} />
                  </tr>
                  <tr className="bg-[#EAF3FA] font-bold">
                    {/* Label spans Symbol + Shares + Share Price */}
                    <td
                      colSpan={3}
                      className={`${td} px-2 py-1.5 text-emerald-950`}
                    >
                      Total - Account Level - Cash Allocation
                    </td>
                    <td
                      className={`${td} p-0 bg-[#FFF9CC]`}
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
                    <td className={`${td} px-2 py-1.5 text-right tabular-nums text-emerald-950`}>
                      100.00%
                    </td>
                    <td className={`${td} bg-[#dbe5eb]`} colSpan={4} />
                    <td
                      className={`${td} px-2 py-1.5 text-right tabular-nums ${
                        group.balanceTotal < 0 ? "text-red-700" : "text-emerald-800"
                      }`}
                      title="Σ Planned Total − Σ Actual Total Amount"
                    >
                      {money(group.balanceTotal)}
                    </td>
                    <td className={`${td} bg-[#dbe5eb]`} />
                    <td className={`${td} bg-[#dbe5eb] !border-r-0`} />
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {groups.length === 0 && !loading && (
        <div className="rounded-md border border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No accounts found. Add accounts via Account Details first, then plan
          allocations here.
        </div>
      )}
    </div>
  );
}
