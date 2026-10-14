export type CommandKind =
  "section" | "route" | "external" | "download" | "action";

export interface Command {
  id: string;
  group: string;
  label: string;
  keywords?: string;
  icon: string;
  kind: CommandKind;
  target: string;
}

export const HOME_SECTIONS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "about", label: "About me", icon: "hash" },
  { id: "skills", label: "Skills", icon: "layers" },
  { id: "experience", label: "Experience", icon: "briefcase" },
  { id: "education", label: "Education", icon: "hash" },
  { id: "works", label: "Works", icon: "file" },
  { id: "recommendations", label: "Kind words", icon: "users" },
  { id: "notes", label: "Notes", icon: "file" },
  { id: "github", label: "On GitHub", icon: "github" },
  { id: "contact", label: "Contact", icon: "envelope" },
] as const;

function rank(text: string, query: string, loose: boolean): number {
  const t = text.toLowerCase();
  if (t.startsWith(query)) return 0;
  if (t.split(/[^a-z0-9]+/).some((word) => word.startsWith(query))) return 1;
  if (t.includes(query)) return 2;
  if (!loose) return Infinity;
  let matched = 0;
  for (const ch of t) if (ch === query[matched]) matched++;
  return matched === query.length ? 3 : Infinity;
}

export function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands;

  const best = commands
    .map((command, index) => ({
      command,
      index,
      score: Math.min(
        rank(command.label, q, true),
        command.keywords ? rank(command.keywords, q, false) + 0.5 : Infinity,
      ),
    }))
    .filter((r) => r.score !== Infinity)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((r) => r.command);

  return groupCommands(best).flatMap(([, items]) => items);
}

export function groupCommands(commands: Command[]): [string, Command[]][] {
  const groups = new Map<string, Command[]>();
  for (const c of commands) {
    const list = groups.get(c.group) ?? [];
    list.push(c);
    groups.set(c.group, list);
  }
  return Array.from(groups);
}
