"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Trash2, LoaderCircle } from "lucide-react";

export type FieldKind = "editable" | "readonly" | "calculated";

/** Use the same field semantics in every sheet, regardless of its toolbar color. */
export function FieldHeader({
  label,
  kind = "readonly",
}: {
  label: ReactNode;
  kind?: FieldKind;
}) {
  return (
    <span
      className="field-label"
      data-kind={kind}
      title={
        kind === "editable"
          ? "Editable field"
          : kind === "calculated"
            ? "Calculated automatically"
            : "Read-only field"
      }
    >
      <span>{label}</span>
      {kind === "editable" && (
        <Pencil className="field-pencil" size={14} aria-hidden="true" />
      )}
      <span className="sr-only">
        {" "}
        ({kind === "readonly" ? "read-only" : kind})
      </span>
    </span>
  );
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** A single, right-aligned two-line presentation, including subtotals/history. */
export function GainLossValue({
  amount,
  percent,
}: {
  amount: number;
  percent: number;
}) {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const safePercent = Number.isFinite(Number(percent)) ? Number(percent) : 0;
  return (
    <span
      className={`gain-loss-value ${safeAmount < 0 ? "is-negative" : "is-positive"}`}
      data-value-type="currency"
    >
      <span className="gain-loss-amount">{currency.format(safeAmount)}</span>
      <span className="gain-loss-percent">
        ({safePercent > 0 ? "+" : ""}
        {safePercent.toFixed(2)}%)
      </span>
    </span>
  );
}

/** Deleting a holding is not a sell: do not adjust cash, trades, or snapshots. */
export function DeleteHoldingButton({
  holding,
  onDelete,
}: {
  holding: { id: number; symbol: string; accountNumber: string };
  onDelete: (id: number) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (
      busy ||
      !window.confirm(
        `Delete ${holding.symbol} from ${holding.accountNumber}?\n\nOnly this holding row will be removed. Cash balance, transactions, and historical snapshots will not be changed.`,
      )
    )
      return;
    setBusy(true);
    setError(null);
    try {
      await onDelete(holding.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete the holding. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="holding-delete-control">
      <button
        type="button"
        className="delete-holding-button"
        disabled={busy}
        onClick={(event) => {
          event.stopPropagation();
          void remove();
        }}
        aria-label={`${busy ? "Deleting" : "Delete"} ${holding.symbol} holding from ${holding.accountNumber}`}
        aria-busy={busy}
        title="Delete this row only — no cash or transaction changes"
      >
        {busy ? (
          <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 size={15} aria-hidden="true" />
        )}
      </button>
      {error && (
        <span className="holding-delete-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
