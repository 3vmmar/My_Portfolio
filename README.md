# Ammar Ahmed — Portfolio

Personal site for **Ammar Ahmed** — AI Engineer, CEO &amp; Founder of Selvoria AI.

Next.js 16 App Router, React 19, TypeScript, vanilla CSS on a three-layer design
token system, GSAP ScrollTrigger + Lenis for motion. Static-rendered, deploys to
Vercel with no runtime services.

---

## The design

Every colour was **measured from a photograph** — `Formal mee.jpg`, Ammar
standing in a travertine atrium under brass sconces — rather than chosen from a
palette:

| Role | Hex | Source in the photo |
|------|-----|---------------------|
| Canvas | `#FBF7F2` | the travertine wall, ~70% of the frame |
| Band | `#EBD8CF` | the same wall, one tone deeper |
| Ink | `#362628` | the picture frame and the floor |
| Accent | `#6B4A26` | the brass sconces |
| Closing band | `#070611` | the suit |

That is also the concept. The site is staged as that room: a stone substrate,
brass fixtures, a figure standing in front of the wall, and scroll that reads as
walking through a lit space. Selected work is a pinned horizontal "gallery
corridor" of framed plaques. The page opens on the travertine and closes in the
dark of the suit — both ends measured from the same image.

Provenance is tracked per value (**M** measured, **D** extrapolated) in
`app/tokens.css` and `assets/design-tokens.json`. Full contrast matrix, type
scale, lighting model and motion rules:
[`docs/brand-guidelines.md`](docs/brand-guidelines.md).

### Three things that are counter-intuitive and load-bearing

**On a light ground, light is depicted by subtraction.** The canvas sits ~2.3 L\*
from white, so an additive glow renders as nothing. The sconces are therefore
opaque brass *objects*, and their light is a `mix-blend-mode: multiply`
wall-wash that darkens everything the fixtures do not reach. The turn-on
animation *recedes* — the room opens up.

**`-webkit-font-smoothing: antialiased` is deliberately absent.** It thins
dark-on-light text a second time on top of the optical thinning a bright ground
already causes. Every measured ratio still reads AAA while the page looks weak —
the worst kind of defect, because the audit passes.

**No `vh` in any vertical spacing value.** A `vh` term makes empty space scale
with the *window*, which has nothing to do with the content: the same page was
~900px taller on a 1080p screen than a 900p one. Vertical rhythm runs on five
`px + vw` clamp tiers (`--rhythm-1..5`).

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

| Script | Does |
|--------|------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (typechecks as part of the build) |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run tokens:check` | The palette guard — see below |
| `npm run verify` | tokens:check → typecheck → build |
| `npm run brand:read` | Prints the parsed brand context from `docs/brand-guidelines.md` |

`tokens:check` is not a formality — it is the only thing standing between this
repo and a silently forked palette. It asserts four things: every primitive
matches between `app/tokens.css` and `assets/design-tokens.json`; every
*semantic* role points at the same primitive in both; every `var(--token)`
reference in the stylesheets **and in the TSX** resolves; and no raw colour
literal has crept into an app stylesheet. Each of those clauses exists because
it caught a real defect — the last one caught deleted tokens in SVG
presentation attributes, which render as black rather than failing loudly.

**Do not run `skills/brand/scripts/sync-brand-to-tokens.cjs`.** It is a starter
generator, not a round-trip tool: it overwrites `assets/design-tokens.json` with
mechanically interpolated ramps that clip to `#FFFFFF`/`#000000` and replaces
the semantic layer with generic `primary`/`secondary` roles. `npm run
tokens:check` catches it, which is how it was caught once already.

---

## Deploy to Vercel

The repo is a stock Next.js app — Vercel needs no configuration file.

1. Push to GitHub.
2. In Vercel, **Add New → Project** and import the repository.
3. Framework preset **Next.js**; leave build command and output directory at
   their defaults.
4. Set one environment variable so canonical URLs, `sitemap.xml`, `robots.txt`
   and the Open Graph image resolve absolutely:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

   Without it the app falls back to `VERCEL_PROJECT_PRODUCTION_URL`, which
   Vercel injects automatically — correct, but the `*.vercel.app` host rather
   than a custom domain.
5. Deploy, add the custom domain, then update `NEXT_PUBLIC_SITE_URL` to match
   and redeploy so the metadata follows.

**Dependencies are pinned to exact versions on purpose.** `next@16.3.2` was
published without its own `@next/env@16.3.2`, so any range that resolves to it
(`^16.3.1` included) fails `npm install` with `ETARGET`. `next` is pinned to
`16.3.1`. Do not loosen these to carets without checking that the target
version's internal packages are actually published.

---

## Structure

```
app/
  layout.tsx              root layout, fonts, metadata, JSON-LD Person
  page.tsx                home — composes the sections
  tokens.css              design tokens: primitive → semantic → component
  globals.css             reset, typography, layout, stone/wash/fixture, reveals
  components.css          site chrome + home sections
  case.css                case studies, diagram, chart, 404
  work/[slug]/page.tsx    case studies (SSG, one per project)
  icon.svg apple-icon.png favicon + Apple touch icon (the convention
                          rejects SVG, so the touch icon is a real PNG)
  sitemap.ts robots.ts    generated from lib/projects.ts
components/
  Nav.tsx Footer.tsx CommandPalette.tsx
  providers/SmoothScroll.tsx     Lenis driven from the GSAP ticker
  sections/                      Hero, Marquee, Work, Selvoria, Experience,
                                 About, Skills, Contact
  ui/Reveal.tsx                  word + block reveals, brass rule
  ui/FlowDiagram.tsx             architecture diagrams as inline SVG
  ui/BarChart.tsx                bar charts as semantic tables
  ui/ReadingProgress.tsx
lib/
  content.ts              identity, experience, skills, Selvoria
  projects.ts             projects + full case-study content
scripts/check-tokens.mjs  the token-consistency guard
assets/design-tokens.json machine-readable export of the token system
docs/brand-guidelines.md  brand source of truth
design-system/            generated design-system reference
skills/                   design-system tooling (excluded from the build)
```

### Four conventions worth knowing before editing

**CSS import order is load-bearing.** `app/layout.tsx` imports the four
stylesheets in dependency order: tokens → globals → components → case. They are
*not* chained with `@import`, because `@import` statements hoist above every
other rule in a file — importing the component sheets from `globals.css` put
them earlier in the cascade than `globals.css`'s own base rules, and
equal-specificity base rules like `.plaque { display: block }` then silently
beat `.work-plaque { display: flex }`. Add a new sheet to the import list, not
to an `@import`.

**One `padding-block` owner per section.** `.section` reads
`--section-pad-t` / `--section-pad-b`. A variant sets those custom properties;
it must not declare `padding-block` again. `.contact` and `.section` previously
both declared it at equal specificity and the larger value won silently — 288px
per side that nobody chose.

**Numerals in display type are set in the sans.** Instrument Serif's figure-1
is a bare stem with no flag and no foot serif, so "ChestX-ray14" rendered as
"ChestX-rayl4" at 56px and "112K+" as "ll2K+". `numerals()` in
`components/ui/Reveal.tsx` wraps digit runs in `.num`; metric values use the
mono, which is unambiguous and tabular.

**A pinned section must be created in a layout effect.** ScrollTrigger's `pin`
reparents the section into a `div.pin-spacer` React never created, so on
navigation React tries to detach it from a parent that no longer owns it and
throws `NotFoundError: removeChild`, killing the root. `useLayoutEffect`
cleanup runs before host nodes are detached, so the spacer unwraps in time.
Clicking a work card was a hard crash until this was fixed.

**Reveal start states live in CSS, never in `gsap.from()`.** `from` records its
start after hydration, so the server HTML paints visible, GSAP yanks it to zero,
and it fades back in — a bright flash on a light page. And never animate a
percentage transform GSAP did not set: `getComputedStyle` reports transforms as a
resolved matrix, so a CSS `translate3d(0, 118%, 0)` reads back as `y: 168px`, and
a tween declared in `yPercent` fights a `y` it never set. That bug hid the
hero headline completely.

**Content is data, not markup.** Everything factual lives in `lib/content.ts`
and `lib/projects.ts`. Adding a project means adding one object to the
`projects` array — the card, the case-study page, the sitemap entry, the
command-palette result and the prev/next links all follow from it. A section can
claim the project's diagram or chart with `figure: "flow" | "chart"`, which
renders it inside the prose that explains it.

---

## Accessibility and quality

Enforced by measurement, not inspection. A CDP harness loads every page at
375 / 768 / 1024 / 1440px, scrolls it to trigger reveals, then checks rendered
text against its rendered background.

- **Contrast** — every text role clears WCAG AA on every ground it is used on.
  Worst case in the system is 4.58:1; body text is 9.17:1, small high-emphasis
  UI 12.88:1. `#936A3D` is restricted to non-text and ≥24px use, and `#C79A4B`
  is a gradient fill only — a decorative glyph is still text to WCAG, so an 8px
  bullet uses the 5.10:1 accent.
- **Touch targets** — nav and controls are ≥44px tall; nothing falls below WCAG
  2.5.8's 24×24 minimum.
- **No horizontal overflow** at any width. Wide content (diagrams, tables)
  scrolls inside its own container.
- **`prefers-reduced-motion`** is a branch, not a switch: every timeline has an
  explicit reduced end state, and the CSS gate for the horizontal work corridor
  includes the reduced-motion clause. Without that clause the script skips the
  pin while the CSS keeps the horizontal row, and the last three project cards
  are clipped and unreachable on a desktop — a real bug this build fixes.
- **Zero emoji used as icons**; all iconography is inline SVG.
- One `<h1>` per page, every image has `alt` and intrinsic dimensions, focus
  rings are restyled but never removed, and split-word headlines expose the
  intact string via `aria-label` with the per-word spans hidden.

Motion notes: Lenis runs off the GSAP ticker with `lagSmoothing(0)` so both
share one clock — two competing `requestAnimationFrame` loops are what make
pinned sections jitter by a frame. The word-level splitter is hand-written
because GSAP's `SplitText` is a paid Club plugin. Progress indicators are
written with `gsap.quickSetter`, not React state per scroll frame, because React
can defer the commit past the frame and that is the mechanism by which a
progress bar drifts behind the scroll. The marquee is keyed to scroll position
rather than a clock: an infinite decorative loop carries no information and the
eye habituates to it in seconds.

---

## Content status

**Selvoria AI's own website is in development.** The site says so where it
matters rather than linking a dead URL; Care Point is presented as the shipped
Selvoria AI system it is, credited to Dr. Ashraf Metwally.

`NOOR`, the concierge described in the Care Point case study, is documented
honestly as a keyword-matched fixed answer set with no language model behind it
yet — the retrieval seam exists so a model can sit there once clinical review
does.

---

© Ammar Ahmed. Résumé: [`public/Ammar_Ahmed_Resume.pdf`](public/Ammar_Ahmed_Resume.pdf)
