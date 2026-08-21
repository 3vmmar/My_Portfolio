"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { numerals } from "@/components/ui/Reveal";

/**
 * The gallery corridor.
 *
 * Desktop pointers get the horizontal-scroll journey: the section pins and the
 * track translates, so vertical scrolling walks you along a wall of framed
 * work. Vertical distance is spent on content moving horizontally, which is
 * the one place on the page where scroll length is earned rather than padded.
 *
 * Everywhere else — narrow viewports, touch, and `prefers-reduced-motion` —
 * the same markup lays out as an ordinary vertical stack. The CSS media query
 * that does this MUST include the reduced-motion and `hover: none` clauses:
 * this component skips creating the pin in those modes, so a gate on width
 * alone left a desktop reduced-motion visitor with five cards in a clipped
 * horizontal row and no way to reach the last three.
 */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  // useLayoutEffect, not useEffect. ScrollTrigger's `pin` wraps this section
  // in a `div.pin-spacer` that React did not create, so on navigation React
  // tries to detach the section from a parent that no longer owns it and
  // throws `NotFoundError: removeChild`, taking the whole root down with it.
  // A layout effect's cleanup runs before host nodes are removed, so
  // `mm.revert()` unwraps the spacer while the tree still matches.
  useLayoutEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;

    gsap.registerPlugin(ScrollTrigger);

    // Matches the CSS gate exactly. `hover: hover` keeps touch tablets out of
    // the corridor: a horizontal swipe there fights native scrolling.
    const mm = gsap.matchMedia();

    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 1025px) and (hover: hover)",
      () => {
        // Chrome omits the end-side padding from scrollWidth on an
        // overflowing flex container, so without adding it back the track
        // opens with a gutter and closes flush against the viewport edge.
        const distance = () => {
          const endPad = parseFloat(getComputedStyle(tr).paddingInlineEnd) || 0;
          return Math.max(0, tr.scrollWidth + endPad - window.innerWidth);
        };

        // Written with quickSetter rather than React state. setState here runs
        // up to 60x/s over a ~120-node subtree, and React may defer the commit
        // past the frame — which is the actual mechanism by which a progress
        // bar drifts behind the scroll.
        const setBar = bar.current
          ? gsap.quickSetter(bar.current, "scaleX")
          : null;
        let lastIndex = -1;

        const tween = gsap.to(tr, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            // The pin must last exactly as long as the horizontal distance, or
            // the track finishes early and the section holds on a dead frame.
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setBar?.(Math.max(0.02, self.progress));
              const i =
                Math.round(self.progress * (projects.length - 1)) + 1;
              if (i !== lastIndex && counter.current) {
                lastIndex = i;
                counter.current.textContent = String(i).padStart(2, "0");
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
    );

    // iOS collapses its URL bar mid-scroll, which changes innerHeight, fires a
    // refresh, and makes a pinned section visibly jump.
    ScrollTrigger.config({ ignoreMobileResize: true });

    return () => mm.revert();
  }, []);

  return (
    <section className="work" id="work" ref={root} aria-label="Selected work">
      <div className="stone" aria-hidden="true" />

      <div className="work-inner">
        <header className="work-head shell">
          <div className="eyebrow">
            <span className="label label-accent">01</span>
            <span className="label">Selected work</span>
            <span className="rule" />
            <span className="label mono">
              <span ref={counter}>01</span>
              {" / "}
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="h2 work-title">Five systems, built end to end.</h2>

          {/* In the head, not the foot. Below the track it sat 43px under the
              fold for the whole pin — invisible exactly while the thing it
              measures was moving, then appearing already full afterwards. */}
          <div className="work-progress" aria-hidden="true">
            <div className="work-progress-track">
              <div className="work-progress-bar" ref={bar} />
            </div>
          </div>
        </header>

        <div className="work-track" ref={track}>
          {projects.map((p) => (
            <article className="work-card" key={p.slug}>
              <Link href={`/work/${p.slug}`} className="plaque work-plaque">
                <header className="work-card-head">
                  <span className="label label-accent">{p.index}</span>
                  <span className="work-card-status">
                    <span
                      className="status-dot"
                      data-status={p.status}
                      aria-hidden="true"
                    />
                    <span className="label">{p.status}</span>
                  </span>
                </header>

                <h3 className="h3 work-card-title">{numerals(p.title)}</h3>
                <p className="work-card-sub muted">{p.subtitle}</p>

                {p.client && (
                  <p className="work-card-client">
                    <span className="label">Client</span>
                    <span>{p.client}</span>
                  </p>
                )}

                <p className="work-card-blurb">{p.blurb}</p>

                <ul className="work-card-metrics">
                  {p.metrics.slice(0, 3).map((m) => (
                    <li key={m.label}>
                      <span className="work-metric-value">{m.value}</span>
                      <span className="work-metric-label">{m.label}</span>
                    </li>
                  ))}
                </ul>

                <ul className="work-card-tags">
                  {p.stack.slice(0, 3).map((s) => (
                    <li className="tag" key={s}>
                      {s}
                    </li>
                  ))}
                  {p.stack.length > 3 && (
                    <li className="tag">+{p.stack.length - 3}</li>
                  )}
                </ul>

                <span className="work-card-open label">
                  Read the case study
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
