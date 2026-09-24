import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form method="post" action="/api/auth" className="m-0">
      <input type="hidden" name="action" value="logout" />
      <button
        type="submit"
        className="inline-flex h-6 items-center gap-1 rounded border border-white/20 bg-emerald-950/25 px-2 text-[9px] font-semibold text-emerald-50 transition hover:bg-white hover:text-emerald-900"
        title="Sign out of Portfolio Tracker"
        aria-label="Sign out"
      >
        <LogOut className="h-3 w-3" aria-hidden="true" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </form>
  );
}
