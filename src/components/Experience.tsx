import { experience, isCurrentRole } from "@/content/profile";

/**
 * Employment as a timeline, current roles first. Roles nest under their
 * employer, so two titles at one company read as a promotion rather than
 * as separate jobs. The rail and its markers are drawn in CSS and hidden
 * from assistive tech; the heading levels carry the structure.
 */
export function Experience() {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="mt-12 md:mt-32">
      <h2
        className="text-3xl leading-none font-bold md:text-4xl"
        style={{ color: "var(--text-strong)" }}
      >
        Experience
      </h2>
      <p className="mt-2 text-lg">Where I&rsquo;ve worked</p>
      <div className="kj-border" />

      <ol className="tl">
        {experience.map((job) => (
          <li key={job.company} className="tl__job">
            <div className="tl__head">
              <h3 className="tl__company">
                {job.href ? (
                  <a
                    href={job.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tl__link"
                  >
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              {job.terms && <p className="tl__terms">{job.terms}</p>}
            </div>

            <ol className="tl__roles">
              {job.roles.map((role) => (
                <li
                  key={role.title}
                  className={
                    isCurrentRole(role)
                      ? "tl__role tl__role--current"
                      : "tl__role"
                  }
                >
                  <p className="tl__period">{role.period}</p>
                  <h4 className="tl__title">{role.title}</h4>
                  <p className="tl__summary">{role.summary}</p>

                  {role.highlights?.length ? (
                    <ul className="tl__points">
                      {role.highlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </section>
  );
}
