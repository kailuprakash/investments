"use client";

import { useEffect, useState } from "react";
import { Lock, LockOpen } from "lucide-react";

const STORAGE_KEY = "portfolio-screen-freeze-v1";
const FREEZE_EVENT = "portfolio-screen-freeze-change";

const SCREEN_IDS = [
  "future",
  "inventory",
  "master",
  "accountDetails",
  "market",
  "analytics",
] as const;

function canonicalScreen(screen: string): string {
  return screen === "buy" || screen === "sell" ? "future" : screen;
}

function readFrozen(screen: string): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
    return (parsed as Record<string, unknown>)[screen] === true;
  } catch {
    return false;
  }
}

function writeFrozen(screen: string, frozen: boolean) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const map =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    const next = { ...map, [screen]: frozen };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Toggling still works in-session if browser storage is unavailable.
  }
}

/**
 * Compact freeze indicator embedded inside a workbook tab button. It reflects
 * and toggles the same per-screen lock used by ScreenFreezeBoundary, so freeze
 * state is legible directly on each tab. It never affects calculations,
 * refreshes, or data rendering.
 */
export default function TabFreezeToggle({
  screen,
  active,
}: {
  screen: string;
  active: boolean;
}) {
  const screenId = canonicalScreen(screen);
  const [frozen, setFrozen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFrozen(readFrozen(screenId));
    setReady(true);
  }, [screenId]);

  useEffect(() => {
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ screen?: string; frozen?: boolean }>).detail;
      if (canonicalScreen(String(detail?.screen || "")) === screenId) {
        setFrozen(detail?.frozen === true);
      }
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setFrozen(readFrozen(screenId));
    };
    window.addEventListener(FREEZE_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(FREEZE_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [screenId]);

  function toggle(event: React.MouseEvent<HTMLSpanElement>) {
    // Prevent the parent tab button's onClick from also switching tabs.
    event.preventDefault();
    event.stopPropagation();
    if (!ready) return;
    const nextFrozen = !frozen;
    setFrozen(nextFrozen);
    writeFrozen(screenId, nextFrozen);
    window.dispatchEvent(
      new CustomEvent(FREEZE_EVENT, {
        detail: { screen: screenId, frozen: nextFrozen },
      }),
    );
  }

  return (
    <span
      role="switch"
      tabIndex={0}
      aria-checked={frozen}
      aria-label={`${frozen ? "Unfreeze" : "Freeze"} this screen`}
      title={
        frozen
          ? "Frozen — click to unfreeze this screen's manual edits"
          : "Unfrozen — click to freeze this screen's manual edits"
      }
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          toggle(event as unknown as React.MouseEvent<HTMLSpanElement>);
        }
      }}
      className={`tab-freeze-toggle ${frozen ? "is-frozen" : "is-unfrozen"} ${active ? "is-active-tab" : ""}`}
    >
      {frozen ? <Lock size={11} aria-hidden="true" /> : <LockOpen size={11} aria-hidden="true" />}
    </span>
  );
}

export { SCREEN_IDS };
