"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/lib/content";

/**
 * The brass rail.
 *
 * A single line runs the height of the section and fills as you scroll, with a
 * node per role lighting as it is passed — the fixture idea from the hero,
 * applied to a timeline.
 *
 * Two deliberate choices. The rail is `scrub: true`, not a lagged scrub: a
 * progress rail is a readout, and half a second of lag makes it trail your eye.
 * And each row gets ONE trigger driving a small internal sequence — the rail
 * reaches the node, the node lights, then the role reads — rather than two
 * triggers per row animating identically. That halves the trigger count and
 * gives the row cause and effect instead of decoration.
 */
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".xp-rail-fill", { scaleY: 1 });
      gsap.set(".xp-node", { opacity: 1, scale: 1 });
      gsap.set(".xp-row", { opacity: 1, y: 0 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.to(".xp-rail-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".xp-list",
            start: "top 72%",
            end: "bottom 78%",
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".xp-row").forEach((row) => {
          const node = row.querySelector(".xp-node");
          const meta = row.querySelectorAll(".xp-meta > *");
          const body = row.querySelector(".xp-body");

          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 84%", once: true },
          });

          if (node) {
            // A spreading warm shadow reads as illumination; fading opacity on
            // a node reads as "loading".
            tl.fromTo(
              node,
              { scale: 0.6, boxShadow: "0 0 0 4px var(--band)" },
              {
                scale: 1,
                boxShadow:
                  "0 0 0 4px var(--band), 0 0 14px 3px rgb(147 106 61 / 0.4)",
                duration: 0.42,
                ease: "power2.out",
              },
              0,
            );
          }
          if (meta.length) {
            tl.from(
              meta,
              { y: 12, opacity: 0, duration: 0.34, stagger: 0.04, ease: "power1.out" },
              0.1,
            );
          }
          if (body) {
            tl.from(body, { y: 20, opacity: 0, duration: 0.48, ease: "power2.out" }, 0.14);
          }
        });
      }, el);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      className="section experience"
      id="experience"
      ref={root}
      aria-label="Experience"
    >
      <div className="shell">
        <div className="eyebrow">
          <span className="label label-accent">03</span>
          <span className="label">Experience</span>
          <span className="rule" />
          <span className="label mono">{experience.length} roles</span>
        </div>

        <h2 className="h2 xp-title">
          Frontier research, commercial engineering, and teaching — at the same
          time.
        </h2>

        <div className="xp-list">
          <div className="xp-rail" aria-hidden="true">
            <div className="xp-rail-fill" />
          </div>

          <ol>
            {experience.map((r) => (
              <li className="xp-row" key={`${r.company}-${r.title}`}>
                <span className="xp-node" aria-hidden="true" />

                <div className="xp-meta">
                  <p className="label mono xp-period">{r.period}</p>
                  <p className="label xp-mode">{r.mode}</p>
                  {r.current && (
                    <p className="xp-current label">
                      <span className="status-dot" aria-hidden="true" /> Current
                    </p>
                  )}
                </div>

                <div className="xp-body">
                  <h3 className="h3 xp-role">{r.title}</h3>
                  <p className="xp-company">{r.company}</p>
                  <ul className="xp-points">
                    {r.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
