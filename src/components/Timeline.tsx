import { isCurrentRole } from "@/content/profile";
import type { Role } from "@/content/types";

export type TimelineEntry = Omit<Role, "period"> & { period?: string };

export interface TimelineGroup {
  name: string;
  href?: string;
  terms?: string;
  entries: TimelineEntry[];
}

export function Timeline({ groups }: { groups: TimelineGroup[] }) {
  return (
    <ol className="tl">
      {groups.map((group) => (
        <li key={group.name} className="tl__job">
          <div className="tl__head">
            <h3 className="tl__company">
              {group.href ? (
                <a
                  href={group.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tl__link"
                >
                  {group.name}
                </a>
              ) : (
                group.name
              )}
            </h3>
            {group.terms && <p className="tl__terms">{group.terms}</p>}
          </div>

          <ol className="tl__roles">
            {group.entries.map((entry) => (
              <li
                key={entry.title}
                className={
                  entry.period && isCurrentRole({ period: entry.period })
                    ? "tl__role tl__role--current"
                    : "tl__role"
                }
              >
                {entry.period && <p className="tl__period">{entry.period}</p>}
                <h4 className="tl__title">{entry.title}</h4>
                <p className="tl__summary">{entry.summary}</p>

                {entry.highlights?.length ? (
                  <ul className="tl__points">
                    {entry.highlights.map((point) => (
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
  );
}
