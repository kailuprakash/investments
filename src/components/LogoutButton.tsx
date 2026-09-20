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
      aria-label="Sign out of portfolio"
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-60 sm:bottom-6 sm:right-6"
    >
      <LogOut size={15} aria-hidden="true" />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
