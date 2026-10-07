"use client";

import {
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { LockKeyhole } from "lucide-react";

const STORAGE_KEY = "portfolio-screen-freeze-v1";
const FREEZE_EVENT = "portfolio-screen-freeze-change";

type FreezeChangeDetail = { screen?: string; frozen?: boolean };

function canonicalScreen(screen: string): string {
  return screen === "buy" || screen === "sell" ? "future" : screen;
}

function isFrozenInStorage(screen: string): boolean {
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

/**
 * Applies a UI-only input lock around one mounted workbook screen. It does not
 * pause React data rendering, periodic refreshes, server mutations initiated
 * elsewhere, or any calculated values. Unfreezing restores all interactions.
 */
export default function ScreenFreezeBoundary({
  screen,
  children,
}: {
  screen: string;
  children: ReactNode;
}) {
  const screenId = canonicalScreen(screen);
  const [frozen, setFrozen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFrozen(isFrozenInStorage(screenId));
  }, [screenId]);

  useEffect(() => {
    const handleFreezeChange = (event: Event) => {
      const detail = (event as CustomEvent<FreezeChangeDetail>).detail;
      if (canonicalScreen(String(detail?.screen || "")) === screenId) {
        setFrozen(detail?.frozen === true);
      }
    };
    window.addEventListener(FREEZE_EVENT, handleFreezeChange);
    return () => window.removeEventListener(FREEZE_EVENT, handleFreezeChange);
  }, [screenId]);

  useEffect(() => {
    if (!frozen) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && rootRef.current?.contains(active)) {
      active.blur();
    }
  }, [frozen]);

  function block(event: MouseEvent | FormEvent | DragEvent | KeyboardEvent) {
    if (!frozen) return;
    event.preventDefault();
    event.stopPropagation();
  }

  function blockInteractivePointer(event: PointerEvent<HTMLDivElement>) {
    if (!frozen) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("button, input, select, textarea, [contenteditable='true']")) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  return (
    <div
      ref={rootRef}
      className={`screen-freeze-boundary ${frozen ? "is-screen-frozen" : ""}`}
      data-screen-freeze-content={screenId}
      aria-disabled={frozen || undefined}
      onClickCapture={block}
      onDoubleClickCapture={block}
      onChangeCapture={block}
      onSubmitCapture={block}
      onDragStartCapture={block}
      onKeyDownCapture={block}
      onPointerDownCapture={blockInteractivePointer}
    >
      {frozen && (
        <div className="screen-freeze-lock-message" role="status">
          <LockKeyhole size={14} aria-hidden="true" />
          <span>
            This screen is frozen. Unfreeze view to add, edit, delete, or update records.
          </span>
          <span className="screen-freeze-lock-detail">
            Live calculations and refreshed values continue.
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
