import { describe, expect, it } from "vitest";
import { runCommand, type TerminalData } from "./terminal";

const data: TerminalData = {
  name: "Abdul Basit",
  role: "Software Engineer",
  email: "me@example.com",
  cv: "/cv.pdf",
  projects: [{ slug: "legiflow", name: "Legiflow" }],
  notes: [{ slug: "keeping-a-rag-chatbot", title: "Keeping a RAG chatbot" }],
};

describe("runCommand", () => {
  it("lists every command for help", () => {
    expect(runCommand("help", data).output.length).toBeGreaterThan(5);
  });

  it("goes to a section with cd", () => {
    expect(runCommand("cd works", data).action).toEqual({
      type: "navigate",
      href: "/#works",
    });
    expect(runCommand("cd #contact", data).action).toEqual({
      type: "navigate",
      href: "/#contact",
    });
    expect(runCommand("cd nowhere", data).action).toBeUndefined();
  });

  it("opens projects and notes by name or slug", () => {
    expect(runCommand("open Legiflow", data).action).toEqual({
      type: "navigate",
      href: "/work/legiflow/",
    });
    expect(runCommand("open keeping", data).action).toEqual({
      type: "navigate",
      href: "/notes/keeping-a-rag-chatbot/",
    });
    expect(runCommand("open missing", data).action).toBeUndefined();
  });

  it("handles the small commands", () => {
    expect(runCommand("whoami", data).output).toEqual([
      "Abdul Basit, Software Engineer",
    ]);
    expect(runCommand("theme", data).action).toEqual({ type: "theme" });
    expect(runCommand("clear", data).action).toEqual({ type: "clear" });
    expect(runCommand("cv", data).action).toEqual({
      type: "open",
      href: "/cv.pdf",
    });
    expect(runCommand("  HOME  ", data).action).toEqual({
      type: "navigate",
      href: "/",
    });
  });

  it("explains an unknown command", () => {
    expect(runCommand("rm -rf /", data).output[0]).toMatch(
      /command not found: rm/,
    );
    expect(runCommand("", data).output).toEqual([]);
  });
});
