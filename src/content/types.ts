import type { DiagramId } from "./diagrams";

export type SocialKind = "github" | "linkedin" | "email";

export interface SocialLink {
  kind: SocialKind;
  label: string;
  href: string;
}

export interface ContactReason {
  label: string;
  subject: string;
  body: string;
}

export interface Profile {
  name: string;
  nameLines: string[];
  initials: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  heroStack: string[];
  contactReasons: ContactReason[];
  calLink: string | null;
  calNamespace: string | null;
  resumeHref: string | null;
  portrait: string | null;
  socials: SocialLink[];
  availability: string | null;
  timeZone: string;
  replyNote: string | null;
  github: string | null;
  toolbelt: string[];
}

export interface Recommendation {
  quote: string;
  name: string;
  role: string;
  href?: string;
}

export interface Note {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  body: string;
}

export interface Role {
  title: string;
  period: string;
  summary: string;
  highlights?: string[];
}

export interface Job {
  company: string;
  href?: string;
  terms?: string;
  roles: Role[];
}

export interface Education {
  school: string;
  href?: string;
  degree: string;
  period: string;
  summary: string;
  highlights?: string[];
}

export interface SkillBlock {
  title: string;
  body: string;
}

export interface ImpactStat {
  value: string;
  suffix?: string;
  label: string;
}

export interface StatusLine {
  icon: string;
  verb?: string;
  text: string;
  href?: string;
}

export type ProjectVisual =
  | { kind: "diagram"; diagram: DiagramId }
  | { kind: "gradient"; from: string; to: string };

export interface Project {
  name: string;
  stack: string[];
  category: string;
  href?: string;
  tag?: string;
  blurb?: string;
  visual: ProjectVisual;
}
