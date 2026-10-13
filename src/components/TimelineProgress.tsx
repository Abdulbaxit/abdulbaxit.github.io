"use client";

import { useEffect } from "react";
import { clamp, frameThrottle, prefersReducedMotion } from "@/lib/motion";

const READ_LINE = 0.6;
const MARKER_OFFSET_PX = 6;

export function TimelineProgress() {
  useEffect(() => {
    const rails = Array.from(
      document.querySelectorAll<HTMLElement>(".tl__roles"),
    );
    const roles = Array.from(
      document.querySelectorAll<HTMLElement>(".tl__role"),
    );
    if (!rails.length) return;

    if (prefersReducedMotion()) {
      rails.forEach((r) => r.style.setProperty("--fill", "1"));
      roles.forEach((r) => r.classList.add("is-reached"));
      return;
    }

    const update = () => {
      const line = window.innerHeight * READ_LINE;
      for (const rail of rails) {
        const box = rail.getBoundingClientRect();
        const fill = box.height ? (line - box.top) / box.height : 0;
        rail.style.setProperty("--fill", clamp(fill, 0, 1).toFixed(4));
      }
      for (const role of roles) {
        role.classList.toggle(
          "is-reached",
          role.getBoundingClientRect().top + MARKER_OFFSET_PX <= line,
        );
      }
    };
    const { schedule, cancel } = frameThrottle(update);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => {
      cancel();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
