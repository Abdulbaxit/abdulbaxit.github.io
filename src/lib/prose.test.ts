import { describe, expect, it } from "vitest";
import { formatDate, parseInline, parseProse, readingMinutes } from "./prose";

describe("parseProse", () => {
  it("splits headings, paragraphs, lists and code into blocks", () => {
    const source = [
      "## Why",
      "First line",
      "continues here.",
      "",
      "- one",
      "- two",
      "",
      "```python",
      "print('hi')",
      "",
      "x = 1",
      "```",
    ].join("\n");

    expect(parseProse(source)).toEqual([
      { type: "heading", text: "Why" },
      { type: "paragraph", text: "First line continues here." },
      { type: "list", items: ["one", "two"] },
      { type: "code", code: "print('hi')\n\nx = 1", lang: "python" },
    ]);
  });

  it("ends a list when a paragraph line follows it", () => {
    expect(parseProse("- a\nplain text")).toEqual([
      { type: "list", items: ["a"] },
      { type: "paragraph", text: "plain text" },
    ]);
  });

  it("keeps the content of an unterminated code fence", () => {
    expect(parseProse("```\nconst a = 1;")).toEqual([
      { type: "code", code: "const a = 1;", lang: undefined },
    ]);
  });

  it("treats Windows line endings like Unix ones", () => {
    expect(parseProse("## Title\r\nBody")).toEqual([
      { type: "heading", text: "Title" },
      { type: "paragraph", text: "Body" },
    ]);
  });

  it("returns nothing for an empty body", () => {
    expect(parseProse("")).toEqual([]);
  });
});

describe("formatDate", () => {
  it("writes an ISO date out in full", () => {
    expect(formatDate("2026-09-18")).toBe("18 September 2026");
    expect(formatDate("2025-01-05")).toBe("5 January 2025");
  });

  it("returns anything it cannot read unchanged", () => {
    expect(formatDate("soon")).toBe("soon");
  });
});

describe("parseInline", () => {
  it("separates inline code from plain text", () => {
    expect(parseInline("run `npm test` now")).toEqual([
      { code: false, text: "run " },
      { code: true, text: "npm test" },
      { code: false, text: " now" },
    ]);
  });

  it("leaves a lone backtick as text", () => {
    expect(parseInline("a ` b")).toEqual([{ code: false, text: "a ` b" }]);
  });
});

describe("readingMinutes", () => {
  it("rounds to whole minutes at 220 words a minute", () => {
    expect(readingMinutes("word ".repeat(660))).toBe(3);
    expect(readingMinutes("word ".repeat(770))).toBe(4);
  });

  it("never says zero minutes", () => {
    expect(readingMinutes("short")).toBe(1);
    expect(readingMinutes("")).toBe(1);
  });
});
