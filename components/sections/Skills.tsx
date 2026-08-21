import { Reveal } from "@/components/ui/Reveal";
import { skills } from "@/lib/content";

export default function Skills() {
  return (
    <section className="section skills" id="skills" aria-label="Technical skills">
      <div className="shell">
        <div className="eyebrow">
          <span className="label label-accent">05</span>
          <span className="label">Technical</span>
          <span className="rule" />
          <span className="label mono">
            {skills.reduce((n, g) => n + g.items.length, 0)} entries
          </span>
        </div>

        <h2 className="h2 skills-title">
          The toolkit, end to end.
        </h2>

        <div className="skills-grid">
          {skills.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.04}>
              <div className="skills-group">
                <p className="label skills-group-label">{group.label}</p>
                <ul className="skills-items">
                  {group.items.map((item) => (
                    <li key={item} className="skills-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
