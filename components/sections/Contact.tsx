import { WordReveal, Reveal } from "@/components/ui/Reveal";
import { identity, nowFacts } from "@/lib/content";

/**
 * The closing beat, and the only inverted band on the site.
 *
 * The page opens on the travertine wall and closes in the dark of the suit —
 * both colours measured from the same photograph. It is also the one place a
 * light palette can actually show the atrium metaphor paying off: the wash
 * recedes and you have walked out of the lit room.
 */
export default function Contact() {
  return (
    <section
      className="section contact on-invert"
      id="contact"
      aria-label="Contact"
    >
      <div className="shell contact-inner">
        <div className="eyebrow">
          <span className="label label-accent">06</span>
          <span className="label">Contact</span>
          <span className="rule" />
        </div>

        <h2 className="hero-type contact-headline">
          <WordReveal
            text="Let’s build something that works."
            as="span"
            accentWords={["works."]}
          />
        </h2>

        <Reveal className="contact-lead-wrap">
          <p className="lead contact-lead">
            {identity.availability}. The fastest route is email — I read
            everything and reply to anything concrete.
          </p>
        </Reveal>

        <div className="contact-body">
          <Reveal stagger={0.055} className="contact-rows">
            <a className="contact-row" href={`mailto:${identity.email}`}>
              <span className="label">Email</span>
              <span className="contact-row-value">{identity.email}</span>
              <ArrowIcon />
            </a>

            <a className="contact-row" href={`tel:${identity.phoneHref}`}>
              <span className="label">Phone</span>
              <span className="contact-row-value mono">{identity.phone}</span>
              <ArrowIcon />
            </a>

            <a
              className="contact-row"
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="label">LinkedIn</span>
              <span className="contact-row-value">{identity.linkedinHandle}</span>
              <ArrowIcon />
            </a>

            <a
              className="contact-row"
              href={identity.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="label">GitHub</span>
              <span className="contact-row-value">@{identity.githubHandle}</span>
              <ArrowIcon />
            </a>

            <a
              className="contact-row"
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="label">Résumé</span>
              <span className="contact-row-value">Download PDF</span>
              <ArrowIcon />
            </a>
          </Reveal>

          {/* The right column exists because the closing section was otherwise
              a narrow list beside an empty half-viewport. */}
          <Reveal stagger={0.06} className="contact-aside">
            <div className="contact-aside-item">
              <span className="label">Based in</span>
              <span className="contact-aside-value">{identity.location}</span>
            </div>
            {nowFacts.map((f) => (
              <div className="contact-aside-item" key={f.label}>
                <span className="label">{f.label}</span>
                <span className="contact-aside-value">{f.value}</span>
              </div>
            ))}
            <div className="contact-aside-item">
              <span className="label">Role</span>
              <span className="contact-aside-value">
                CEO &amp; Founder, Selvoria AI
              </span>
            </div>
            <div className="contact-aside-item">
              <span className="label">Working in</span>
              <span className="contact-aside-value">Arabic &amp; English</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="contact-row-arrow"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
