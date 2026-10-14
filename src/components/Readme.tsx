import { Fragment } from "react";
import { Icon } from "./Sprite";
import { CountUp } from "./CountUp";
import { LocalTime } from "./LocalTime";
import { SectionHeading } from "./SectionHeading";
import {
  profile,
  impact,
  statusLines,
  funFact,
  readme,
} from "@/content/profile";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const STAT_AREAS = ["s1", "s2", "s3"];

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

function Tile({
  area,
  kicker,
  className = "",
  children,
}: {
  area?: string;
  kicker?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bento__tile ${area ? `bento__tile--${area}` : ""} ${className}`}
      data-spotlight=""
      data-reveal=""
    >
      {kicker && <p className="bento__kicker">{kicker}</p>}
      {children}
    </div>
  );
}

export function Readme() {
  return (
    <section id="about" className="mt-12 md:mt-32">
      <SectionHeading title="About me" subtitle="The short version" />

      <div className="bento">
        <Tile area="bio" kicker="README" className="bento__bio">
          {readme.map((para, i) => (
            <p key={i}>{withLinks(para)}</p>
          ))}
        </Tile>

        {impact.map((stat, i) => (
          <Tile key={stat.label} area={STAT_AREAS[i]} className="bento__stat">
            <span className="impact__n">
              <CountUp value={stat.value} />
              {stat.suffix && (
                <span className="impact__suffix">{stat.suffix}</span>
              )}
            </span>
            <span className="bento__label">{stat.label}</span>
          </Tile>
        ))}

        <Tile area="loc" kicker="Based in">
          <p className="bento__big">{profile.location}</p>
          <LocalTime
            timeZone={profile.timeZone}
            place={profile.location.split(",")[0]}
          />
        </Tile>

        <Tile area="now" kicker="Right now">
          <ul className="bento__now">
            {statusLines.map((line) => (
              <li key={line.text}>
                <Icon id={line.icon} className="text-lg" />
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
              </li>
            ))}
          </ul>
        </Tile>

        <Tile area="fun" kicker="Fun fact">
          <p>{funFact}</p>
        </Tile>
      </div>
    </section>
  );
}
