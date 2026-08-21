import Image from "next/image";
import { Reveal, BrassRule } from "@/components/ui/Reveal";
import { summary, education, identity } from "@/lib/content";

export default function About() {
  return (
    <section className="section about" id="about" aria-label="About">
      <div className="shell">
        <div className="eyebrow">
          <span className="label label-accent">04</span>
          <span className="label">About</span>
          <span className="rule" />
        </div>

        <h2 className="h2 about-title">
          Deep learning on one side, shipped systems on the other.
        </h2>

        <div className="about-grid">
          <Reveal className="about-figure-wrap">
            <figure className="about-figure">
              <Image
                src="/img/ammar-figure.jpg"
                alt={`${identity.name}, photographed in Cairo`}
                width={900}
                height={1200}
                sizes="(max-width: 900px) 88vw, 36vw"
                quality={86}
              />
              <figcaption className="label about-caption">
                The palette of this site is measured from this photograph
              </figcaption>
            </figure>
          </Reveal>

          <div className="about-copy prose">
            <Reveal>
              <p className="lead about-lead">{summary.short}</p>
            </Reveal>

            <BrassRule className="about-rule" />

            {summary.long.map((para, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <p>{para}</p>
              </Reveal>
            ))}

            <Reveal className="about-edu-wrap">
              <div className="about-edu">
                <p className="label">Education</p>
                <h3 className="h3 about-edu-inst">{education.institution}</h3>
                <p className="about-edu-degree">{education.degree}</p>
                <p className="muted about-edu-spec">{education.specialization}</p>
                <p className="label mono about-edu-period">{education.period}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
