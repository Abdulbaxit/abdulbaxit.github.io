export interface ContributionDay {
  date: string;
  level: number;
  label: string;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
}

const HEADERS = { "User-Agent": "abdulbasit-portfolio-build" };

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
