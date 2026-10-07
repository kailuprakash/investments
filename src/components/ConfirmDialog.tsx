"use client";

import type { ReactNode } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

/**
 * Workbook-styled confirm dialog — replaces native window.confirm/alert so
 * destructive actions (delete row, delete holding) present the exact record
 * being removed, with a red destructive action.
 */
export default function ConfirmDialog({
  open,
  title = "Confirm action",
  message,
  confirmLabel = "Delete",
  detail,
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  detail?: string;
  tone?: "danger" | "primary";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  const danger = tone === "danger";
  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-300 bg-white p-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !busy) onCancel();
          if (event.key === "Enter") onConfirm();
        }}
      >
        <div className="flex items-start gap-2.5">
          <span
            className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <TriangleAlert size={15} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-emerald-950">{title}</h3>
            <div className="mt-1 text-[12px] leading-5 text-slate-600">
              {message}
            </div>
            {detail && (
              <p className="mt-1 text-[10px] text-slate-400">{detail}</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex min-h-[29px] items-center rounded border border-slate-300 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex min-h-[29px] items-center gap-1 rounded border px-3 py-1 text-[11px] font-semibold text-white transition disabled:opacity-60 ${
              danger
                ? "border-red-700 bg-red-700 hover:bg-red-800"
                : "border-emerald-700 bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            {busy && <LoaderCircle className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
