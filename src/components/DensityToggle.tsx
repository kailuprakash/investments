"use client";

import { useEffect, useState } from "react";
import { Rows3, Rows4 } from "lucide-react";

const STORAGE_KEY = "portfolio-table-density-v1";
type Density = "comfortable" | "compact";

function readDensity(): Density {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "compact" ? "compact" : "comfortable";
  } catch {
    return "comfortable";
  }
}

/**
 * Toggles the unified table density (comfortable ↔ compact) for every workbook
 * grid. It sets `data-density` on the `.workbook-shell` root, which flips the
 * shared --cell-* CSS tokens, so all tables change row height together.
 */
export default function DensityToggle() {
  const [density, setDensity] = useState<Density>("comfortable");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDensity(readDensity());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const shell = document.querySelector(".workbook-shell");
    if (shell instanceof HTMLElement) shell.dataset.density = density;
    try {
      window.localStorage.setItem(STORAGE_KEY, density);
    } catch {
      // Density still applies in-session if storage is unavailable.
    }
  }, [density, ready]);

  const compact = density === "compact";

  return (
    <button
      type="button"
      onClick={() => setDensity(compact ? "comfortable" : "compact")}
      aria-pressed={compact}
      title={
        compact
          ? "Compact rows — click for comfortable spacing"
          : "Comfortable rows — click for compact spacing"
      }
      aria-label={`Table density: ${compact ? "compact" : "comfortable"}`}
      className="portfolio-density-toggle inline-flex h-6 items-center gap-1 rounded border border-white/20 bg-white/10 px-2 text-[9px] sm:text-[9.25px] font-semibold text-emerald-50 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
    >
      {compact ? <Rows4 size={13} aria-hidden="true" /> : <Rows3 size={13} aria-hidden="true" />}
      <span className="hidden sm:inline">{compact ? "Compact" : "Comfortable"}</span>
    </button>
  );
}
