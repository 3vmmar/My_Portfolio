"use client";

/**
 * The page-scroll lock, deliberately kept in its own module.
 *
 * `lockPageScroll` used to live in SmoothScroll.tsx, whose first three imports
 * are Lenis, gsap and ScrollTrigger. Nav and CommandPalette only want the lock,
 * but importing a value from that module pulled the whole scroll engine into
 * the shared layout chunk — ~64KB gz of animation library reachable from the
 * navigation bar. Splitting the lock out lets the engine be a leaf that only
 * SmoothScroll depends on.
 *
 * The engine registers itself here once it is constructed; before that, and
 * under `prefers-reduced-motion` where Lenis is never built at all, the lock
 * degrades to the plain `overflow` write, which is the correct behaviour for a
 * page that is scrolling natively.
 */

type ScrollEngine = { stop: () => void; start: () => void };

let engine: ScrollEngine | null = null;

/** Called by SmoothScroll with its Lenis instance, and with null on teardown. */
export function registerScrollEngine(next: ScrollEngine | null) {
  engine = next;
}

/**
 * `body { overflow: hidden }` does not stop Lenis — Lenis preventDefaults the
 * wheel and calls `window.scrollTo` itself, so a modal that only sets overflow
 * lets the page scroll ~960px behind it while the modal's own overflowing list
 * refuses to scroll at all. Anything that opens a modal surface must call this.
 */
export function lockPageScroll(locked: boolean) {
  document.body.style.overflow = locked ? "hidden" : "";
  if (locked) engine?.stop();
  else engine?.start();
}
