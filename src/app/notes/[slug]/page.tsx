import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Sprite";
import { Prose } from "@/components/Prose";
import { PageSlide, NoteTitle } from "@/components/PageSlide";
import { notes, getNote } from "@/content/notes";
import { profile } from "@/content/profile";
import { absoluteUrl } from "@/content/site";
import { formatDate, readingMinutes } from "@/lib/prose";
import { ogImageMeta } from "@/lib/og";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};

  const url = absoluteUrl(`/notes/${note.slug}/`);
  const image = ogImageMeta(`/og/note-${note.slug}.png`, note.title);
  return {
    title: note.title,
    description: note.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: profile.name,
      title: note.title,
      description: note.description,
      url,
      publishedTime: note.date,
      authors: [profile.name],
      tags: note.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.description,
      images: [image.url],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const url = absoluteUrl(`/notes/${note.slug}/`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    description: note.description,
    datePublished: note.date,
    url,
    mainEntityOfPage: url,
    keywords: note.tags.join(", "),
    author: {
      "@type": "Person",
      "@id": absoluteUrl("/#person"),
      name: profile.name,
      url: absoluteUrl("/"),
    },
  };

  return (
    <PageSlide>
      <article className="note mt-10 max-w-3xl">
        <div className="read-progress" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href="/#notes"
          transitionTypes={["nav-back"]}
          className="f-link text-sm"
        >
          <Icon id="arrow-left" className="mr-1" />
          All notes
        </Link>

        <header className="mt-8">
          <p className="note__meta">
            <time dateTime={note.date}>{formatDate(note.date)}</time>
            <span>{readingMinutes(note.body)} min read</span>
            {note.tags.map((tag) => (
              <span key={tag} className="note__tag">
                {tag}
              </span>
            ))}
          </p>
          <NoteTitle slug={note.slug}>
            <h1 className="note__title">{note.title}</h1>
          </NoteTitle>
          <div className="section-rule" />
          <p className="note__lede">{note.description}</p>
        </header>

        <Prose source={note.body} />

        <footer className="note__foot">
          <p>
            Written by {profile.name}, {profile.role.toLowerCase()} in{" "}
            {profile.location.split(",")[0]}.
          </p>
          <Link
            href="/#contact"
            transitionTypes={["nav-back"]}
            className="f-link font-bold"
          >
            Get in touch
          </Link>
        </footer>
      </article>
    </PageSlide>
  );
}
