"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { FieldHeader } from "@/components/WorkbookUI";

export type AnalyticsHolding = {
  id: number;
  symbol: string;
  accountNumber: string;
  quantity: number;
  investAmount: number;
  overallCurrentPrice: number;
  profitLossAmt: number;
  gainLossPercent: number;
  comments?: string;
};

type SortKey =
  | "holding"
  | "account"
  | "shares"
  | "costBasis"
  | "marketValue"
  | "profitLoss"
  | "gainLossPercent";

type SortState = { key: SortKey; direction: "asc" | "desc" } | null;

const COLUMNS: {
  key: SortKey;
  label: string;
  kind: "readonly" | "calculated";
  align: "left" | "right";
}[] = [
  { key: "holding", label: "Holding", kind: "readonly", align: "left" },
  { key: "account", label: "Account", kind: "readonly", align: "left" },
  { key: "shares", label: "Shares", kind: "readonly", align: "right" },
  { key: "costBasis", label: "Cost Basis", kind: "calculated", align: "right" },
  {
    key: "marketValue",
    label: "Market Value",
    kind: "calculated",
    align: "right",
  },
  {
    key: "profitLoss",
    label: "Profit / Loss",
    kind: "calculated",
    align: "right",
  },
  {
    key: "gainLossPercent",
    label: "Gain / Loss %",
    kind: "calculated",
    align: "right",
  },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  const amount = Number(value) || 0;
  const formatted = money.format(Math.abs(amount));
  return amount < 0 ? `(${formatted})` : formatted;
}

function formatPercent(value: number) {
  const amount = Number.isFinite(value) ? value : 0;
  return `${amount > 0 ? "+" : ""}${amount.toFixed(2)}%`;
}

function sortValue(holding: AnalyticsHolding, key: SortKey): string | number {
  switch (key) {
    case "holding":
      return holding.symbol.toUpperCase();
    case "account":
      return holding.accountNumber.toUpperCase();
    case "shares":
      return Number(holding.quantity) || 0;
    case "costBasis":
      return Number(holding.investAmount) || 0;
    case "marketValue":
      return Number(holding.overallCurrentPrice) || 0;
    case "profitLoss":
      return Number(holding.profitLossAmt) || 0;
    case "gainLossPercent":
      return Number(holding.gainLossPercent) || 0;
  }
}

function matchQuery(option: string, query: string) {
  return option.toLowerCase().includes(query.trim().toLowerCase());
}

function MultiFilter({
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
  const listId = `${label.toLowerCase()}-filter-suggestions`;
  const chosen = selected ?? [];
  const matches = useMemo(
    () => options.filter((option) => matchQuery(option, query)),
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
          aria-activedescendant={
            open && matches[activeIndex]
              ? `${listId}-${activeIndex}`
              : undefined
          }
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

export default function HoldingsPerformanceTable({
  holdings,
}: {
  holdings: AnalyticsHolding[];
}) {
  const [holdingFilter, setHoldingFilter] = useState<string[] | null>(null);
  const [accountFilter, setAccountFilter] = useState<string[] | null>(null);
  const [sort, setSort] = useState<SortState>(null);

  const holdingOptions = useMemo(
    () =>
      Array.from(new Set(holdings.map((row) => row.symbol))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [holdings],
  );
  const accountOptions = useMemo(
    () =>
      Array.from(new Set(holdings.map((row) => row.accountNumber))).sort(
        (a, b) => a.localeCompare(b, undefined, { numeric: true }),
      ),
    [holdings],
  );

  const visible = useMemo(() => {
    const filtered = holdings.filter((row) => {
      const holdingOk =
        holdingFilter === null || holdingFilter.includes(row.symbol);
      const accountOk =
        accountFilter === null || accountFilter.includes(row.accountNumber);
      return holdingOk && accountOk;
    });
    if (!sort) return filtered;
    return [...filtered].sort((left, right) => {
      const a = sortValue(left, sort.key);
      const b = sortValue(right, sort.key);
      const compared =
        typeof a === "string" && typeof b === "string"
          ? a.localeCompare(b, undefined, {
              numeric: true,
              sensitivity: "base",
            })
          : Number(a) - Number(b);
      if (compared !== 0)
        return sort.direction === "asc" ? compared : -compared;
      return left.id - right.id;
    });
  }, [holdings, holdingFilter, accountFilter, sort]);

  function toggleSort(key: SortKey) {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  const filtersActive = holdingFilter !== null || accountFilter !== null;

  return (
    <div className="holdings-performance">
      <div className="holdings-performance-toolbar">
        <MultiFilter
          label="Holding"
          options={holdingOptions}
          selected={holdingFilter}
          onChange={setHoldingFilter}
        />
        <MultiFilter
          label="Account"
          options={accountOptions}
          selected={accountFilter}
          onChange={setAccountFilter}
        />
        {filtersActive && (
          <button
            type="button"
            className="analytics-filter-reset"
            onClick={() => {
              setHoldingFilter(null);
              setAccountFilter(null);
            }}
          >
            Reset filters
          </button>
        )}
        <span className="holdings-performance-count">
          Showing {visible.length} of {holdings.length}{" "}
          {holdings.length === 1 ? "holding" : "holdings"}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="holdings-performance-table w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 font-medium">
              {COLUMNS.map((column) => {
                const active = sort?.key === column.key;
                const ariaSort = !active
                  ? "none"
                  : sort.direction === "asc"
                    ? "ascending"
                    : "descending";
                return (
                  <th
                    key={column.key}
                    data-field-kind={column.kind}
                    data-align={column.align}
                    aria-sort={ariaSort}
                    className={`py-2 ${column.align === "right" ? "text-right" : "text-left"}`}
                  >
                    <button
                      type="button"
                      className="analytics-sort-button"
                      onClick={() => toggleSort(column.key)}
                      aria-label={`Sort by ${column.label}${active ? `, currently ${sort.direction === "asc" ? "ascending" : "descending"}` : ""}`}
                    >
                      <FieldHeader label={column.label} kind={column.kind} />
                      <span
                        className={`analytics-sort-icon ${active ? "is-active" : ""}`}
                        aria-hidden="true"
                      >
                        {active && sort.direction === "desc" ? (
                          <ChevronDown size={13} />
                        ) : (
                          <ChevronUp size={13} />
                        )}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="py-6 text-center text-slate-500"
                >
                  {holdings.length === 0
                    ? "No holdings to display."
                    : "No holdings match the selected Holding and Account filters."}
                </td>
              </tr>
            ) : (
              visible.map((row) => {
                const loss = row.profitLossAmt < 0;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50"
                    data-holding-id={row.id}
                    data-symbol={row.symbol}
                    data-account={row.accountNumber}
                  >
                    <td className="py-2 font-bold text-gray-900 font-mono">
                      {row.symbol}
                      {row.comments ? (
                        <span className="ml-1.5 text-[10px] text-red-600 font-normal">
                          ({row.comments})
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 text-blue-900 font-semibold">
                      {row.accountNumber}
                    </td>
                    <td
                      data-align="right"
                      className="py-2 text-right font-mono"
                    >
                      {row.quantity}
                    </td>
                    <td
                      data-align="right"
                      className="py-2 text-right font-mono"
                    >
                      {formatMoney(row.investAmount || 0)}
                    </td>
                    <td
                      data-align="right"
                      className="py-2 text-right font-mono font-bold text-blue-900"
                    >
                      {formatMoney(row.overallCurrentPrice || 0)}
                    </td>
                    <td
                      data-align="right"
                      className={`py-2 text-right font-mono font-bold ${loss ? "text-red-600" : "text-emerald-700"}`}
                    >
                      {formatMoney(row.profitLossAmt || 0)}
                    </td>
                    <td
                      data-align="right"
                      className={`py-2 text-right font-mono font-semibold ${loss ? "text-red-600" : "text-emerald-700"}`}
                    >
                      {formatPercent(row.gainLossPercent)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
