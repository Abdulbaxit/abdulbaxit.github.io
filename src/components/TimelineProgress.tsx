"use client";

import { useEffect } from "react";

/** Where on screen the timeline counts as "read": 60% of the way down. */
const READ_LINE = 0.6;

/**
 * Fills each employer's rail in the Experience timeline as you scroll, and
 * marks each role reached once the read line passes its marker. Writes
 * --fill on .tl__roles and toggles .is-reached on .tl__role; the drawing
 * is in globals.css. Under reduced motion the rails are simply full.
 * Renders nothing itself.
 */
export function TimelineProgress() {
  useEffect(() => {
    const rails = Array.from(document.querySelectorAll<HTMLElement>("#experience .tl__roles"));
    const roles = Array.from(document.querySelectorAll<HTMLElement>("#experience .tl__role"));
    if (!rails.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rails.forEach((r) => r.style.setProperty("--fill", "1"));
      roles.forEach((r) => r.classList.add("is-reached"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * READ_LINE;
      for (const rail of rails) {
        const box = rail.getBoundingClientRect();
        const fill = box.height ? (line - box.top) / box.height : 0;
        rail.style.setProperty("--fill", Math.min(1, Math.max(0, fill)).toFixed(4));
      }
      for (const role of roles) {
        // The marker sits ~0.35rem below the role's top edge.
        role.classList.toggle("is-reached", role.getBoundingClientRect().top + 6 <= line);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
