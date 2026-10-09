import { Fragment } from "react";
import { Icon } from "./Sprite";
import { CountUp } from "./CountUp";
import { impact, statusLines, funFact, readme } from "@/content/profile";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Renders `[text](url)` inside a content string as an external link. */
function withLinks(text: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const start = m.index ?? 0;
    parts.push(text.slice(last, start));
    parts.push(
      <a
        key={start}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold underline"
      >
        {m[1]}
      </a>,
    );
    last = start + m[0].length;
  }
  parts.push(text.slice(last));
  return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>);
}

/**
 * Impact figures and current status side by side, with the bio beneath,
 * all in one raised card narrower than the sections around it.
 */
export function Readme() {
  return (
    <div className="m-auto mt-12 px-2 py-4 md:mt-32 md:w-3/4">
      <div className="mb-6 w-full px-4">
        <div
          className="rounded-lg border-2 shadow-2xl"
          style={{
            background: "var(--surface-raised)",
            borderColor: "var(--surface-raised)",
          }}
        >
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 md:gap-5">
            <div className="impact">
              <p className="impact__kicker">Impact</p>
              <ul>
                {impact.map((stat) => (
                  <li key={stat.label} className="impact__row">
                    <span className="impact__n">
                      <CountUp value={stat.value} />
                      {stat.suffix && (
                        <span className="impact__suffix">{stat.suffix}</span>
                      )}
                    </span>
                    <span className="impact__l">{stat.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-10">
              {statusLines.map((line, i) => (
                <div key={line.text} className={i > 0 ? "mt-2" : undefined}>
                  <Icon id={line.icon} className="inline-block text-lg" />
                  <p className="ml-1 inline-block">
                    {line.verb && <>{line.verb} </>}
                    {line.href ? (
                      <a
                        href={line.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline"
                      >
                        {line.text}
                      </a>
                    ) : (
                      line.text
                    )}
                  </p>
                </div>
              ))}
              <div className="mt-2">
                <p className="ml-1 inline-block">
                  <span className="font-bold">Fun Fact:</span> {funFact}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="mt-10">
              <div className="mb-5 text-lg">
                <h2 className="font-medium uppercase">README</h2>
                <div className="kj-border" />
              </div>
              {readme.map((para, i) => (
                <p key={i} className={i > 0 ? "mt-2" : undefined}>
                  {withLinks(para)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
