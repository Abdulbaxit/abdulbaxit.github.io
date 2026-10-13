"use client";

import { useEffect } from "react";

const READ_LINE = 0.6;

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
