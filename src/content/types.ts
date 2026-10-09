/**
 * Every fact the site renders is typed here and supplied from the files
 * beside this one. Components read from content; they never hardcode a
 * name, a link or a number.
 */

import type { DiagramId } from "./diagrams";

export type SocialKind = "github" | "linkedin" | "email";

export interface SocialLink {
  kind: SocialKind;
  /** Shown as the accessible label, e.g. "GitHub". */
  label: string;
  /** Full URL. For email use a mailto: URL. */
  href: string;
}

/**
 * One reason someone might get in touch. Each becomes a chip in the hero's
 * contact panel that opens a compose window with the subject and a starter
 * body already written, so nobody faces a blank email.
 */
export interface ContactReason {
  /** Chip text, e.g. "Hiring". */
  label: string;
  subject: string;
  /** Starter body, written as the visitor. Use \n for line breaks. */
  body: string;
}

export interface Profile {
  name: string;
  /** The name as the lines the hero animates, one entry per line. */
  nameLines: string[];
  /** Wordmark in the left rail and footer, e.g. "ab". */
  initials: string;
  role: string;
  /** One or two sentences under the role. */
  tagline: string;
  location: string;
  email: string;
  /** Shown as chips in the hero. Keep it to what you want to be hired for. */
  heroStack: string[];
  contactReasons: ContactReason[];
  /**
   * Cal.com booking link as "username/event-slug". Null hides the
   * "Book a call" pill in the dock.
   */
  calLink: string | null;
  /** Cal.com embed namespace, as shown in their generated snippet. */
  calNamespace: string | null;
  /** Path to the résumé within /public, or null to hide résumé links. */
  resumeHref: string | null;
  /**
   * Square image in the hero medallion, within /public. Null shows the
   * initials instead.
   */
  portrait: string | null;
  socials: SocialLink[];
  /** Badge in the hero, e.g. "Open to new opportunities". Null hides it. */
  availability: string | null;
  /** IANA time zone for the local clock in Contact, e.g. "Asia/Karachi". */
  timeZone: string;
  /** Shown beside the local time, e.g. "I usually reply within a day". */
  replyNote: string | null;
  /** GitHub username for the activity section. Null hides the section. */
  github: string | null;
  /** Tools for the scrolling strip under the hero. Empty hides it. */
  toolbelt: string[];
}

/** A quote from someone you've worked with. Only add ones you have permission to use. */
export interface Recommendation {
  quote: string;
  name: string;
  /** e.g. "Engineering Lead, Techanzy". */
  role: string;
  /** Their LinkedIn or site, if they're happy to be linked. */
  href?: string;
}

/** A short technical note at /notes/<slug>/. */
export interface Note {
  slug: string;
  title: string;
  /** One sentence for the list, search results and link previews. */
  description: string;
  /** ISO date, e.g. "2026-10-09". */
  date: string;
  tags: string[];
  /**
   * The body, in a small subset of Markdown: "## " headings, "- " list
   * items, ``` fenced code, `inline code`, and blank-line paragraphs.
   */
  body: string;
}

/** One role held at a company. */
export interface Role {
  title: string;
  /** e.g. "Apr 2026 — present". */
  period: string;
  /** What the role covered. One or two sentences. */
  summary: string;
  /** Optional specifics, shown as a short list under the summary. */
  highlights?: string[];
}

/**
 * One employer, with every role held there. Grouping roles under the
 * company makes a promotion read as progression, not two separate jobs.
 */
export interface Job {
  company: string;
  /** The employer's own site, if there is a public one. */
  href?: string;
  /** e.g. "Remote · Part-time". Omit when there is nothing to add. */
  terms?: string;
  /** Newest first. */
  roles: Role[];
}

export interface SkillBlock {
  /** e.g. "backend" — rendered uppercase. */
  title: string;
  body: string;
}

export interface ImpactStat {
  /** The large numeral, e.g. "90". */
  value: string;
  /** Small suffix rendered beside it, e.g. "%" or "+". */
  suffix?: string;
  label: string;
}

export interface StatusLine {
  /** Icon id from the sprite, e.g. "microscope". */
  icon: string;
  /** Leading verb, e.g. "Building". Omit for a plain line. */
  verb?: string;
  text: string;
  href?: string;
}

export type ProjectVisual =
  /** An interactive architecture diagram from content/diagrams.ts. */
  | { kind: "diagram"; diagram: DiagramId }
  | { kind: "gradient"; from: string; to: string };

export interface Project {
  name: string;
  /** Joined with · on the card. */
  stack: string[];
  /** Grouping heading in Works, e.g. "Web Applications". */
  category: string;
  /** Live URL. Without one the card is not a link. */
  href?: string;
  /** Badge on a gradient tile, e.g. "Client work · access restricted". */
  tag?: string;
  /** Body copy on a gradient tile. */
  blurb?: string;
  visual: ProjectVisual;
}
