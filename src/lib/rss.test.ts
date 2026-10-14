import { describe, expect, it } from "vitest";
import { buildRss, escapeXml } from "./rss";

describe("escapeXml", () => {
  it("escapes the five XML special characters", () => {
    expect(escapeXml(`<a href="x">Tom & Jerry's</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&apos;s&lt;/a&gt;",
    );
  });
});

describe("buildRss", () => {
  const xml = buildRss({
    title: "Notes",
    link: "https://example.com/",
    selfLink: "https://example.com/feed.xml",
    description: "Write-ups",
    items: [
      {
        title: "A & B",
        link: "https://example.com/a/",
        description: "First",
        date: "2025-05-14",
      },
      {
        title: "C",
        link: "https://example.com/c/",
        description: "Second",
        date: "2025-10-22",
      },
    ],
  });

  it("is an RSS 2.0 document with a self link", () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('href="https://example.com/feed.xml" rel="self"');
  });

  it("escapes item text and dates items in RFC 822", () => {
    expect(xml).toContain("<title>A &amp; B</title>");
    expect(xml).toContain("<pubDate>Wed, 14 May 2025 00:00:00 GMT</pubDate>");
  });

  it("uses the newest item as the build date", () => {
    expect(xml).toContain(
      "<lastBuildDate>Wed, 22 Oct 2025 00:00:00 GMT</lastBuildDate>",
    );
  });
});
