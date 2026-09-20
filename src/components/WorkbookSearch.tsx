"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { searchWorkbook, type WorkbookHit } from "@/lib/workbook-search";

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
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => searchWorkbook(hits, query), [hits, query]);

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
              No symbols or accounts match “{query.trim()}”.
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
