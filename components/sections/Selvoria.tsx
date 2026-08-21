import { Reveal, WordReveal, BrassRule } from "@/components/ui/Reveal";
import { selvoria } from "@/lib/content";

export default function Selvoria() {
  return (
    <section className="section selvoria" id="selvoria" aria-label="Selvoria">
      <div className="shell">
        <div className="eyebrow">
          <span className="label label-accent">02</span>
          <span className="label">The company</span>
          <span className="rule" />
        </div>

        <div className="selvoria-head">
          <h2 className="h1 selvoria-wordmark">
            <WordReveal text="Selvoria" as="span" stagger={0.06} />
          </h2>

          <div className="selvoria-pillars" aria-hidden="true">
            {selvoria.pillars.map((p, i) => (
              <span key={p} className="selvoria-pillar label">
                {p}
                {i < selvoria.pillars.length - 1 && (
                  <span className="selvoria-pillar-dot">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <BrassRule className="selvoria-rule" />

        <Reveal className="selvoria-intro-wrap">
          <p className="lead selvoria-intro">{selvoria.intro}</p>
        </Reveal>

        {/* Three divisions. Selvoria AI is the one he runs, so it is the one
            the layout gives weight to. */}
        <div className="selvoria-divisions">
          {selvoria.divisions.map((d, i) => (
            <Reveal
              key={d.key}
              delay={i * 0.08}
              className={`selvoria-division ${d.focus ? "is-focus" : ""}`}
            >
              <article>
                <header className="selvoria-division-head">
                  <span className="label label-accent">{d.verb}</span>
                  <span className="selvoria-status">
                    <span
                      className="status-dot"
                      data-status={d.status === "Active" ? "Shipped" : "In development"}
                      aria-hidden="true"
                    />
                    <span className="label">{d.status}</span>
                  </span>
                </header>

                <h3 className="h3 selvoria-division-name">{d.name}</h3>
                <p className="label selvoria-division-role">{d.role}</p>
                <p className="selvoria-division-body">{d.body}</p>

                {d.focus ? (
                  <p className="selvoria-badge label">
                    <span className="brass">◆</span> My day-to-day — CEO &amp;
                    Founder
                  </p>
                ) : (
                  <p className="selvoria-division-status label">
                    {d.verb} — in planning
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* Philosophy pull-quote */}
        <Reveal className="selvoria-quote-wrap">
          <blockquote className="selvoria-quote">
            <p className="h2 italic-serif">{selvoria.philosophy}</p>
          </blockquote>
        </Reveal>

        <div className="selvoria-approach">
          {selvoria.approach.map((a, i) => (
            <Reveal key={a.n} delay={i * 0.07}>
              <article className="selvoria-step">
                <span className="selvoria-step-n mono">{a.n}</span>
                <h4 className="selvoria-step-title">{a.title}</h4>
                <p className="muted">{a.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="selvoria-note-wrap">
          <p className="selvoria-note">
            <span className="label label-accent">Note</span>
            The Selvoria AI website is in development. Until it ships, the work
            above is the record —{" "}
            <a href="#work" className="link">
              Care Point
            </a>{" "}
            is a Selvoria AI system, shipped and running.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
