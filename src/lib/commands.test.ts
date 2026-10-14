import { describe, expect, it } from "vitest";
import {
  HOME_SECTIONS,
  filterCommands,
  groupCommands,
  type Command,
} from "./commands";

const cmd = (id: string, group: string, label: string, keywords?: string) =>
  ({
    id,
    group,
    label,
    keywords,
    icon: "hash",
    kind: "action",
    target: id,
  }) as Command;

const list: Command[] = [
  cmd("home", "Go to", "Home"),
  cmd("edu", "Go to", "Education"),
  cmd("exp", "Go to", "Experience"),
  cmd(
    "note",
    "Notes",
    "Keeping a RAG chatbot inside one case file",
    "rag llms",
  ),
  cmd("copy", "Actions", "Copy email address", "mail contact"),
  cmd("theme", "Actions", "Switch theme", "dark light mode"),
];

const ids = (commands: Command[]) => commands.map((c) => c.id);

describe("filterCommands", () => {
  it("returns everything, in order, for an empty query", () => {
    expect(filterCommands(list, "")).toEqual(list);
    expect(filterCommands(list, "   ")).toEqual(list);
  });

  it("ranks a prefix above a match inside a word", () => {
    expect(ids(filterCommands(list, "e"))).toEqual([
      "edu",
      "exp",
      "home",
      "copy",
      "theme",
      "note",
    ]);
  });

  it("matches the start of any word", () => {
    expect(ids(filterCommands(list, "chat"))).toEqual(["note"]);
  });

  it("matches keywords", () => {
    expect(ids(filterCommands(list, "dark"))).toEqual(["theme"]);
    expect(ids(filterCommands(list, "mail"))).toEqual(["copy"]);
  });

  it("falls back to letters in order", () => {
    expect(ids(filterCommands(list, "eu"))).toEqual(["edu"]);
  });

  it("is case-insensitive", () => {
    expect(ids(filterCommands(list, "EDU"))).toEqual(["edu"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterCommands(list, "zzz")).toEqual([]);
  });

  it("leads with the group holding the best match", () => {
    expect(ids(filterCommands(list, "co"))[0]).toBe("copy");
    expect(ids(filterCommands(list, "mode"))).toEqual(["theme"]);
  });

  it("does not match letters scattered through keywords", () => {
    expect(filterCommands(list, "rms")).toEqual([]);
  });
});

describe("groupCommands", () => {
  it("groups in order of first appearance", () => {
    expect(
      groupCommands(list).map(([group, items]) => [group, items.length]),
    ).toEqual([
      ["Go to", 3],
      ["Notes", 1],
      ["Actions", 2],
    ]);
  });
});

describe("HOME_SECTIONS", () => {
  it("has unique ids", () => {
    const sectionIds = HOME_SECTIONS.map((s) => s.id);
    expect(new Set(sectionIds).size).toBe(sectionIds.length);
  });
});
