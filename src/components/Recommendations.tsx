import { recommendations } from "@/content/profile";

/** Quotes from people I've worked with. Renders nothing until there are some. */
export function Recommendations() {
  if (recommendations.length === 0) return null;

  return (
    <section id="recommendations" className="mt-12 md:mt-32">
      <h2
        className="text-3xl leading-none font-bold md:text-4xl"
        style={{ color: "var(--text-strong)" }}
      >
        Kind words
      </h2>
      <p className="mt-2 text-lg">From people I&rsquo;ve worked with</p>
      <div className="kj-border" />

      <div className="quotes">
        {recommendations.map((r) => (
          // Keyed by the quote: one person can give more than one.
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
