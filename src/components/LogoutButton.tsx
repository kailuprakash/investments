"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

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
      aria-label="Sign out"
      title="Sign out"
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-white/15 bg-emerald-950/25 text-emerald-100 transition hover:border-red-200/70 hover:bg-red-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={13} aria-hidden="true" className={busy ? "animate-pulse" : ""} />
      <span className="sr-only">{busy ? "Signing out" : "Sign out"}</span>
    </button>
  );
}
