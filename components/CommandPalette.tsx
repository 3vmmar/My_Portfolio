"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { identity } from "@/lib/content";
import { projects } from "@/lib/projects";
import { lockPageScroll } from "@/components/providers/scrollLock";

type Item = {
  id: string;
  label: string;
  hint: string;
  group: string;
  keywords: string;
  run: () => void;
};

/** Elements outside the dialog that must be inert while it is open. */
const BACKGROUND = ["header.nav", "#main", "footer", ".sheet"];

export default function CommandPalette({ autoOpen = false }: { autoOpen?: boolean }) {
  const router = useRouter();
  // autoOpen is set by CommandPaletteLoader, which owns the key bindings until
  // this chunk exists and mounts it already-open on the first real trigger.
  const [open, setOpen] = useState(autoOpen);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  // When the loader mounts this already-open, nothing has captured the element
  // that had focus when the shortcut fired. The palette input takes focus in a
  // later effect, so document.activeElement is still the trigger right now.
  useEffect(() => {
    if (autoOpen && !restoreFocus.current) {
      restoreFocus.current = document.activeElement as HTMLElement;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    restoreFocus.current?.focus?.();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      if (href.startsWith("http") || href.endsWith(".pdf")) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(href);
    },
    [close, router],
  );

  const items = useMemo<Item[]>(() => {
    const nav: Item[] = [
      { id: "home", label: "Home", hint: "/", group: "Navigate", keywords: "top start hero" },
      { id: "work", label: "Work", hint: "/#work", group: "Navigate", keywords: "projects case studies" },
      { id: "selvoria", label: "Selvoria", hint: "/#selvoria", group: "Navigate", keywords: "company founder ceo labs education" },
      { id: "experience", label: "Experience", hint: "/#experience", group: "Navigate", keywords: "anthropic udacity alignerr ischool outlier career" },
      { id: "about", label: "About", hint: "/#about", group: "Navigate", keywords: "bio education zewail" },
      { id: "skills", label: "Skills", hint: "/#skills", group: "Navigate", keywords: "technical stack python pytorch languages tools" },
      { id: "contact", label: "Contact", hint: "/#contact", group: "Navigate", keywords: "email phone hire" },
    ].map((n) => ({ ...n, run: () => go(n.hint) }));

    const work: Item[] = projects.map((p) => ({
      id: `p-${p.slug}`,
      label: p.title,
      hint: p.subtitle,
      group: "Case studies",
      keywords: `${p.tags.join(" ")} ${p.stack.join(" ")} ${p.kind} ${p.client ?? ""}`,
      run: () => go(`/work/${p.slug}`),
    }));

    const actions: Item[] = [
      {
        id: "resume",
        label: "Download résumé",
        hint: "PDF",
        group: "Actions",
        keywords: "cv pdf download",
        run: () => go(identity.resume),
      },
      {
        id: "email",
        label: "Send an email",
        hint: identity.email,
        group: "Actions",
        keywords: "contact mail write",
        run: () => {
          close();
          window.location.href = `mailto:${identity.email}`;
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: `@${identity.githubHandle}`,
        group: "Actions",
        keywords: "code repos source",
        run: () => go(identity.github),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: identity.linkedinHandle,
        group: "Actions",
        keywords: "profile network professional",
        run: () => go(identity.linkedin),
      },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: identity.email,
        group: "Actions",
        keywords: "clipboard copy",
        run: () => {
          navigator.clipboard?.writeText(identity.email);
          close();
        },
      },
    ];

    return [...nav, ...work, ...actions];
  }, [go, close]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.hint} ${i.group} ${i.keywords}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const r of results) {
      const arr = map.get(r.group) ?? [];
      arr.push(r);
      map.set(r.group, arr);
    }
    return [...map.entries()];
  }, [results]);

  /* Global open shortcut: cmd/ctrl+K, or "/" when not already typing. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Not a toggle: closing via the same shortcut has to run the real
        // close() so focus is restored and the query is cleared.
        if (open) {
          close();
        } else {
          restoreFocus.current = document.activeElement as HTMLElement;
          setOpen(true);
        }
        return;
      }
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        restoreFocus.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);

    const onOpenEvent = () => {
      restoreFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener("open-command-palette", onOpenEvent);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [open, close]);

  /* Lock the page and neutralise the background while open.
     `body { overflow: hidden }` alone does not stop Lenis — it preventDefaults
     the wheel and scrolls the window itself, so the page slid ~960px behind
     the open dialog while its own list refused to scroll. `inert` is what
     actually keeps Tab inside the dialog: aria-modal only hides the
     background from assistive tech, it does not stop focus reaching it. */
  useEffect(() => {
    if (!open) return;

    lockPageScroll(true);
    const neutralised = BACKGROUND.flatMap((sel) =>
      Array.from(document.querySelectorAll<HTMLElement>(sel)),
    );
    for (const el of neutralised) el.inert = true;

    requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      lockPageScroll(false);
      for (const el of neutralised) el.inert = false;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Bound to the dialog, not the input: once focus moved to a row the input's
  // handler stopped firing, so Escape and the arrow keys silently died.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === "Tab") {
      // Wrap within the dialog. `inert` on the background already blocks
      // escape, but wrapping keeps the ring inside a predictable cycle.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Keep the active row inside the scroll viewport.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  let flat = -1;
  const activeId = results[active] ? `cmdk-opt-${results[active].id}` : undefined;

  return (
    <div className="cmdk-backdrop" onMouseDown={close} role="presentation">
      <div
        className="cmdk"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="cmdk-field">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.6-3.6" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a project, section or action…"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-results"
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="mono">esc</kbd>
        </div>

        {/* data-lenis-prevent so the wheel scrolls this list, not the page. */}
        <div
          className="cmdk-list"
          id="cmdk-results"
          ref={listRef}
          role="listbox"
          aria-label="Results"
          data-lenis-prevent
        >
          {grouped.length === 0 && (
            <p className="cmdk-empty">
              Nothing matches <span className="strong">“{query}”</span>.
            </p>
          )}

          {grouped.map(([group, rows]) => (
            <div className="cmdk-group" key={group} role="group" aria-label={group}>
              <p className="label cmdk-group-label" aria-hidden="true">
                {group}
              </p>
              {rows.map((r) => {
                flat += 1;
                const idx = flat;
                return (
                  <button
                    type="button"
                    key={r.id}
                    id={`cmdk-opt-${r.id}`}
                    data-idx={idx}
                    role="option"
                    aria-selected={idx === active}
                    className={`cmdk-row ${idx === active ? "is-active" : ""}`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={r.run}
                  >
                    <span className="cmdk-row-label">{r.label}</span>
                    <span className="cmdk-row-hint mono">{r.hint}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="cmdk-foot">
          <span className="label">
            <kbd className="mono">↑↓</kbd> navigate
          </span>
          <span className="label">
            <kbd className="mono">↵</kbd> open
          </span>
          <span className="label">
            <kbd className="mono">⌘K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
