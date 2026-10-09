import {
  profile,
  experience,
  skills,
  readme,
  recommendations,
  isCurrentRole,
} from "@/content/profile";
import { projects } from "@/content/projects";
import { diagrams } from "@/content/diagrams";
import { notes } from "@/content/notes";
import { site, absoluteUrl } from "@/content/site";

export const dynamic = "force-static";

/** "[Implement AI](https://…)" → "Implement AI": llms.txt wants plain prose. */
const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/**
 * /llms.txt (llmstxt.org): a plain-Markdown summary for AI assistants and
 * AI search, so "who is Abdul Basit, software engineer?" in ChatGPT,
 * Claude or Perplexity has a clean, current source to quote. Built from
 * the same content as the page, so the two never disagree.
 */
export function GET() {
  const lines: string[] = [
    `# ${profile.name}`,
    "",
    `> ${profile.role} in ${profile.location}. ${profile.tagline}`,
    "",
    ...readme.map((p) => plain(p) + "\n"),
    "## Experience",
    "",
    ...experience.flatMap((job) =>
      job.roles.map(
        (role) =>
          `- ${role.title}, ${job.company}${job.terms ? ` (${job.terms})` : ""}, ${role.period}${isCurrentRole(role) ? " (current)" : ""}: ${role.summary}`,
      ),
    ),
    "",
    "## Skills",
    "",
    ...skills.map((s) => `- ${s.title[0].toUpperCase()}${s.title.slice(1)}: ${s.body}`),
    `- Core stack: ${profile.heroStack.join(", ")}`,
    "",
    "## Projects",
    "",
    ...projects.map((p) => {
      const name = p.href ? `[${p.name}](${p.href})` : p.name;
      const about = p.blurb ?? (p.visual.kind === "diagram" ? diagrams[p.visual.diagram].alt : "");
      return `- ${name} (${p.stack.join(", ")}): ${about}`;
    }),
    "",
  ];

  if (recommendations.length) {
    lines.push(
      "## Recommendations",
      "",
      ...recommendations.map((r) => `> "${r.quote}"\n> — ${r.name}, ${r.role}\n`),
    );
  }

  if (notes.length) {
    lines.push(
      "## Notes",
      "",
      ...notes.map(
        (n) => `- [${n.title}](${absoluteUrl(`/notes/${n.slug}/`)}): ${n.description}`,
      ),
      "",
    );
  }

  lines.push(
    "## Links",
    "",
    `- [Website](${absoluteUrl("/")})`,
    ...profile.socials
      .filter((s) => s.kind !== "email")
      .map((s) => `- [${s.label}](${s.href})`),
    ...(profile.resumeHref ? [`- [CV (PDF)](${absoluteUrl(profile.resumeHref)})`] : []),
    `- Email: ${profile.email}`,
    "",
    `_${site.description}_`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
