"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

/** Compact header control. It intentionally has no visible text label. */
export default function LogoutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      aria-label="Sign out of portfolio"
      title="Sign out"
      className="portfolio-header-signout inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-white/20 bg-white/10 text-emerald-50 transition hover:border-red-200/60 hover:bg-red-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/75 disabled:cursor-wait disabled:opacity-60"
    >
      <LogOut size={14} aria-hidden="true" className={busy ? "animate-pulse" : ""} />
    </button>
  );
}
