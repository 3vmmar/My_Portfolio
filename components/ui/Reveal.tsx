"use client";

import {
  Fragment,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * One shared promise for font readiness.
 *
 * Two problems are solved by gating reveal creation on this. ScrollTrigger
 * caches element geometry when a trigger is created; Instrument Serif has a
 * large metric delta against its Georgia fallback, so a trigger created
 * pre-swap can compute a start position that is wrong by a whole line. And a
 * trigger that has *already fired* against pre-swap geometry stays fired —
 * `ScrollTrigger.refresh()` does not un-fire it — so on a slow connection some
 * blocks reveal while off-screen and are simply visible when you arrive.
 */
let fontsReady: Promise<unknown> | null = null;
function whenFontsReady() {
  if (!fontsReady) {
    fontsReady =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();
  }
  return fontsReady;
}

/* -------------------------------------------------------------------------- */
/* Block reveal — fade + short rise, scoped to its own container.             */
/* -------------------------------------------------------------------------- */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  as: Tag = "div",
  className,
  stagger,
  duration = 0.5,
  ease = "power2.out",
  start = "top 86%",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  /** When set, animates direct children in sequence instead of the box itself. */
  stagger?: number;
  duration?: number;
  ease?: string;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : el;
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;

    if (prefersReduced()) {
      gsap.set(el, { opacity: 1 });
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // The start state is in CSS (`[data-reveal] { opacity: 0 }`), so this is a
    // `to`, not a `from`. A `from` sets its start state at construction — i.e.
    // after hydration — which means the server HTML paints fully opaque, GSAP
    // yanks it to 0 and it fades back: a bright flash on a light page.
    whenFontsReady().then(() => {
      if (cancelled || !ref.current) return;
      if (stagger) gsap.set(el, { opacity: 1 });
      gsap.set(targets, { opacity: 0, y });

      tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        // Past ~8 children a stagger stops reading as sequence and reads as lag.
        stagger: stagger ? Math.min(stagger, 0.06) : 0,
        scrollTrigger: {
          trigger: el,
          start,
          // `once` only self-kills at progress 1, and a trigger near the page
          // bottom can have a computed end past max scroll — so it would never
          // reach 1 and would stay in the update loop for the page's life.
          end: "bottom top",
          once: true,
        },
      });
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [delay, y, stagger, duration, ease, start]);

  const Component = Tag as ElementType;
  return (
    <Component ref={ref} className={className} data-reveal="">
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Word reveal — per-word rise out of a clipping line.                        */
/*                                                                            */
/* GSAP's SplitText is a paid Club plugin, so the split is done here. Two      */
/* accessibility consequences are handled explicitly: the visible spans are    */
/* hidden from the accessibility tree, and the intact string is exposed once   */
/* via aria-label, so a screen reader reads a sentence and not a word list.    */
/* -------------------------------------------------------------------------- */
export function WordReveal({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  stagger = 0.038,
  duration = 0.64,
  start = "top 85%",
  accentWords,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  /** Words rendered in brass. Matched case-insensitively, punctuation ignored. */
  accentWords?: string[];
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".rv-word");
    if (!words.length) return;

    if (prefersReduced()) {
      gsap.set(el, { opacity: 1 });
      gsap.set(words, { yPercent: 0, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;

    whenFontsReady().then(() => {
      if (cancelled || !ref.current) return;
      // The parent's opacity is the no-flash start state; the words carry no
      // CSS transform at all, so GSAP owns this axis with no unit ambiguity.
      gsap.set(el, { opacity: 1 });
      tween = gsap.fromTo(
        words,
        { yPercent: 118 },
        {
          yPercent: 0,
          duration,
          delay,
          ease: "expo.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [delay, stagger, duration, start, text]);

  // Both sides must be normalised the same way, or "works." from the caller
  // never matches the stripped "works" taken from the text.
  const bare = (w: string) => w.replace(/[^\p{L}\p{N}-]/gu, "").toLowerCase();
  const accents = new Set((accentWords ?? []).map(bare));
  const words = text.split(" ");
  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={className}
      aria-label={text}
      data-reveal-words=""
    >
      {words.map((word, i) => {
        const isAccent = accents.has(bare(word));
        return (
          // The separating space is a text node BETWEEN the lines, not the last
          // character inside one. `.rv-line` clips with `overflow: hidden`, and
          // inline layout trims a trailing space at the edge of that box — which
          // ran whole headlines together as "Let'sbuildsomethingthat".
          <Fragment key={`${word}-${i}`}>
            <span className="rv-line" aria-hidden="true">
              <span className={isAccent ? "rv-word rv-accent" : "rv-word"}>
                {numerals(word)}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Component>
  );
}

/**
 * Sets digit runs in the sans.
 *
 * Instrument Serif ships one 400 cut whose figure-1 is a bare stem with no
 * flag and no foot serif, so "ChestX-ray14" reads as "ChestX-rayl4" at
 * display size — the most-read text on that page looking like a typo.
 */
export function numerals(text: string) {
  const parts = text.split(/(\d[\d,.]*)/g).filter(Boolean);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^\d/.test(part) ? (
      <span className="num" key={i}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Brass rule that draws itself in from the left.                             */
/*                                                                            */
/* 0.56s power2.out, not 1.1s expo.out. expo.out covers ~86% of its distance  */
/* in the first 25% of its duration, so a long one arrives almost immediately  */
/* and then creeps — the same visual signature as a dropped frame.             */
/* -------------------------------------------------------------------------- */
export function BrassRule({
  className,
  duration = 0.56,
}: {
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      gsap.set(el, { scaleX: 1 });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;

    whenFontsReady().then(() => {
      if (cancelled || !ref.current) return;
      tween = gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "bottom top",
            once: true,
          },
        },
      );
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [duration]);

  return <div ref={ref} className={`brass-rule ${className ?? ""}`} aria-hidden="true" />;
}
