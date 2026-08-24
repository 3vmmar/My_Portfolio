"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { identity } from "@/lib/content";
import { lockPageScroll } from "@/components/providers/scrollLock";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#selvoria", label: "Selvoria" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only cross the React boundary when the threshold is actually crossed.
    // This fired setLifted on every scroll event; React bails on an identical
    // value, but the call still ran ~60x/s for the life of the page.
    let last = window.scrollY > 24;
    setLifted(last);
    const onScroll = () => {
      const next = window.scrollY > 24;
      if (next !== last) {
        last = next;
        setLifted(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the sheet is open. `overflow: hidden` alone does not
  // stop Lenis, which preventDefaults the wheel and scrolls the window itself.
  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className={`nav ${lifted ? "is-lifted" : ""}`}>
        <div className="nav-inner shell">
          <Link href="/" className="monogram" aria-label={`${identity.name} — home`}>
            <span className="monogram-mark" aria-hidden="true">
              A<i>·</i>A
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="nav-cmd"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-command-palette"))
              }
              aria-label="Open command palette"
            >
              <span className="mono nav-cmd-hint" aria-hidden="true">
                ⌘K
              </span>
              <span className="nav-cmd-text">Search</span>
            </button>

            <a
              className="btn btn-primary nav-resume"
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé
            </a>

            <button
              type="button"
              className="nav-burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span data-open={open} />
              <span data-open={open} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div className={`sheet ${open ? "is-open" : ""}`} hidden={!open}>
        <nav className="sheet-inner" aria-label="Mobile">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="sheet-link display"
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${60 + i * 45}ms` }}
            >
              {l.label}
            </Link>
          ))}
          <a
            className="sheet-link display"
            href={identity.resume}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: `${60 + links.length * 45}ms` }}
          >
            Résumé
          </a>
        </nav>
      </div>
    </>
  );
}
