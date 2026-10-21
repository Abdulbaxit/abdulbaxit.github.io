import {
  profile,
  experience,
  education,
  certificates,
  skills,
  readme,
  recommendations,
  isCurrentRole,
} from "@/content/profile";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";
import { site, absoluteUrl } from "@/content/site";

export const dynamic = "force-static";

const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

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
    "## Education",
    "",
    ...education.map(
      (e) => `- ${e.degree}, ${e.school}, ${e.period}: ${e.summary}`,
    ),
    ...certificates.map((c) => `- ${c.title}, ${c.from}`),
    "",
    "## Skills",
    "",
    ...skills.map(
      (s) => `- ${s.title[0].toUpperCase()}${s.title.slice(1)}: ${s.body}`,
    ),
    `- Core stack: ${profile.heroStack.join(", ")}`,
    "",
    "## Projects",
    "",
    ...projects.map(
      (p) =>
        `- [${p.name}](${absoluteUrl(`/work/${p.slug}/`)}) (${p.stack.join(", ")}): ${p.caseStudy.summary}`,
    ),
    "",
  ];

  if (recommendations.length) {
    lines.push(
      "## Recommendations",
      "",
      ...recommendations.map(
        (r) => `> "${r.quote}"\n> — ${r.name}, ${r.role}\n`,
      ),
    );
  }

  if (notes.length) {
    lines.push(
      "## Notes",
      "",
      ...notes.map(
        (n) =>
          `- [${n.title}](${absoluteUrl(`/notes/${n.slug}/`)}): ${n.description}`,
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
    ...(profile.resumeHref
      ? [`- [CV (PDF)](${absoluteUrl(profile.resumeHref)})`]
      : []),
    `- Email: ${profile.email}`,
    "",
    `_${site.description}_`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
