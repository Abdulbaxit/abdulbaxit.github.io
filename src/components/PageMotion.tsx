"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  frameThrottle,
  hasFinePointer,
  prefersReducedMotion,
} from "@/lib/motion";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>";
const DECODE_MS = 650;
const GLYPH_SWAP_MS = 45;

const MAGNET_REACH = 60;
const REVEAL_STAGGER_S = 0.07;
const DEFAULT_PULL = 0.3;
const OFFSCREEN = -1e4;

export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add("motion-ok");

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal.unobserve(entry.target);
          if (entry.target.classList.contains("section-rule")) {
            entry.target.classList.add("is-in");
          } else {
            decode(entry.target as HTMLElement);
          }
        }
      },
      { threshold: 0.6 },
    );
    document
      .querySelectorAll(
        ".section-rule:not(.is-in), [data-decode]:not([data-decoded])",
      )
      .forEach((el) => reveal.observe(el));

    const tiles = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          tiles.unobserve(entry.target);
          entry.target.classList.add("is-in");
        }
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
      .forEach((el, i) => {
        el.style.setProperty(
          "--reveal-delay",
          `${(i % 8) * REVEAL_STAGGER_S}s`,
        );
        tiles.observe(el);
      });

    const stopMagnets = magnets();
    const stopSpotlight = spotlight();

    return () => {
      reveal.disconnect();
      tiles.disconnect();
      stopMagnets();
      stopSpotlight();
    };
  }, [pathname]);

  return null;
}

function decode(el: HTMLElement) {
  el.setAttribute("data-decoded", "");
  const node = el.firstChild;
  if (el.childNodes.length !== 1 || !node || node.nodeType !== Node.TEXT_NODE)
    return;
  const text = node.nodeValue ?? "";
  el.setAttribute("aria-label", text);

  const start = performance.now();
  let lastSwap = 0;
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / DECODE_MS);
    if (now - lastSwap > GLYPH_SWAP_MS || t === 1) {
      lastSwap = now;
      const settled = Math.floor(t * text.length);
      node.nodeValue = Array.from(text, (ch, i) =>
        i < settled || ch === " "
          ? ch
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      ).join("");
    }
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      node.nodeValue = text;
      el.removeAttribute("aria-label");
    }
  };
  requestAnimationFrame(frame);
}

function magnets(): () => void {
  if (!hasFinePointer()) return () => {};
  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-magnetic]"),
  );
  if (!els.length) return () => {};

  const pull = new Map<HTMLElement, { x: number; y: number }>();
  let px = OFFSCREEN;
  let py = OFFSCREEN;

  const set = (el: HTMLElement, x: number, y: number) => {
    pull.set(el, { x, y });
    el.style.translate = x || y ? `${x.toFixed(1)}px ${y.toFixed(1)}px` : "";
  };

  const update = () => {
    for (const el of els) {
      const box = el.getBoundingClientRect();
      const cur = pull.get(el) ?? { x: 0, y: 0 };
      const cx = box.left + box.width / 2 - cur.x;
      const cy = box.top + box.height / 2 - cur.y;
      const dx = px - cx;
      const dy = py - cy;
      const reach = Math.max(box.width, box.height) / 2 + MAGNET_REACH;
      const dist = Math.hypot(dx, dy);
      if (dist >= reach) {
        if (cur.x || cur.y) set(el, 0, 0);
        continue;
      }
      const strength = Number(el.dataset.magnetic) || DEFAULT_PULL;
      const falloff = 1 - dist / reach;
      set(el, dx * strength * falloff, dy * strength * falloff);
    }
  };

  const { schedule, cancel } = frameThrottle(update);

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    px = e.clientX;
    py = e.clientY;
    schedule();
  };
  const onLeave = (e: PointerEvent) => {
    if (e.relatedTarget) return;
    px = py = OFFSCREEN;
    schedule();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onLeave, { passive: true });
  return () => {
    cancel();
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerout", onLeave);
    els.forEach((el) => (el.style.translate = ""));
  };
}

function spotlight(): () => void {
  if (!hasFinePointer()) return () => {};
  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-spotlight]"),
  );
  if (!els.length) return () => {};

  const root = document.documentElement;
  const visible = new Set<HTMLElement>();
  const watch = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(el);
      else visible.delete(el);
    }
  });
  els.forEach((el) => watch.observe(el));

  let px = OFFSCREEN;
  let py = OFFSCREEN;
  const { schedule, cancel } = frameThrottle(() => {
    for (const el of visible) {
      const box = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${Math.round(px - box.left)}px`);
      el.style.setProperty("--my", `${Math.round(py - box.top)}px`);
    }
  });

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    px = e.clientX;
    py = e.clientY;
    schedule();
  };
  const onLeave = (e: PointerEvent) => {
    if (e.relatedTarget) return;
    px = py = OFFSCREEN;
    schedule();
  };

  root.classList.add("spotlight-on");
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", schedule, { passive: true });
  document.addEventListener("pointerout", onLeave, { passive: true });
  return () => {
    cancel();
    watch.disconnect();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", schedule);
    document.removeEventListener("pointerout", onLeave);
    root.classList.remove("spotlight-on");
    els.forEach((el) => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    });
  };
}
