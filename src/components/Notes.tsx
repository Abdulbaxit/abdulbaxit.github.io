import Link from "next/link";
import type { Route } from "next";
import { notes } from "@/content/notes";
import { formatDate } from "@/lib/prose";

/** The list of notes on the home page; each row opens /notes/<slug>/. */
export function Notes() {
  if (notes.length === 0) return null;

  return (
    <section id="notes" className="mt-12 md:mt-32">
      <h2
        data-decode
        className="text-3xl leading-none font-bold md:text-4xl"
        style={{ color: "var(--text-strong)" }}
      >
        Notes
      </h2>
      <p className="mt-2 text-lg">Short write-ups on things I&rsquo;ve built</p>
      <div className="kj-border" />

      <ul className="note-list">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link
              href={`/notes/${note.slug}/` as Route}
              className="note-row"
            >
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
