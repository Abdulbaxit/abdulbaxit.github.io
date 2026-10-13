import Link from "next/link";
import type { Route } from "next";
import { SectionHeading } from "./SectionHeading";
import { notes } from "@/content/notes";
import { formatDate } from "@/lib/prose";

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
            <Link href={`/notes/${note.slug}/` as Route} className="note-row">
              <span className="note-row__meta">
                <time dateTime={note.date}>{formatDate(note.date)}</time>
                <span aria-hidden="true"> · </span>
                {note.tags.join(" · ")}
              </span>
              <span className="note-row__title">{note.title}</span>
              <span className="note-row__desc">{note.description}</span>
              <span className="note-row__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
