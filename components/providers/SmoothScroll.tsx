"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { registerScrollEngine } from "@/components/providers/scrollLock";

// lockPageScroll now lives in ./scrollLock so that Nav and CommandPalette can
// import it without dragging Lenis, gsap and ScrollTrigger along with it.
// Re-exported here so existing import sites keep working.
export { lockPageScroll } from "@/components/providers/scrollLock";

/**
 * Smooth scroll, driven from GSAP's ticker rather than its own
 * requestAnimationFrame loop.
 *
 * Two rAF loops racing each other is the classic Lenis + ScrollTrigger bug:
 * ScrollTrigger reads a scroll position that Lenis has not written yet, so
 * pinned sections jitter by one frame. Handing Lenis the GSAP ticker gives
 * both one clock, and `lagSmoothing(0)` stops GSAP from silently skipping
 * time when the main thread stalls (which desynchronises scrubbed timelines).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger);

    // Tells the stylesheet that the reveal system is alive. The reveal start
    // state is hidden, and gating it on `scripting: enabled` meant a single
    // failed chunk left 28 content blocks — including the hero name — at
    // opacity 0 forever. With this class the CSS failsafe only fires when the
    // bundle genuinely did not run.
    document.documentElement.classList.add("reveals-armed");

    if (reduced) {
      // No smoothing, no scrubbed timelines. ScrollTrigger still fires so
      // reveal classes resolve to their end state.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    registerScrollEngine(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images change layout height; ScrollTrigger caches it.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore the library default
      lenis.destroy();
      lenisRef.current = null;
      registerScrollEngine(null);
    };
  }, []);

  // A client-side route change must reset scroll and re-measure, or the next
  // page inherits the previous page's ScrollTrigger geometry.
  //
  // Except when the target carries a hash. `usePathname()` does not include
  // the fragment, so an unconditional scrollTo(0) here silently broke every
  // cross-page anchor: all five nav links from any case study landed at the
  // top of the home page instead of the section they name.
  useEffect(() => {
    const hash = window.location.hash;

    if (hash && hash.length > 1) {
      // Re-measure and re-scroll several times, because the target's position
      // is not final when the route commits: fonts swap, images resolve, and
      // ScrollTrigger's pin adds ~630px to the document. A single scroll on
      // the first frame landed ~1,950px short of the section.
      let cancelled = false;

      const goToHash = () => {
        if (cancelled) return;
        const target = document.querySelector(hash);
        if (!target) return;
        const navH =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
          ) || 72;
        const top = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - navH - 16,
        );
        if (Math.abs(window.scrollY - top) < 2) return;
        if (lenisRef.current) lenisRef.current.scrollTo(top, { immediate: true });
        else window.scrollTo(0, top);
      };

      const settle = () => {
        ScrollTrigger.refresh();
        goToHash();
      };

      requestAnimationFrame(settle);
      const timers = [80, 260, 600, 1100].map((ms) => window.setTimeout(settle, ms));
      document.fonts?.ready.then(settle).catch(() => {});

      return () => {
        cancelled = true;
        for (const t of timers) clearTimeout(t);
      };
    }

    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
