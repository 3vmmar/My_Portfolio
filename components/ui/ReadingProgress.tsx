"use client";

import { useEffect, useRef } from "react";

/**
 * A brass hairline under the nav that tracks how far through the article you
 * are.
 *
 * Writes `scaleX` straight to the element instead of going through React state.
 * A setState per scroll frame re-renders the subtree up to 60x/s and React can
 * defer the commit past the frame — which is the mechanism by which a progress
 * indicator ends up lagging behind the scroll and being wrong about where the
 * reader is. There is no CSS transition on the bar for the same reason.
 *
 * The write is a plain `style.transform`. It was `gsap.quickSetter`, which
 * meant this component — the only reason GSAP appeared on the case-study route
 * outside the reveal system — pulled in the whole core plus CSSPlugin for one
 * call. `.readprog-bar` already declares `transform-origin: left` and carries
 * no other transform, so the two are equivalent.
 */
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;

    // `scrollHeight` is a layout read, and it used to sit inside the rAF
    // callback directly before the style write — forcing a synchronous layout
    // on every frame of every scroll. The document only changes height when the
    // viewport resizes, fonts swap or images resolve, so measure on those.
    let max = 0;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };

    let frame = 0;
    const write = () => {
      frame = 0;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    const remeasure = () => {
      measure();
      onScroll();
    };

    measure();
    write();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});

    // Reveals and the pinned gallery both change document height after mount,
    // and neither fires resize.
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="readprog" aria-hidden="true">
      <div className="readprog-bar" ref={bar} />
    </div>
  );
}
