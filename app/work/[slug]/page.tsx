import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, projectBySlug, adjacentProjects } from "@/lib/projects";
import { identity } from "@/lib/content";
import { Reveal, WordReveal, BrassRule } from "@/components/ui/Reveal";
import FlowDiagram from "@/components/ui/FlowDiagram";
import BarChart from "@/components/ui/BarChart";
import ReadingProgress from "@/components/ui/ReadingProgress";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return { title: "Not found" };

  return {
    title: `${p.title} — ${p.subtitle}`,
    description: p.blurb,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: `${p.title} — ${p.subtitle}`,
      description: p.blurb,
      type: "article",
      url: `/work/${p.slug}`,
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          // The card depicts Ammar, not the project — describe what is in it.
          alt: `${identity.name} — AI Engineer, CEO & Founder of Selvoria AI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} — ${p.subtitle}`,
      description: p.blurb,
      images: ["/og.jpg"],
    },
  };
}

/**
 * Case study.
 *
 * Structure note: this used to be twelve separately padded blocks with eleven
 * interior seams, and a 12rem sticky label column running blank down the whole
 * page. Five merges brought it to seven blocks —
 *
 *   metrics  -> into the hero, one hairline under the facts they belong to
 *   summary  -> merged with the problem, one continuous read in one voice
 *   flow/chart -> figures inside the section whose prose explains them
 *   stack    -> a footer row of the outcome block
 *   next     -> keeps its own band, on a different surface
 *
 * — and the label column now only survives on the numbered body sections,
 * where the number is genuinely the reader's position indicator.
 */
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const { prev, next } = adjacentProjects(p.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    headline: `${p.title} — ${p.subtitle}`,
    description: p.blurb,
    dateCreated: p.year,
    creator: { "@type": "Person", name: identity.name },
    keywords: [...p.tags, ...p.stack].join(", "),
    ...(p.client ? { about: p.client } : {}),
  };

  // A figure a section did not claim still has to appear somewhere, so it
  // falls to the last section rather than being silently dropped.
  const claimed = new Set(p.sections.map((s) => s.figure).filter(Boolean));
  const orphanFigures: ("flow" | "chart")[] = [
    ...(p.flow && !claimed.has("flow") ? (["flow"] as const) : []),
    ...(p.chart && !claimed.has("chart") ? (["chart"] as const) : []),
  ];

  const renderFigure = (kind: "flow" | "chart" | undefined) => {
    if (kind === "flow" && p.flow) {
      return (
        <Reveal className="case-figure">
          <FlowDiagram
            title={p.flow.title}
            caption={p.flow.caption}
            nodes={p.flow.nodes}
            edges={p.flow.edges}
          />
        </Reveal>
      );
    }
    if (kind === "chart" && p.chart) {
      return (
        <Reveal className="case-figure">
          <BarChart
            title={p.chart.title}
            caption={p.chart.caption}
            unit={p.chart.unit}
            series={p.chart.series}
          />
        </Reveal>
      );
    }
    return null;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ReadingProgress />

      <article className="case">
        {/* ------------------------------------------- HERO (+ metrics) */}
        <header className="case-hero">
          <div className="stone" aria-hidden="true" />
          <div className="shell case-hero-inner">
            <nav className="case-crumbs" aria-label="Breadcrumb">
              <Link href="/" className="label">
                Home
              </Link>
              <span className="label case-crumb-sep" aria-hidden="true">
                /
              </span>
              <Link href="/#work" className="label">
                Work
              </Link>
              <span className="label case-crumb-sep" aria-hidden="true">
                /
              </span>
              <span className="label label-accent">{p.title}</span>
            </nav>

            <h1 className="hero-type case-title">
              <WordReveal text={p.title} as="span" delay={0.06} />
            </h1>

            <p className="case-subtitle h3">{p.subtitle}</p>

            <dl className="case-facts">
              <div>
                <dt className="label">Year</dt>
                <dd className="mono">{p.year}</dd>
              </div>
              <div>
                <dt className="label">Role</dt>
                <dd>{p.role}</dd>
              </div>
              <div>
                <dt className="label">Context</dt>
                <dd>{p.kind}</dd>
              </div>
              <div>
                <dt className="label">Status</dt>
                <dd className="case-status">
                  <span
                    className="status-dot"
                    data-status={p.status}
                    aria-hidden="true"
                  />
                  {p.status}
                </dd>
              </div>
              {p.client && (
                <div className="case-facts-wide">
                  <dt className="label">Client</dt>
                  <dd>{p.client}</dd>
                </div>
              )}
            </dl>

            <Reveal stagger={0.055} className="case-metrics">
              {p.metrics.map((m) => (
                <div className="metric" key={m.label}>
                  <p className="metric-value mono">{m.value}</p>
                  <p className="metric-label">{m.label}</p>
                  {m.note && <p className="metric-note">{m.note}</p>}
                </div>
              ))}
            </Reveal>
          </div>
        </header>

        {/* --------------------------------- SUMMARY + PROBLEM, merged */}
        <section className="section case-opening" aria-label="Summary">
          <div className="shell case-two-col">
            <div className="case-col-side">
              <p className="label label-accent">Summary</p>
            </div>
            <div className="case-col-main prose">
              <Reveal>
                <p
                  className="lead case-summary-lead"
                  dangerouslySetInnerHTML={{ __html: inlineCode(p.summary) }}
                />
              </Reveal>

              <BrassRule className="case-opening-rule" />

              {p.problem.map((para, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p
                    className="case-problem-para"
                    dangerouslySetInnerHTML={{ __html: inlineCode(para) }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------ NUMBERED SECTIONS */}
        {p.sections.map((s, i) => (
          <section className="section case-section" key={s.heading}>
            <div className="shell case-two-col">
              <div className="case-col-side">
                <p className="label mono case-section-n">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <BrassRule className="case-section-rule" duration={0.48} />
              </div>

              <div className="case-col-main">
                <Reveal>
                  <h2 className="h2 case-section-title">{s.heading}</h2>
                </Reveal>

                <div className="prose case-section-prose">
                  {s.body.map((para, j) => (
                    <Reveal key={j} delay={j * 0.04}>
                      <p dangerouslySetInnerHTML={{ __html: inlineCode(para) }} />
                    </Reveal>
                  ))}
                </div>

                {s.bullets && (
                  <Reveal stagger={0.055} className="case-bullets">
                    {s.bullets.map((b) => (
                      <div className="case-bullet" key={b.title}>
                        <h3 className="case-bullet-title">{b.title}</h3>
                        <p
                          className="muted"
                          dangerouslySetInnerHTML={{ __html: inlineCode(b.body) }}
                        />
                      </div>
                    ))}
                  </Reveal>
                )}

                {renderFigure(s.figure)}
                {i === p.sections.length - 1 &&
                  orphanFigures.map((k) => (
                    <div key={k}>{renderFigure(k)}</div>
                  ))}
              </div>
            </div>
          </section>
        ))}

        {/* --------------------------------------- OUTCOME (+ stack) */}
        <section className="section case-outcome" aria-label="Outcome">
          <div className="shell case-two-col">
            <div className="case-col-side">
              <p className="label label-accent">Outcome</p>
            </div>
            <div className="case-col-main">
              <Reveal stagger={0.06} className="case-outcome-list">
                {p.outcome.map((o) => (
                  <div className="case-outcome-row" key={o}>
                    <span className="case-outcome-mark" aria-hidden="true">
                      ◆
                    </span>
                    <p dangerouslySetInnerHTML={{ __html: inlineCode(o) }} />
                  </div>
                ))}
              </Reveal>

              <Reveal className="case-stack-row">
                <p className="label">Built with</p>
                <ul className="case-stack">
                  {p.stack.map((s) => (
                    <li className="skills-item" key={s}>
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- NEXT */}
        <nav className="case-next" aria-label="More work">
          <div className="shell case-next-grid">
            {prev && (
              <Link href={`/work/${prev.slug}`} className="case-next-link is-prev">
                <span className="label">Previous</span>
                <span className="h3 case-next-title">{prev.title}</span>
                <span className="muted case-next-sub">{prev.subtitle}</span>
              </Link>
            )}
            {next && (
              <Link href={`/work/${next.slug}`} className="case-next-link is-next">
                <span className="label">Next</span>
                <span className="h3 case-next-title">{next.title}</span>
                <span className="muted case-next-sub">{next.subtitle}</span>
              </Link>
            )}
          </div>
          <div className="shell case-next-foot">
            <Link href="/#work" className="btn btn-ghost">
              All work
            </Link>
            <a className="btn btn-primary" href={`mailto:${identity.email}`}>
              Start a conversation
            </a>
          </div>
        </nav>
      </article>
    </>
  );
}

/**
 * Renders `backtick spans` as <code> and *starred spans* as emphasis.
 *
 * Everything is HTML-escaped first, so the only tags that can reach the DOM
 * are the two this function emits — the content file cannot inject markup
 * through this path even though the result is passed to dangerouslySetInnerHTML.
 */
function inlineCode(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*([^*]+)\*/g, '<em class="italic-serif">$1</em>');
}
