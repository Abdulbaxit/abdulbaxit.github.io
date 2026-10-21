import type { Route } from "next";
import { HOME_SECTIONS } from "./commands";

export interface TerminalData {
  name: string;
  role: string;
  email: string;
  cv: string | null;
  projects: { slug: string; name: string }[];
  notes: { slug: string; title: string }[];
}

export type TerminalAction =
  | { type: "navigate"; href: Route }
  | { type: "open"; href: string }
  | { type: "theme" }
  | { type: "clear" };

export interface TerminalResult {
  output: string[];
  action?: TerminalAction;
}

const HELP = [
  "help              this list",
  "ls                sections of the site",
  "cd <section>      go to a section, e.g. cd works",
  "projects          list projects",
  "notes             list notes",
  "open <name>       open a project or note",
  "whoami            who built this",
  "contact           how to reach me",
  "cv                download my CV",
  "theme             switch light / dark",
  "home              back to the home page",
  "clear             clear the screen",
];

export function runCommand(input: string, data: TerminalData): TerminalResult {
  const [cmd = "", ...rest] = input.trim().split(/\s+/);
  const arg = rest.join(" ").toLowerCase();

  switch (cmd.toLowerCase()) {
    case "":
      return { output: [] };
    case "help":
      return { output: HELP };
    case "ls":
      return { output: [HOME_SECTIONS.map((s) => s.id).join("  ")] };
    case "cd": {
      const target = arg.replace(/^[/#~]+/, "");
      if (!target || target === "..") {
        return {
          output: ["Going home…"],
          action: { type: "navigate", href: "/" },
        };
      }
      const section = HOME_SECTIONS.find((s) => s.id === target);
      if (!section) return { output: [`cd: no such section: ${arg}. Try ls.`] };
      return {
        output: [`Going to ${section.label}…`],
        action: { type: "navigate", href: `/#${section.id}` as Route },
      };
    }
    case "projects":
      return {
        output: data.projects.map((p) => `${p.slug.padEnd(20)}${p.name}`),
      };
    case "notes":
      return { output: data.notes.map((n) => `${n.slug}`) };
    case "open": {
      if (!arg) return { output: ["open: which one? Try projects or notes."] };
      const project = data.projects.find(
        (p) => p.slug === arg || p.name.toLowerCase() === arg,
      );
      if (project) {
        return {
          output: [`Opening ${project.name}…`],
          action: { type: "navigate", href: `/work/${project.slug}/` as Route },
        };
      }
      const note = data.notes.find(
        (n) => n.slug === arg || n.slug.startsWith(arg),
      );
      if (note) {
        return {
          output: [`Opening ${note.title}…`],
          action: { type: "navigate", href: `/notes/${note.slug}/` as Route },
        };
      }
      return {
        output: [`open: nothing called ${arg}. Try projects or notes.`],
      };
    }
    case "whoami":
      return { output: [`${data.name}, ${data.role}`] };
    case "contact":
      return { output: [`Email: ${data.email}`, "Or type cd contact."] };
    case "cv":
      if (!data.cv) return { output: ["cv: not available right now."] };
      return {
        output: ["Downloading my CV…"],
        action: { type: "open", href: data.cv },
      };
    case "theme":
      return { output: ["Switching theme…"], action: { type: "theme" } };
    case "home":
    case "exit":
      return {
        output: ["Going home…"],
        action: { type: "navigate", href: "/" },
      };
    case "clear":
      return { output: [], action: { type: "clear" } };
    case "sudo":
      return { output: ["Permission denied. Nice try."] };
    default:
      return { output: [`command not found: ${cmd}. Type help.`] };
  }
}
