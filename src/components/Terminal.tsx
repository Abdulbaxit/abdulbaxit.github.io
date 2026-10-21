"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { switchTheme } from "./ThemeToggle";
import { runCommand, type TerminalData } from "@/lib/terminal";

interface Line {
  id: number;
  text: string;
  input?: boolean;
}

export function Terminal({ data }: { data: TerminalData }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([
    { id: 0, text: "This page doesn't exist, but this terminal does." },
    { id: 1, text: "Type help to see what you can do." },
  ]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(2);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [lines]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const input = value;
    setValue("");
    if (input.trim()) history.current.push(input);
    cursor.current = history.current.length;

    const { output, action } = runCommand(input, data);
    if (action?.type === "clear") {
      setLines([]);
      return;
    }
    const added = [
      { text: input, input: true },
      ...output.map((text) => ({ text })),
    ];
    setLines((prev) => [
      ...prev,
      ...added.map((line) => ({ ...line, id: nextId.current++ })),
    ]);

    if (action?.type === "navigate") router.push(action.href);
    if (action?.type === "open") window.open(action.href, "_blank", "noopener");
    if (action?.type === "theme") switchTheme();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const past = history.current;
    if (e.key === "ArrowUp" && past.length) {
      e.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(past[cursor.current]);
    } else if (e.key === "ArrowDown" && past.length) {
      e.preventDefault();
      cursor.current = Math.min(past.length, cursor.current + 1);
      setValue(past[cursor.current] ?? "");
    }
  }

  return (
    <div
      className="terminal"
      onClick={() => document.getElementById("terminal-input")?.focus()}
    >
      <div className="terminal__bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div
        ref={screenRef}
        className="terminal__screen"
        role="log"
        aria-live="polite"
      >
        {lines.map((line) => (
          <p
            key={line.id}
            className={line.input ? "terminal__echo" : undefined}
          >
            {line.input && <span className="terminal__prompt">➜ ~ </span>}
            {line.text}
          </p>
        ))}
      </div>
      <form onSubmit={submit} className="terminal__form">
        <label htmlFor="terminal-input" className="terminal__prompt">
          ➜ ~<span className="sr-only">Terminal command</span>
        </label>
        <input
          id="terminal-input"
          className="terminal__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
