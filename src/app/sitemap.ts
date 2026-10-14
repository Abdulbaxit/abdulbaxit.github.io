import type { MetadataRoute } from "next";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";
import { absoluteUrl } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...notes.map((note) => ({
      url: absoluteUrl(`/notes/${note.slug}/`),
      lastModified: new Date(note.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
