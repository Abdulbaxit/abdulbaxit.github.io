import { notes } from "@/content/notes";
import { profile } from "@/content/profile";
import { absoluteUrl } from "@/content/site";
import { buildRss } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  const xml = buildRss({
    title: `${profile.name} — Notes`,
    link: absoluteUrl("/#notes"),
    selfLink: absoluteUrl("/feed.xml"),
    description: `Short technical write-ups by ${profile.name}, ${profile.role.toLowerCase()}.`,
    items: notes.map((n) => ({
      title: n.title,
      link: absoluteUrl(`/notes/${n.slug}/`),
      description: n.description,
      date: n.date,
    })),
  });
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
