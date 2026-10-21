"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { Icon } from "./Sprite";
import { switchTheme } from "./ThemeToggle";
import {
  HOME_SECTIONS,
  filterCommands,
  groupCommands,
  type Command,
} from "@/lib/commands";
import { prefersReducedMotion } from "@/lib/motion";
import { profile } from "@/content/profile";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";
import { asset } from "@/content/site";

const COPIED_MS = 900;

function buildCommands(): Command[] {
  return [
    ...HOME_SECTIONS.map((s): Command => ({
      id: `go-${s.id}`,
      group: "Go to",
      label: s.label,
      icon: s.icon,
      kind: "section",
      target: s.id,
    })),
    ...notes.map((n): Command => ({
      id: `note-${n.slug}`,
      group: "Notes",
      label: n.title,
      keywords: n.tags.join(" "),
      icon: "file",
      kind: "route",
      target: `/notes/${n.slug}/`,
    })),
    ...projects.map((p): Command => ({
      id: `project-${p.slug}`,
      group: "Projects",
      label: p.name,
      keywords: `case study ${p.category} ${p.stack.join(" ")}`,
      icon: "layers",
      kind: "route",
      target: `/work/${p.slug}/`,
    })),
    {
      id: "uses",
      group: "Go to",
      label: "What I use",
      keywords: "uses setup tools stack",
      icon: "layers",
      kind: "route",
      target: "/uses/",
    },
    {
      id: "copy-email",
      group: "Actions",
      label: "Copy email address",
      keywords: "mail contact",
      icon: "copy",
      kind: "action",
      target: "copy-email",
    },
    {
      id: "send-email",
      group: "Actions",
      label: "Send an email",
      keywords: "mail contact",
      icon: "envelope",
      kind: "external",
      target: `mailto:${profile.email}`,
    },
    ...(profile.resumeHref
      ? [
          {
            id: "download-cv",
            group: "Actions",
            label: "Download CV",
            keywords: "resume pdf",
            icon: "download",
            kind: "download",
            target: asset(profile.resumeHref),
          } satisfies Command,
        ]
      : []),
    ...(profile.calLink
      ? [
          {
            id: "book-call",
            group: "Actions",
            label: "Book a call",
            keywords: "meeting calendar cal",
            icon: "calendar",
            kind: "action",
            target: "book-call",
          } satisfies Command,
        ]
      : []),
    {
      id: "rss",
      group: "Actions",
      label: "Follow notes via RSS",
      keywords: "feed subscribe",
      icon: "file",
      kind: "external",
      target: asset("/feed.xml"),
    },
    {
      id: "switch-theme",
      group: "Actions",
      label: "Switch theme",
      keywords: "dark light mode",
      icon: "moon",
      kind: "action",
      target: "switch-theme",
    },
    ...profile.socials
      .filter((s) => s.kind !== "email")
      .map((s): Command => ({
        id: `social-${s.kind}`,
        group: "Actions",
        label: `Open ${s.label}`,
        keywords: "profile social",
        icon: s.kind,
        kind: "external",
        target: s.href,
      })),
  ];
}

const COMMANDS = buildCommands();

export function CommandMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const router = useRouter();
  const pathname = usePathname();
  const uid = useId().replace(/[^\w-]/g, "");

  const results = useMemo(() => filterCommands(COMMANDS, query), [query]);
  const optionId = (i: number) => `${uid}-opt-${i}`;
  const groupId = (group: string) =>
    `${uid}-group-${group.toLowerCase().replace(/\W+/g, "-")}`;

  const show = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setActive(0);
    setCopyState("idle");
    setOpen(true);
    dialog.showModal();
    document.documentElement.classList.add("palette-open");
  }, []);

  const hide = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const onClose = () => {
      setOpen(false);
      document.documentElement.classList.remove("palette-open");
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog?.open) hide();
        else show();
      }
    };
    dialog?.addEventListener("close", onClose);
    window.addEventListener("keydown", onKey);
    document.addEventListener("command-menu:open", show);
    return () => {
      dialog?.removeEventListener("close", onClose);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("command-menu:open", show);
    };
  }, [show, hide]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`${uid}-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, uid]);

  function goToSection(id: string) {
    if (pathname !== "/") {
      router.push(`/#${id}` as Route, { transitionTypes: ["nav-back"] });
      return;
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
  }

  function run(command: Command) {
    if (command.target === "copy-email") {
      Promise.resolve(navigator.clipboard?.writeText(profile.email))
        .then(() => {
          if (!navigator.clipboard) throw new Error("no clipboard");
          setCopyState("copied");
          window.setTimeout(hide, COPIED_MS);
        })
        .catch(() => setCopyState("failed"));
      return;
    }

    hide();
    requestAnimationFrame(() => {
      switch (command.kind) {
        case "section":
          goToSection(command.target);
          break;
        case "route":
          router.push(command.target as Route, {
            transitionTypes: ["nav-forward"],
          });
          break;
        case "external":
          if (command.target.startsWith("mailto:")) {
            location.href = command.target;
          } else {
            window.open(command.target, "_blank", "noopener,noreferrer");
          }
          break;
        case "download": {
          const link = document.createElement("a");
          link.href = command.target;
          link.download = "";
          link.click();
          break;
        }
        case "action":
          if (command.target === "switch-theme") switchTheme();
          if (command.target === "book-call") {
            document.querySelector<HTMLElement>("[data-book-call]")?.click();
          }
          break;
      }
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  }

  const isMac = open && /Mac|iPhone|iPad/.test(navigator.userAgent);

  return (
    <dialog
      ref={dialogRef}
      className="cmdk"
      aria-label="Command menu"
      onClick={(e) => {
        if (e.target === e.currentTarget) hide();
      }}
    >
      {open && (
        <div className="cmdk__panel">
          <div className="cmdk__search">
            <Icon id="search" className="cmdk__search-icon" />
            <input
              ref={inputRef}
              className="cmdk__input"
              role="combobox"
              aria-expanded="true"
              aria-controls={`${uid}-list`}
              aria-activedescendant={
                results.length ? optionId(active) : undefined
              }
              aria-autocomplete="list"
              placeholder="Search sections, notes, projects…"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <kbd className="cmdk__kbd">esc</kbd>
          </div>

          <div
            id={`${uid}-list`}
            role="listbox"
            aria-label="Commands"
            className="cmdk__list"
          >
            {groupCommands(results).map(([group, items]) => (
              <div
                key={group}
                role="group"
                aria-labelledby={groupId(group)}
                className="cmdk__group"
              >
                <p id={groupId(group)} className="cmdk__heading">
                  {group}
                </p>
                {items.map((command) => {
                  const i = results.indexOf(command);
                  return (
                    <div
                      key={command.id}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      className="cmdk__item"
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(command)}
                    >
                      <Icon id={command.icon} className="cmdk__icon" />
                      <span className="cmdk__label">
                        {command.id !== "copy-email" || copyState === "idle"
                          ? command.label
                          : copyState === "copied"
                            ? "Copied ✓"
                            : profile.email}
                      </span>
                      {command.kind === "external" && (
                        <Icon id="arrow-up-right" className="cmdk__hint" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {results.length === 0 && (
              <p className="cmdk__empty">No results for “{query}”</p>
            )}
          </div>

          <p className="cmdk__foot">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> open
            </span>
            <span>
              <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd>K</kbd> toggle
            </span>
          </p>
        </div>
      )}
    </dialog>
  );
}
