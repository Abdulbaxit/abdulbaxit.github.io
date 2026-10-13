import { SectionHeading } from "./SectionHeading";
import { recommendations } from "@/content/profile";

export function Recommendations() {
  if (recommendations.length === 0) return null;

  return (
    <section id="recommendations" className="mt-12 md:mt-32">
      <SectionHeading
        title="Kind words"
        subtitle="From people I’ve worked with"
      />

      <div className="quotes">
        {recommendations.map((r) => (
          <figure key={r.quote} className="quote">
            <blockquote className="quote__text">
              <p>{r.quote}</p>
            </blockquote>
            <figcaption className="quote__who">
              {r.href ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quote__name"
                >
                  {r.name}
                </a>
              ) : (
                <span className="quote__name">{r.name}</span>
              )}
              <span className="quote__role">{r.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
