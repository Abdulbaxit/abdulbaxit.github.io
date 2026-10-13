import { Icon } from "./Sprite";
import { SectionHeading } from "./SectionHeading";
import { profile } from "@/content/profile";
import { getContributions } from "@/lib/github";

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

export async function GitHubActivity() {
  const user = profile.github;
  if (!user) return null;

  const contributions = await getContributions(user);
  if (!contributions) return null;

  const first = contributions.days[0];
  const offset = first ? new Date(`${first.date}T00:00:00Z`).getUTCDay() : 0;
  const cells = contributions.days.map((day, i) => ({
    ...day,
    col: Math.floor((i + offset) / 7) + 1,
    row: ((i + offset) % 7) + 1,
  }));
  const weeks = cells.length ? cells[cells.length - 1].col : 0;

  const months: { col: number; label: string }[] = [];
  for (const c of cells) {
    if (c.row !== 1) continue;
    const label = monthFmt.format(new Date(`${c.date}T00:00:00Z`));
    if (months.at(-1)?.label !== label) months.push({ col: c.col, label });
  }

  const profileUrl = `https://github.com/${user}`;

  return (
    <section id="github" className="mt-12 md:mt-32">
      <SectionHeading
        title="On GitHub"
        subtitle={`${contributions.total.toLocaleString("en-US")} contributions in the last year`}
      />

      <figure className="gh-graph">
        <div
          className="gh-graph__grid"
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
          role="img"
          aria-label={`Contribution graph: ${contributions.total} contributions in the last year`}
        >
          {months.map((m) => (
            <span
              key={`${m.label}-${m.col}`}
              className="gh-graph__month"
              style={{ gridColumn: m.col, gridRow: 1 }}
              aria-hidden="true"
            >
              {m.label}
            </span>
          ))}
          {cells.map((c) => (
            <span
              key={c.date}
              className="gh-graph__day"
              data-level={c.level}
              title={c.label}
              style={{ gridColumn: c.col, gridRow: c.row + 1 }}
            />
          ))}
        </div>
        <figcaption className="gh-graph__legend">
          <span>Updated daily</span>
          <span className="gh-graph__scale" aria-hidden="true">
            Less
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className="gh-graph__day" data-level={l} />
            ))}
            More
          </span>
        </figcaption>
      </figure>

      <p className="mt-6">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="f-link font-bold"
        >
          <Icon id="github" className="mr-1" />
          See everything on GitHub
        </a>
      </p>
    </section>
  );
}
