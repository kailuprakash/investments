"use client";

import { useEffect, useMemo, useState } from "react";
import { Pin, PinOff } from "lucide-react";

const STORAGE_KEY = "portfolio-screen-freeze-v1";

type FreezeMap = Record<string, boolean>;

const SCREEN_LABELS: Record<string, string> = {
  future: "Daily Transactions",
  inventory: "Consolidated View",
  master: "Account Summary",
  accountDetails: "Account Details",
  market: "Market Data & Watch",
  analytics: "Visual Analytics",
};

function canonicalScreen(screen: string): string {
  return screen === "buy" || screen === "sell" ? "future" : screen;
}

function readFreezeMap(): FreezeMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([key, value]) => key in SCREEN_LABELS && typeof value === "boolean",
      ),
    ) as FreezeMap;
  } catch {
    return {};
  }
}

/**
 * Controls only the sticky table viewport for the selected workbook screen.
 * It deliberately never disables fields, API calls, derived values, imports,
 * inserts, or market refreshes.
 */
export default function ScreenFreezeToggle({ screen }: { screen: string }) {
  const screenId = canonicalScreen(screen);
  const label = SCREEN_LABELS[screenId] ?? "Current screen";
  const [freezeByScreen, setFreezeByScreen] = useState<FreezeMap>({});
  const [ready, setReady] = useState(false);
  const frozen = freezeByScreen[screenId] !== false;

  useEffect(() => {
    setFreezeByScreen(readFreezeMap());
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.portfolioViewFreeze = frozen ? "on" : "off";
    document.documentElement.dataset.portfolioViewFreezeScreen = screenId;
    return () => {
      delete document.documentElement.dataset.portfolioViewFreeze;
      delete document.documentElement.dataset.portfolioViewFreezeScreen;
    };
  }, [frozen, screenId]);

  const stateText = useMemo(
    () => (frozen ? "Frozen" : "Unfrozen"),
    [frozen],
  );

  function toggleFreeze() {
    setFreezeByScreen((current) => {
      const currentlyFrozen = current[screenId] !== false;
      const next = { ...current, [screenId]: !currentlyFrozen };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // The visual toggle still works if browser storage is unavailable.
      }
      return next;
    });
  }

  return (
    <div className="screen-freeze-control" data-screen={screenId}>
      <div className="screen-freeze-status" aria-live="polite">
        <span className={`screen-freeze-dot ${frozen ? "is-frozen" : "is-unfrozen"}`} />
        <span>{label}: {stateText}</span>
      </div>
      <button
        type="button"
        onClick={toggleFreeze}
        disabled={!ready}
        aria-pressed={frozen}
        title={
          frozen
            ? "Unfreeze this screen's table headers and anchor columns. Data updates stay active."
            : "Freeze this screen's table headers and anchor columns. Data updates stay active."
        }
      >
        {frozen ? <PinOff size={14} aria-hidden="true" /> : <Pin size={14} aria-hidden="true" />}
        {frozen ? "Unfreeze view" : "Freeze view"}
      </button>
      <span className="screen-freeze-note">Data, calculations & inserts stay active</span>
    </div>
  );
}
