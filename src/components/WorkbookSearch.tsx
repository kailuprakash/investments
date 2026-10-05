"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  buildExtraHits,
  searchWorkbook,
  type WorkbookHit,
} from "@/lib/workbook-search";

export default function WorkbookSearch({
  hits,
  onJump,
}: {
  hits: WorkbookHit[];
  onJump: (hit: WorkbookHit) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [extraHits, setExtraHits] = useState<WorkbookHit[]>([]);
  const extrasLoaded = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const allHits = useMemo(() => [...hits, ...extraHits], [hits, extraHits]);
  const matches = useMemo(() => searchWorkbook(allHits, query), [allHits, query]);

  // Planner/comments/deposit notes load once, on first search focus, and
  // stay cached — the core symbol/account hits arrive instantly from props.
  useEffect(() => {
    if (!open || extrasLoaded.current) return;
    extrasLoaded.current = true;
    void (async () => {
      try {
        const [plannerRes, detailsRes] = await Promise.all([
          fetch("/api/planner", { cache: "no-store" }),
          fetch("/api/account-details", { cache: "no-store" }),
        ]);
        const planner = plannerRes.ok ? await plannerRes.json() : null;
        const details = detailsRes.ok ? await detailsRes.json() : null;
        const depositsByAccount = details?.depositsByAccount as
          | Record<string, Array<Record<string, unknown>>>
          | undefined;
        const deposits = depositsByAccount
          ? (Object.values(depositsByAccount).flat() as {
              id: number;
              accountNumber?: string;
              dateInvested?: string;
              amount?: number;
              comments?: string;
            }[])
          : null;
        setExtraHits(
          buildExtraHits(planner ?? undefined, {
            accounts: details?.accountDetails ?? null,
            deposits,
          }),
        );
      } catch {
        /* Extra coverage is a bonus — core hits keep working offline. */
      }
    })();
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typingInField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (typingInField) return;
      if (
        event.key === "/" ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")
      ) {
        event.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function jump(hit: WorkbookHit) {
    onJump(hit);
    setQuery("");
    setOpen(false);
    input.current?.blur();
  }

  return (
    <div className="workbook-search" ref={root}>
      <Search size={14} aria-hidden="true" />
      <input
        ref={input}
        type="search"
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-controls="workbook-search-results"
        aria-autocomplete="list"
        aria-activedescendant={
          matches[active] ? `workbook-search-${matches[active].id}` : undefined
        }
        aria-label="Search workbook by symbol or account"
        placeholder="Search symbol or account"
        value={query}
        autoComplete="off"
        spellCheck={false}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((index) =>
              matches.length ? (index + 1) % matches.length : 0,
            );
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((index) =>
              matches.length
                ? (index - 1 + matches.length) % matches.length
                : 0,
            );
          } else if (event.key === "Enter") {
            event.preventDefault();
            if (matches[active]) jump(matches[active]);
          } else if (event.key === "Escape") {
            setOpen(false);
            setQuery("");
          }
        }}
      />
      {open && query.trim() && (
        <div
          id="workbook-search-results"
          className="workbook-search-results"
          role="listbox"
        >
          {matches.length === 0 ? (
            <p className="workbook-search-empty" role="status">
              Nothing matches “{query.trim()}" in the workbook.
            </p>
          ) : (
            matches.map((hit, index) => (
              <button
                key={hit.id}
                type="button"
                id={`workbook-search-${hit.id}`}
                role="option"
                aria-selected={index === active}
                className={index === active ? "is-active" : undefined}
                onMouseEnter={() => setActive(index)}
                onClick={() => jump(hit)}
              >
                <strong>{hit.title}</strong>
                <span>
                  {hit.subtitle} · {hit.sheetLabel}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
