"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { identity, nowFacts } from "@/lib/content";

/**
 * The atrium.
 *
 * The whole site is staged in the space from the reference photograph: a
 * travertine wall, two brass sconces, a figure standing in front of it. The
 * hero is that space in layers — stone behind, figure in the middle, type in
 * front — parallaxing at different rates so scrolling reads as walking away
 * from a wall rather than as a page moving.
 *
 * On a light ground the lighting model inverts. A bloom has nowhere to go
 * against bone, so the fixtures became opaque brass objects and the light they
 * cast is a *multiplied* wall-wash: the room opens up as the wash recedes,
 * rather than the sconces getting brighter.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Without this branch the name would stay at its hidden start state for
    // anyone who has reduced motion turned on.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".hero-name", { opacity: 1 });
      gsap.set(".hero-name .rv-word", { yPercent: 0, y: 0 });
      gsap.set(".hero-wash", { opacity: 0.42 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        /* --- entrance ------------------------------------------------- */
        const intro = gsap.timeline({
          defaults: { ease: "power2.out" },
          delay: 0.05,
        });

        intro
          .set(".hero-name", { opacity: 1 }, 0)
          .from(".hero-eyebrow > *", {
            yPercent: 130,
            opacity: 0,
            duration: 0.42,
            stagger: 0.05,
          })
          // The words carry no CSS transform, so this axis is GSAP’s alone.
          .fromTo(
            ".hero-name .rv-word",
            { yPercent: 118 },
            { yPercent: 0, duration: 0.64, stagger: 0.038, ease: "expo.out" },
            0.08,
          )
          // Transform-only aperture. A photo cross-fading up from a bone ground
          // reads as a slow JPEG; a counter-moving wrapper and inner pair reads
          // as a curtain opening, and stays on the compositor.
          .from(".hero-portrait-wrap", { yPercent: 8, duration: 1 }, 0.14)
          .from(
            ".hero-portrait img",
            { yPercent: -8, scale: 1.08, duration: 1 },
            0.14,
          )
          // The room opens up: the wash recedes rather than the metal glowing.
          .to(".hero-wash", { opacity: 0.42, duration: 0.9 }, 0.16)
          .from(".hero-roles > *", { y: 14, opacity: 0, duration: 0.4, stagger: 0.06 }, 0.3)
          .from(".hero-statement", { y: 16, opacity: 0, duration: 0.44 }, 0.38)
          .from(".hero-cta > *", { y: 12, opacity: 0, duration: 0.36, stagger: 0.05 }, 0.44)
          .from(".hero-meta", { opacity: 0, duration: 0.4, ease: "power1.out" }, 0.5);

        /* --- scroll depth -------------------------------------------- */
        // Three layers, background slowest. Text is deliberately NOT
        // parallaxed and never faded: the headline, the lead and both CTA
        // buttons are on-screen, focusable and clickable during this scrub, and
        // fading them would be a live contrast failure on live controls.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          })
          .to(".hero-stone", { yPercent: 10, ease: "none" }, 0)
          .to(".hero-portrait-wrap", { yPercent: 18, ease: "none" }, 0)
          .to(".hero-scrollcue", { opacity: 0, ease: "none", duration: 0.12 }, 0);

        /* --- scroll cue --------------------------------------------------
           A short breathing loop, but killed the moment the hero leaves the
           viewport: an infinite tween on an element 6,000px off-screen at
           opacity 0 is pure main-thread cost. */
        const cue = gsap.fromTo(
          ".hero-scrollcue-line",
          { scaleY: 0.35 },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? cue.play() : cue.pause()),
        });
      }, el);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const nameWords = identity.name.split(" ");

  return (
    <section className="hero" ref={root} aria-label="Introduction">
      {/* Layer 1 — the wall */}
      <div className="stone hero-stone" aria-hidden="true" />
      <div className="wall-wash hero-wash" aria-hidden="true" />

      {/* The brass fixtures the wash comes from */}
      <div className="fixture hero-fixture-l" aria-hidden="true" />
      <div className="fixture hero-fixture-r" aria-hidden="true" />

      {/* Layer 2 — the figure, on a deeper plinth so the panel carries the
          transition instead of the photograph being brightened */}
      <div className="hero-portrait-wrap" aria-hidden="true">
        <div className="hero-portrait-plinth" />
        <div className="hero-portrait">
          <Image
            src="/img/ammar-portrait.jpg"
            alt=""
            width={1000}
            height={1250}
            priority
            sizes="(max-width: 900px) 74vw, 36vw"
            quality={88}
          />
        </div>
      </div>

      {/* Layer 3 — the type */}
      <div className="shell hero-copy">
        <p className="hero-eyebrow label">
          <span>{identity.location}</span>
          <span className="hero-eyebrow-sep" aria-hidden="true">
            /
          </span>
          <span className="label-accent">{identity.availability}</span>
        </p>

        <h1
          className="hero-name hero-type"
          aria-label={identity.name}
          data-reveal-words=""
        >
          {nameWords.map((w, i) => (
            <Fragment key={w}>
              <span className="rv-line" aria-hidden="true">
                <span className="rv-word">{w}</span>
              </span>
              {i < nameWords.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h1>

        <div className="hero-roles">
          {identity.roles.map((r) => (
            <p className="hero-role" key={r}>
              {r}
            </p>
          ))}
        </div>

        <p className="hero-statement lead">{identity.statement}</p>

        <div className="hero-cta">
          <a className="btn btn-primary" href="#work">
            See the work
          </a>
          <a
            className="btn btn-ghost"
            href={identity.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé
          </a>
          <button
            type="button"
            className="btn btn-ghost hero-cmd"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          >
            <span className="mono">⌘K</span> anywhere
          </button>
        </div>

        <dl className="hero-meta">
          {nowFacts.map((f) => (
            <div key={f.label}>
              <dt className="label">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-scrollcue" aria-hidden="true">
        <span className="label">Scroll</span>
        <span className="hero-scrollcue-line" />
      </div>
    </section>
  );
}
