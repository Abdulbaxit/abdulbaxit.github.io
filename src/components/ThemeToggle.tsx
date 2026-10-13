"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./Sprite";
import { prefersReducedMotion } from "@/lib/motion";

export const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;if(s==="dark"||(s!=="light"&&m)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

const REVEAL_MS = 800;
const FEATHER_PX = 56;
const FADE_MS = 450;

function storedTheme(): "dark" | "light" | null {
  try {
    const value = localStorage.getItem("theme");
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMediaChange = (e: MediaQueryListEvent) => {
    if (storedTheme()) return;
    document.documentElement.classList.toggle("dark", e.matches);
  };
  media.addEventListener("change", onMediaChange);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onMediaChange);
  };
}

const isDark = () => document.documentElement.classList.contains("dark");

const serverSnapshot = () => false;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, serverSnapshot);

  function apply() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      apply();
      return;
    }
    if (!document.startViewTransition) {
      root.classList.add("theme-fade");
      apply();
      window.setTimeout(() => root.classList.remove("theme-fade"), FADE_MS);
      return;
    }

    const box = e.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const r =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      ) + FEATHER_PX;

    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.classList.add("theme-switching");

    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { "--vt-r": ["0px", `${r}px`] },
          {
            duration: REVEAL_MS,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => {
      root.classList.remove("theme-switching");
      root.style.removeProperty("--vt-x");
      root.style.removeProperty("--vt-y");
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`cursor-pointer ${className}`}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      suppressHydrationWarning
    >
      <Icon id={dark ? "moon" : "sun"} className="text-lg" />
    </button>
  );
}
