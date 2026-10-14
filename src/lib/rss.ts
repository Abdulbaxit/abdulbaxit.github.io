export interface FeedItem {
  title: string;
  link: string;
  description: string;
  date: string;
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export function buildRss({
  title,
  link,
  selfLink,
  description,
  items,
}: {
  title: string;
  link: string;
  selfLink: string;
  description: string;
  items: FeedItem[];
}): string {
  const latest = items
    .map((i) => i.date)
    .sort()
    .at(-1);
  const entries = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <pubDate>${rfc822(item.date)}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(description)}</description>
    <language>en</language>${latest ? `\n    <lastBuildDate>${rfc822(latest)}</lastBuildDate>` : ""}
${entries}
  </channel>
</rss>
`;
}
