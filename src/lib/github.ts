/**
 * GitHub data for the activity section, fetched at build time. The deploy
 * workflow rebuilds daily, so the static page stays at most a day old.
 *
 * Every fetch fails soft: on a network error, a rate limit or a change in
 * GitHub's markup the function returns null and the section is skipped,
 * rather than failing the build.
 */

export interface ContributionDay {
  /** ISO date, e.g. "2026-10-05". */
  date: string;
  /** GitHub's own intensity bucket, 0 (none) to 4 (most). */
  level: number;
  /** e.g. "2 contributions on October 5th." */
  label: string;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
}

const HEADERS = { "User-Agent": "abdulbasit-portfolio-build" };

/**
 * The contribution calendar. GitHub has no public REST endpoint for it, so
 * this reads the same HTML fragment the profile page loads. It needs no
 * token and includes private contributions if the profile shows them.
 */
export async function getContributions(
  user: string,
): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: HEADERS,
      cache: "force-cache",
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Tooltips carry the readable count, keyed by the day cell's id.
    const labels = new Map<string, string>();
    for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      labels.set(m[1], m[2].trim());
    }

    const attr = (tag: string, name: string) =>
      tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

    const days: ContributionDay[] = [];
    for (const [tag] of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
      const date = attr(tag, "data-date");
      const level = Number(attr(tag, "data-level"));
      const id = attr(tag, "id");
      if (!date || Number.isNaN(level)) continue;
      days.push({ date, level, label: (id && labels.get(id)) || date });
    }
    if (days.length < 7) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    const total = Number(
      html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1]?.replace(/,/g, ""),
    );
    return { total: Number.isFinite(total) ? total : 0, days };
  } catch {
    return null;
  }
}
