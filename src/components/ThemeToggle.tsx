"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./Sprite";

/**
 * A choice made with the toggle is stored and wins; until then the theme
 * follows the visitor's OS setting. Run inline in <head> so a dark-mode
 * visitor never sees a white flash before React boots.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;if(s==="dark"||(s!=="light"&&m)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

/** Length of the circular reveal. */
const REVEAL_MS = 800;
/** Width of the reveal's soft edge; keep in step with globals.css. */
const FEATHER_PX = 56;
/** Length of the colour cross-fade where View Transitions aren't supported. */
const FADE_MS = 450;

function storedTheme(): "dark" | "light" | null {
  try {
    const value = localStorage.getItem("theme");
    return value === "dark" || value === "light" ? value : null;
  } catch {
    // Storage blocked (private mode, cookie settings). Fall back to the OS.
    return null;
  }
}

/**
 * The theme lives on <html>, put there by the inline script before React
 * boots. Reading it through useSyncExternalStore keeps React in step with
 * that external state instead of racing it from an effect.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // With no stored choice, keep following the OS if it flips mid-visit.
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

// On the server there is no class yet, so render the light-mode icon and
// let the first client read correct it.
const serverSnapshot = () => false;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, serverSnapshot);

  function apply() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage blocked; the class still applies for this session.
    }
  }

  /**
   * The new theme spreads out from the button in a circle with a soft,
   * feathered edge. The browser snapshots the page, the class flips, and
   * the new snapshot is revealed through a radial mask whose radius
   * (--vt-r) is animated here; the mask itself is in globals.css.
   *
   * While it runs, `theme-switching` hides the custom cursor and shows the
   * native one: the page is a still snapshot for the duration, so the
   * custom cursor would freeze in it. Without View Transitions the colours
   * cross-fade instead; under reduced motion the theme just switches.
   */
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
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
    // Far enough for the feathered edge to clear the furthest corner.
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
            // Hold the full radius once done. Without this --vt-r drops back
            // to 0 for the frame before the snapshots are removed, the mask
            // hides the new theme, and the old one flashes through.
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // Transition skipped (e.g. tab hidden); the theme still changed.
      });
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
