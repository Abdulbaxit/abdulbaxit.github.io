import { Fragment } from "react";
import { ContactDisc } from "./ContactDisc";
import { Medallion } from "./Medallion";
import { profile } from "@/content/profile";

/**
 * Everything animates in on its own CSS delay (--d), so the hero is fully
 * in place about a second after first paint, with no loader in front of it.
 */
export function Hero() {
  // Each letter's delay continues from the last line's, so the name
  // types out as one run across both lines.
  const lines = profile.nameLines.map((line, li) => {
    const before = profile.nameLines
      .slice(0, li)
      .reduce((sum, l) => sum + l.length, 0);
    return Array.from(line).map((char, ci) => ({
      char,
      delay: 0.3 + (before + ci) * 0.04,
    }));
  });

  return (
    <header id="home" className="hero mt-8 md:mt-12">
      <div className="hero__copy">
        <div className="text-center md:text-left">
          <div
            className="callout pop"
            style={{ "--d": "0.15s" } as React.CSSProperties}
          >
            It&rsquo;s me
          </div>

          <h1
            className="hero__name"
            aria-label={profile.name}
            style={{ color: "var(--text-strong)" }}
          >
            {/*
              The space between lines is invisible (the lines are blocks)
              but keeps the heading's text "Abdul Basit" for search
              engines, rather than "AbdulBasit".
            */}
            {lines.map((letters, li) => (
              <Fragment key={li}>
                {li > 0 && " "}
                <span className="block">
                  {letters.map(({ char, delay }, ci) => (
                    <span
                      key={ci}
                      className="letter"
                      aria-hidden="true"
                      style={
                        { "--d": `${delay.toFixed(2)}s` } as React.CSSProperties
                      }
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </h1>
        </div>

        {profile.availability && (
          <p
            className="rise hero__status"
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            <span className="hero__pulse" aria-hidden="true" />
            {profile.availability}
          </p>
        )}

        <p
          className="rise hero__role"
          style={{ "--d": "0.75s" } as React.CSSProperties}
        >
          {profile.role}
          <span className="hero__dot" aria-hidden="true">
            ·
          </span>
          <span className="hero__location">{profile.location}</span>
        </p>

        <p
          className="rise hero__tagline"
          style={{ "--d": "0.9s" } as React.CSSProperties}
        >
          {profile.tagline}
        </p>

        {profile.heroStack.length > 0 && (
          <ul
            className="rise hero__stack"
            style={{ "--d": "1s" } as React.CSSProperties}
            aria-label="Core stack"
          >
            {profile.heroStack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <div
          className="rise hero__cta"
          style={{ "--d": "1.1s" } as React.CSSProperties}
        >
          <ContactDisc />
        </div>
      </div>

      <div className="hero__figure">
        <Medallion />
      </div>
    </header>
  );
}
