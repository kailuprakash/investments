"use client";

/**
 * Static workbook color legend, pinned to the bottom edge of every tab.
 * Each swatch explains what the color means across the whole workbook —
 * it never describes an individual selected cell.
 */
const SWATCHES: { color: string; label: string }[] = [
  { color: "#FFF2CC", label: "Editable field (click to edit)" },
  { color: "#DCEFE5", label: "Calculated / totals row" },
  {
    color: "#C6EFCE",
    label: "Share Price below Market Price — buying point reached",
  },
  { color: "#E7E6E6", label: "Account group header row" },
  { color: "#D9E1F2", label: "Table header (read-only)" },
];

export default function ColorLegend() {
  return (
    <div
      className="sticky bottom-0 z-30 flex flex-wrap items-center gap-x-4 gap-y-0.5 border-t border-[#d5dde2] bg-white/95 px-2.5 py-1 text-[10px] text-slate-500"
      aria-label="Workbook color legend"
    >
      <span className="font-bold text-slate-600">Legend:</span>
      {SWATCHES.map((item) => (
        <span
          key={item.color}
          className="inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span
            className="h-3 w-3 rounded-[2px] border border-slate-300"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          {item.label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="font-semibold text-emerald-800">$10.00</span>
        positive / remaining
      </span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="font-semibold text-red-700">($10.00)</span>
        negative / loss
      </span>
    </div>
  );
}
