import Link from "next/link";
import type { Route } from "next";
import { SectionHeading } from "./SectionHeading";
import { NoteTitle } from "./PageSlide";
import { notes } from "@/content/notes";
import { formatDate, readingMinutes } from "@/lib/prose";
import { asset } from "@/content/site";

export function Notes() {
  if (notes.length === 0) return null;

  return (
    <section id="notes" className="mt-12 md:mt-32">
      <SectionHeading
        title="Notes"
        subtitle="Short write-ups on things I’ve built"
      />

      <ul className="note-list">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link
              href={`/notes/${note.slug}/` as Route}
              transitionTypes={["nav-forward"]}
              className="note-row"
            >
              <span className="note-row__meta">
                <time dateTime={note.date}>{formatDate(note.date)}</time>
                <span aria-hidden="true"> · </span>
                {readingMinutes(note.body)} min read
                <span aria-hidden="true"> · </span>
                {note.tags.join(" · ")}
              </span>
              <NoteTitle slug={note.slug}>
                <span className="note-row__title">{note.title}</span>
              </NoteTitle>
              <span className="note-row__desc">{note.description}</span>
              <span className="note-row__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <a href={asset("/feed.xml")} className="notes-rss f-link">
        Follow via RSS
      </a>
    </section>
  );
}
