import { BarChart3, Database, LockKeyhole, ShieldCheck } from "lucide-react";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/auth";

export default function PortfolioLogin({
  configured,
  error,
}: {
  configured: boolean;
  error?: string;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#eef4f1] px-4 py-10 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(16,185,129,0.16),transparent_30rem),radial-gradient(circle_at_88%_22%,rgba(59,130,246,0.12),transparent_28rem),linear-gradient(150deg,#f8fbf9_0%,#edf4f0_52%,#e7efeb_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(11,112,65,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(11,112,65,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <section className="relative w-full max-w-[430px] overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-[0_28px_80px_-32px_rgba(6,78,48,0.5)]">
        <header className="bg-[linear-gradient(125deg,#064e30_0%,#0b7041_58%,#075c36_100%)] px-7 pb-7 pt-8 text-white">
          <div className="mb-6 flex items-center justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 shadow-inner">
              <BarChart3 className="h-6 w-6" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-950/25 px-3 py-1 text-[11px] font-semibold text-emerald-50">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Private ledger
            </span>
          </div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
            Portfolio Tracker
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            {configured ? "Welcome back" : "Secure your workbook"}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-emerald-50/80">
            {configured
              ? "Enter your password to access accounts, holdings, and transaction history."
              : "Create the password that will protect this private investment workbook."}
          </p>
        </header>

        <form method="post" action="/api/auth" className="space-y-5 px-7 py-7">
          <input
            type="hidden"
            name="action"
            value={configured ? "login" : "setup"}
          />

          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
              {configured ? "Password" : "Create password"}
            </span>
            <span className="relative block">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                minLength={configured ? 1 : MIN_PASSWORD_LENGTH}
                maxLength={MAX_PASSWORD_LENGTH}
                autoComplete={configured ? "current-password" : "new-password"}
                autoFocus
                className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                placeholder={configured ? "Enter your password" : "At least 8 characters"}
              />
            </span>
          </label>

          {!configured ? (
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Confirm password
              </span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="confirmation"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  maxLength={MAX_PASSWORD_LENGTH}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                  placeholder="Enter the same password again"
                />
              </span>
            </label>
          ) : null}

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0b7041] px-4 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(6,95,70,0.8)] transition hover:bg-[#075c36] active:translate-y-px"
          >
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            {configured ? "Unlock portfolio" : "Create password & continue"}
          </button>

          <div className="flex items-start gap-2.5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <p>
              Your password is salted and hashed. Portfolio data and session
              credentials remain server-side.
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
