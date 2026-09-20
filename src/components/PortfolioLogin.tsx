"use client";

import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function PortfolioLogin() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let current = true;
    fetch("/api/auth", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error || "Unable to check access.");
        return body as { configured: boolean; authenticated: boolean };
      })
      .then((status) => {
        if (!current) return;
        if (status.authenticated) {
          window.location.replace("/");
          return;
        }
        setConfigured(status.configured);
      })
      .catch((error: unknown) => {
        if (current) setMessage(error instanceof Error ? error.message : "Unable to check access.");
      });
    return () => {
      current = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          configured
            ? { action: "login", password }
            : { action: "setup", password, confirmation },
        ),
      });
      const body = await response.json();
      if (!response.ok) {
        if (body?.configured === true) setConfigured(true);
        throw new Error(body?.error || "Unable to sign in.");
      }

      // A full page navigation is deliberate: it waits for the Set-Cookie
      // response to be committed, then sends that HttpOnly cookie to the
      // server-protected ledger route.
      window.location.assign("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
      setSubmitting(false);
    }
  }

  const settingUp = configured === false;
  const loading = configured === null && !message;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#dcefe5,_#edf4f0_42%,_#f7f9f8)] px-5 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,55,39,0.14)]">
        <header className="bg-[#075c36] px-8 py-8 text-white">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <LockKeyhole size={24} aria-hidden="true" />
          </div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">Private ledger</p>
          <h1 className="text-2xl font-bold">Portfolio Tracker</h1>
          <p className="mt-2 text-sm leading-6 text-emerald-50">
            {settingUp ? "Create a password to protect this portfolio." : "Enter your password to access your portfolio."}
          </p>
        </header>

        <div className="px-8 py-7">
          {loading ? (
            <p className="text-sm text-slate-600" role="status">Checking secure access…</p>
          ) : (
            <form className="space-y-5" onSubmit={submit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="portfolio-password">
                  {settingUp ? "Create password" : "Password"}
                </label>
                <input
                  id="portfolio-password"
                  type="password"
                  autoComplete={settingUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  maxLength={256}
                  required
                  autoFocus
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-950 outline-none transition focus:border-[#0b7041] focus:ring-4 focus:ring-emerald-100"
                  placeholder={settingUp ? "At least 8 characters" : "Your password"}
                />
              </div>

              {settingUp && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="portfolio-confirmation">
                    Confirm password
                  </label>
                  <input
                    id="portfolio-confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    minLength={8}
                    maxLength={256}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-950 outline-none transition focus:border-[#0b7041] focus:ring-4 focus:ring-emerald-100"
                    placeholder="Repeat your password"
                  />
                </div>
              )}

              {message && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">{message}</p>
              )}

              <button
                type="submit"
                disabled={submitting || configured === null}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b7041] px-4 py-3 font-semibold text-white transition hover:bg-[#075c36] focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={18} aria-hidden="true" />
                {submitting ? "Signing in…" : settingUp ? "Protect my portfolio" : "Sign in"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
