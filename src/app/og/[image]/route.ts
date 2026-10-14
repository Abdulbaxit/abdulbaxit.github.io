import { notFound } from "next/navigation";
import { getNote, notes } from "@/content/notes";
import { getProject, projects } from "@/content/projects";
import { formatDate } from "@/lib/prose";
import { ogImage } from "@/lib/og";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    ...notes.map((n) => ({ image: `note-${n.slug}.png` })),
    ...projects.map((p) => ({ image: `work-${p.slug}.png` })),
  ];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ image: string }> },
) {
  const { image } = await params;
  const [, kind, slug] = image.match(/^(note|work)-(.+)\.png$/) ?? [];

  const note = kind === "note" ? getNote(slug) : undefined;
  if (note) {
    return ogImage({
      kicker: `Note · ${formatDate(note.date)}`,
      title: note.title,
      description: note.description,
    });
  }

  const project = kind === "work" ? getProject(slug) : undefined;
  if (project) {
    return ogImage({
      kicker: `Case study · ${project.category}`,
      title: project.name,
      description: project.caseStudy.summary,
    });
  }

  notFound();
}
