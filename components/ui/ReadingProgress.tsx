"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A brass hairline under the nav that tracks how far through the article you
 * are.
 *
 * Writes `scaleX` straight to the element with a quickSetter instead of going
 * through React state. A setState per scroll frame re-renders the subtree up to
 * 60x/s and React can defer the commit past the frame — which is the mechanism
 * by which a progress indicator ends up lagging behind the scroll and being
 * wrong about where the reader is. There is no CSS transition on the bar for
 * the same reason.
 */
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const set = gsap.quickSetter(el, "scaleX") as (v: number) => void;

    let frame = 0;
    const write = () => {
      frame = 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="readprog" aria-hidden="true">
      <div className="readprog-bar" ref={bar} />
    </div>
  );
}
