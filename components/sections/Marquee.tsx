"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A band of capability names across the wall, driven by scroll position rather
 * than by a clock.
 *
 * This used to be `animation: marquee 42s linear infinite`. A decorative loop
 * carries no information, so the visual system habituates to it in a couple of
 * seconds and files it as noise — and noise on a premium page reads as a
 * template. Keying x to scrollY instead turns the same pixels into a readout of
 * where you are on the page.
 *
 * The skew responds to scroll velocity. It is clamped hard: the app runs
 * `gsap.ticker.lagSmoothing(0)` so that scrubbed timelines stay honest, which
 * means a main-thread stall delivers one frame carrying all the stalled
 * scroll — unclamped, that spikes to an absurd angle.
 *
 * The list repeats content stated elsewhere, so the band is hidden from
 * assistive tech rather than read twice.
 */
const ITEMS = [
  "Multimodal Agents",
  "Computer Vision",
  "LLM Evaluation",
  "Explainable AI",
  "RLHF",
  "Deep Learning",
  "NLP",
  "Edge Systems",
  "Full-Stack",
];

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Exactly -50%: the track holds two identical copies, so half a
        // track-width of travel is seamless.
        const travel = gsap.to(tr, {
          xPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        const setSkew = gsap.quickTo(tr, "skewX", {
          duration: 0.35,
          ease: "power3.out",
        });
        const clamp = gsap.utils.clamp(-4, 4);
        const onStop = () => setSkew(0);
        // Velocity only reports 0 on the next update, so an instantaneous
        // scroll jump left the band permanently sheared at the clamp ceiling.
        // A debounce guarantees it returns to rest.
        const settle = gsap.delayedCall(0.18, onStop).pause();

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            setSkew(clamp(self.getVelocity() / 400));
            settle.restart(true);
          },
          onLeave: onStop,
          onLeaveBack: onStop,
        });

        return () => {
          travel.scrollTrigger?.kill();
          travel.kill();
          st.kill();
          settle.kill();
        };
      }, el);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="marquee" aria-hidden="true" ref={root}>
      <div className="marquee-track" ref={track}>
        {[0, 1].map((copy) => (
          <div className="marquee-run" key={copy}>
            {ITEMS.map((item) => (
              <span className="marquee-item" key={`${copy}-${item}`}>
                <span className="marquee-text">{item}</span>
                <span className="marquee-dot">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
