# Brand Guidelines v2.0 — Ammar Ahmed

> Last updated: 2026-08-22
> Status: Active
> Supersedes v1.0 (midnight canvas). Same provenance, inverted ground.
> Derived from: `Formal mee.jpg` — measured pixel sampling of a travertine
> atrium, brass sconces, and a midnight suit.

## Quick Reference

| Element | Value |
|---------|-------|
| Canvas | #FBF7F2 |
| Ink | #362628 |
| Accent | #6B4A26 |
| Primary Font | Instrument Serif |
| Voice | Precise, Considered, Quietly Ambitious |

---

## 1. Color Palette

Nothing here was invented. The travertine wall behind the subject occupies
**~70% of the reference photograph**, which is why a warm-stone canvas is more
faithful to the source than the midnight canvas this replaced. The suit and the
picture frame supply the ink; the sconces supply the only accent.

Provenance is tracked per value: **M** = pixel-measured from the photograph,
**D** = arithmetic extrapolation of a measured ramp. Never claim D as measured.

### Primary Colors — the grounds

| Name | Hex | Prov. | Usage |
|------|-----|-------|-------|
| Card | #FCFAF8 | D | Lifted surfaces — cards, palette, plaques |
| Canvas | #FBF7F2 | D | The page. Hero, Selvoria, About, case bodies |
| Surface Hover | #F6EDE6 | D | Hover fills only |
| Band | #EBD8CF | M | The alternating rhythm step — Work, Experience, Skills |
| Band Deep | #E2CABF | M | Plinths, the marquee, the case-study closing band |
| Invert | #362628 | M | Reserved |
| Invert Deep | #070611 | M | The one dark band: Contact + footer |

### Neutral Palette — ink

| Name | Hex | Prov. | Usage |
|------|-----|-------|-------|
| Text / Display | #362628 | M | Body copy and every display line |
| Text Secondary | #4A3436 | D | Leads, pull quotes |
| Text Strong | #070611 | M | Small high-emphasis UI — values, `dd`, contact rows |
| Text Muted | #6B5245 | D | Captions, labels, tags, metric notes |

Two near-blacks are one role split, not two colours: `#070611` and `#362628`
are 1.29:1 apart, imperceptible at any size. Espresso reads on light; midnight
carries small UI where irradiation, not mass, is the risk.

### Secondary Colors — brass

Brass is a **material** here, not a highlight. On a light ground its bright
stops cannot carry text at all, so they appear only inside gradients, and every
boundary and label is carried by the dark stops.

| Name | Hex | Prov. | Usage |
|------|-----|-------|-------|
| Accent | #6B4A26 | D | Links, CTAs, section numbers, small glyphs |
| Accent Hover | #5A3D1E | D | Hover |
| Accent Press | #4A3116 | D | Pressed, occluded metal edge |
| Accent Large | #936A3D | M | **Non-text and ≥24px only** — rules, nodes, borders |
| Metal | #C79A4B | M | **Fill only** — 1.65:1, never ink, never a boundary |
| Metal Sheen | #F0DCAE | D | Specular stop inside a gradient |
| Glass | #FFFDF6 / #FDF2D6 | D | The lit slot inside a fixture — see §4 |

### Lines

| Name | Hex | Usage |
|------|-----|-------|
| Hairline | #E2CABF | Decorative dividers (1.4.11-exempt) |
| Border | #D9BEAE | Card edges — never the sole affordance |
| Border Control | #6B5245 | Any boundary that identifies a control (4.60:1) |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #41602B | Shipped, live, current |
| Warning | #6E4A0E | In progress, roadmap |
| Error | #8E2F26 | Errors, destructive |
| Info | #3F4D6B | Research status, informational |

All four were re-derived for a light ground. The dark-theme values landed
between 2.2:1 and 3.9:1 here and would have failed silently.

### Accessibility — measured, not asserted

Worst-case contrast for every text role, across all four grounds
(canvas / card / band / band-deep):

| Role | Worst | Verdict |
|------|-------|---------|
| Text Strong #070611 | 12.88:1 | AAA |
| Text / Display #362628 | 9.17:1 | AAA |
| Text Secondary #4A3436 | 7.32:1 | AAA |
| Accent Press #4A3116 | 7.71:1 | AAA |
| Accent #6B4A26 | 5.10:1 | AA |
| Info #3F4D6B | 5.41:1 | AA |
| Error #8E2F26 | 5.20:1 | AA |
| Warning #6E4A0E | 5.07:1 | AA |
| Text Muted #6B5245 | 4.60:1 | AA |
| Success #41602B | 4.58:1 | AA |

On the inverted band, Canvas on Invert Deep is **18.87:1** and Brass 300 on
Invert Deep is **10.36:1**.

**The worst text role in the system is 4.58:1.** Every role clears AA on every
ground it is used on. These figures are re-measured on *rendered pixels* at
375 / 768 / 1024 / 1440px by the audit harness — they are not trusted from this
table, and the table is wrong the moment a token changes without the audit
being re-run.

Two rules that exist because breaking them fails silently:

- A decorative glyph is still **text** to WCAG. A bullet diamond at 8px needs
  4.5:1, so those use Accent, not Accent Large.
- Metal (#C79A4B) fails every threshold *by design*. It is a fill inside a
  gradient. If it ever carries a label or a boundary, that is a defect.

---

## 2. Typography

### Font Stack

```css
--font-heading: 'Instrument Serif', 'Iowan Old Style', Georgia, serif;
--font-body: 'Geist', 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
```

Unchanged from v1.0, and deliberately so: an editorial display serif, a neutral
grotesque for reading and UI, and a mono restricted to labels, dates, metrics
and section numbering. Geist stays specifically because it carries a full
100–900 weight axis where Instrument Serif carries none.

### Type Scale

| Role | Size | Leading | Tracking | Family |
|------|------|---------|----------|--------|
| Hero | clamp(3rem, 11vw, 10rem) | 0.90 | −0.042em | Display |
| H1 | clamp(2.25rem, 5.6vw, 5rem) | 1.00 | −0.030em | Display |
| H2 | clamp(1.875rem, 3.6vw, 3rem) | 1.08 | −0.024em | Display |
| H3 | clamp(1.3rem, 1.9vw, 1.6875rem) | 1.26 | −0.012em | Display |
| Lead | clamp(1.0625rem, 1.6vw, 1.3125rem) | 1.60 | −0.005em | Body |
| Body | 1rem | 1.70 | 0 | Body |
| Caption | 0.875rem | 1.55 | 0 | Body |
| Label | 0.75rem | 1.35 | 0.15em | Mono, caps |
| Tag | 0.6875rem | 1.30 | 0.10em | Mono, caps |

### Optical adjustments for a light ground

Tracking is tighter and display leading looser than v1.0 used. On a bright
field the ground bleeds into counters and sidebearings, so identical tracking
reads *looser* and identical leading reads *tighter* than it did on midnight.

Display leading below 1.1 is a **documented exception** to the general 1.1–1.3
guidance, and applies only to the hero and H1–H2.

**Label minimum is 12px.** v1.0 used 11px, which broke the caption floor.

### Font smoothing

`-webkit-font-smoothing: antialiased` is **deliberately absent**, and the
absence is load-bearing. Forcing grayscale antialiasing discards sub-pixel stem
information. Light-on-dark blooms, so thinning it back is correct — that is why
v1.0 set it. Dark-on-light is the inverse: the text is already optically thinned
by irradiation against a bright field, and antialiasing it again makes the whole
body layer spindly and grey *while every measured ratio still reads AAA*. That
is the worst class of defect, because the audit passes and the page looks weak.

If a dark theme ever returns, scope `antialiased` inside the dark selector only.
Never assume light-mode values carry over.

---

## 3. Voice & Tone

### Brand Personality

| Trait | Meaning |
|-------|---------|
| **Precise** | Numbers over adjectives; every claim checkable |
| **Considered** | Long-form where substance earns it, silent where it does not |
| **Quietly ambitious** | The scale of the work speaks; the copy does not shout |

### Voice Attributes

**Precise.** Numbers over adjectives. "112,120 X-rays, 12 architectures" not
"a large dataset and many models". Every claim is checkable.

**Considered.** Long-form where the substance earns it, silent where it does
not. No filler enthusiasm, no exclamation marks.

**Quietly ambitious.** The scale of the work speaks; the copy does not shout it.
State what was built and what it does. Let the reader draw the conclusion.

### Tone Rules

| Do | Don't |
|----|-------|
| "Built a real-time multimodal agent." | "Passionate about cutting-edge AI!" |
| "12 architectures, 4 XAI methods." | "Extensive model experimentation." |
| Name the constraint that shaped the design. | Claim results without the mechanism. |
| Say when something is not built yet. | Imply a roadmap item already ships. |

---

## 4. Light, Texture and Depth

**On a light ground, light is depicted by subtraction.** The canvas sits ~2.3
L\* from pure white, so there is almost no headroom for an additive bloom — the
glow that carried v1.0 renders as literally nothing here. Three consequences:

**The sconce becomes an object.** `.fixture` is an opaque brass bar with an
11-stop gradient, an inset bright top edge, an inset occluded bottom edge, a
contact shadow and a cast shadow. Its dark stops carry the silhouette, so the
object clears 3:1 even though its brightest stops are 1.1:1. Its aperture reads
as *emitting* because near-white against brass is a ~4.8:1 **local** jump — the
only reason a near-white is permitted anywhere on the page.

**The glow becomes a wall-wash.** `.wall-wash` is a multiply layer: two warm
radial gradients that *darken everything the fixtures do not reach*. Where both
are transparent the canvas shows at full brightness. Multiplying warm amber over
bone yields a warmer, slightly darker cream — physically what travertine does
under a brass sconce. The turn-on animation therefore *recedes* rather than
brightening: the room opens up.

**Travertine multiplies, never blends luminosity.** A `luminosity` blend
overwrites the canvas lightness with the photograph's mid-grey while keeping the
canvas chroma, and the page turns dishwater. The filter chain
(`grayscale(.32) sepia(.14) brightness(1.36) contrast(.74)`) compresses the tile
into roughly the 0.90–1.00 luminance band so a 42% multiply subtracts only
~0–8%.

**Shadows are warm and shallow.** On bone the shadow is the only dark thing on
the page and reads 3–4× heavier than the same alpha did on midnight. The usable
range is **0.05–0.22**, not 0.6–0.9, and every shadow is tinted with espresso —
neutral grey goes muddy over a warm ground.

**The photograph needs no help.** v1.0 darkened both portraits (`brightness(0.9)`
and `brightness(0.66)`) because the suit had almost no luminance separation from
a midnight ground. On bone the suit is 18.87:1 and the silhouette is the
strongest shape on the site for free. The figure is seated on a `band-deep`
plinth with a contact shadow rather than being brightened toward the canvas —
brightening it would grey the suit as a side effect.

---

## 5. Vertical Rhythm

Five tiers, driven by **px + vw, never vh**:

```css
--rhythm-1: 1.5rem;                                  /* inside a component  */
--rhythm-2: 2rem;                                    /* between components  */
--rhythm-3: clamp(2.5rem, 1.5rem + 2.6vw, 4rem);     /* tight section       */
--rhythm-4: clamp(3.25rem, 2rem + 3.4vw, 5rem);      /* section             */
--rhythm-5: clamp(4.5rem, 2.5rem + 5.5vw, 7.5rem);   /* chapter             */
```

A `vh` term makes empty space scale with the **window**, which has nothing to do
with the content — the same page grew ~900px taller on a 1080p screen than on a
900p one purely because the window was bigger. That was the mechanical cause of
"too many empty pages".

**One `padding-block` declaration governs every section.** `.section` reads from
`--section-pad-t` / `--section-pad-b`, so a variant sets a custom property
rather than adding a competing declaration. This exists because `.contact` and
`.section` previously both declared `padding-block` at equal specificity, and
the larger value won silently — 288px per side that nobody had chosen.

**Space must be earned.** A section that reserves width or height it does not
fill is a defect, not restraint: a 12rem sticky label column carrying 16
characters of mono, blank for a whole page, was 1.58 million blank pixels
scrolling past on every case study.

---

## 6. Motion

Motion is architectural, not decorative. It exists to convey moving through a lit
space.

- **One clock.** Lenis runs off the GSAP ticker with `lagSmoothing(0)`. Two
  competing rAF loops are what make pinned sections jitter by a frame.
- **Start states live in CSS**, not in `gsap.from()`. `from` records its start
  after hydration, so the server HTML paints visible, GSAP yanks it to zero and
  it fades back — a bright flash on every block of a light page.
- **Never animate a percentage transform GSAP did not set.**
  `getComputedStyle` reports transforms as a resolved matrix, so a CSS
  `translate3d(0, 118%, 0)` is read as `y: 168px` and a tween declared in
  `yPercent` fights a `y` it never set. The words silently never move.
- **Never fade live text or controls.** Beyond the readability cost it is a
  live contrast failure on focusable elements while they are on screen.
- **Never animate a layout property.** `gap`, `width`, `padding` reflow;
  `transform` and `opacity` do not.
- **Scroll-driven, not clock-driven,** wherever the motion is decorative. An
  infinite loop carries no information and habituates in seconds; the same
  pixels keyed to scroll position become a readout of where you are.
- **`prefers-reduced-motion` is a branch, not a switch.** Every timeline needs
  an explicit reduced-motion end state — and the CSS gate for any layout the
  script skips must include the reduced-motion clause, or content becomes
  unreachable.
- Reveals: 400–700ms, `expo.out` for word rises, `power2.out` for blocks.
  Beats overlap 30–50%; a beat starting exactly when the previous ends reads as
  a queue, not a gesture.
