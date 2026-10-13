import { describe, expect, it } from "vitest";
import { parseContributions } from "./github";

function calendar(days: { date: string; level: number }[], total = "1,234") {
  const cells = days
    .map(
      (d, i) =>
        `<td tabindex="0" data-ix="${i}" data-date="${d.date}" id="day-${i}" data-level="${d.level}" class="ContributionCalendar-day"></td>` +
        `<tool-tip id="tt-${i}" for="day-${i}" popover="manual">${d.level} contributions on ${d.date}.</tool-tip>`,
    )
    .join("\n");
  return `<h2>${total} contributions in the last year</h2><table>${cells}</table>`;
}

const week = Array.from({ length: 7 }, (_, i) => ({
  date: `2026-10-0${i + 1}`,
  level: i % 5,
}));

describe("parseContributions", () => {
  it("reads every day with its level and tooltip", () => {
    const result = parseContributions(calendar(week));
    expect(result?.total).toBe(1234);
    expect(result?.days).toHaveLength(7);
    expect(result?.days[2]).toEqual({
      date: "2026-10-03",
      level: 2,
      label: "2 contributions on 2026-10-03.",
    });
  });

  it("sorts days by date", () => {
    const result = parseContributions(calendar([...week].reverse()));
    expect(result?.days.map((d) => d.date)).toEqual(week.map((d) => d.date));
  });

  it("falls back to the date when a day has no tooltip", () => {
    const html = calendar(week).replace(
      /<tool-tip[^>]*>[^<]*<\/tool-tip>/g,
      "",
    );
    expect(parseContributions(html)?.days[0].label).toBe("2026-10-01");
  });

  it("reports 0 when the total is missing", () => {
    const html = calendar(week).replace(/<h2>.*<\/h2>/, "");
    expect(parseContributions(html)?.total).toBe(0);
  });

  it("gives up on a page that is not a calendar", () => {
    expect(parseContributions("<html>rate limited</html>")).toBeNull();
    expect(parseContributions(calendar(week.slice(0, 3)))).toBeNull();
  });
});
