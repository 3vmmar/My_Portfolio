import Link from "next/link";
import { identity } from "@/lib/content";
import { projects } from "@/lib/projects";

export default function Footer() {
  return (
    <footer className="footer on-invert">
      <div className="shell">
        <div className="footer-rule" aria-hidden="true" />

        <div className="footer-grid">
          <div className="footer-brand">
            <p className="hero-type footer-mark">
              A<span className="brass">·</span>A
            </p>
            <p className="muted footer-blurb">{identity.statement}</p>
          </div>

          <nav className="footer-col" aria-label="Case studies">
            <p className="label">Case studies</p>
            <ul>
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="link">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Elsewhere">
            <p className="label">Elsewhere</p>
            <ul>
              <li>
                <a
                  className="link"
                  href={identity.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="link"
                  href={identity.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="link"
                  href={identity.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </nav>

          <div className="footer-col">
            <p className="label">Direct</p>
            <ul>
              <li>
                <a className="link" href={`mailto:${identity.email}`}>
                  Email
                </a>
              </li>
              <li>
                <a className="link" href={`tel:${identity.phoneHref}`}>
                  {identity.phone}
                </a>
              </li>
              <li className="muted">{identity.location}</li>
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <p className="label">
            © {new Date().getFullYear()} {identity.name}
          </p>
          <p className="label footer-credit">
            Palette measured from a photograph — travertine, brass, midnight
          </p>
        </div>
      </div>
    </footer>
  );
}
