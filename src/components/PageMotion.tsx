"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>";
const DECODE_MS = 650;

const MAGNET_REACH = 60;

export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("motion-ok");

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal.unobserve(entry.target);
          if (entry.target.classList.contains("kj-border")) {
            entry.target.classList.add("is-in");
          } else {
            decode(entry.target as HTMLElement);
          }
        }
      },
      { threshold: 0.6 },
    );
    document
      .querySelectorAll(".kj-border:not(.is-in), [data-decode]:not([data-decoded])")
      .forEach((el) => reveal.observe(el));

    const stopMagnets = magnets();

    return () => {
      reveal.disconnect();
      stopMagnets();
    };
  }, [pathname]);

  return null;
}

function decode(el: HTMLElement) {
  el.setAttribute("data-decoded", "");
  const node = el.firstChild;
  if (el.childNodes.length !== 1 || !node || node.nodeType !== Node.TEXT_NODE) return;
  const text = node.nodeValue ?? "";
  el.setAttribute("aria-label", text);

  const start = performance.now();
  let lastSwap = 0;
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / DECODE_MS);
    if (now - lastSwap > 45 || t === 1) {
      lastSwap = now;
      const settled = Math.floor(t * text.length);
      node.nodeValue = Array.from(text, (ch, i) =>
        i < settled || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
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
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
  if (!els.length) return () => {};

  const pull = new Map<HTMLElement, { x: number; y: number }>();
  let frame = 0;
  let px = -1e4;
  let py = -1e4;

  const set = (el: HTMLElement, x: number, y: number) => {
    pull.set(el, { x, y });
    el.style.translate = x || y ? `${x.toFixed(1)}px ${y.toFixed(1)}px` : "";
  };

  const update = () => {
    frame = 0;
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
      const strength = Number(el.dataset.magnetic) || 0.3;
      const falloff = 1 - dist / reach;
      set(el, dx * strength * falloff, dy * strength * falloff);
    }
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    px = e.clientX;
    py = e.clientY;
    if (!frame) frame = requestAnimationFrame(update);
  };
  const onLeave = (e: PointerEvent) => {
    if (e.relatedTarget) return;
    px = py = -1e4;
    if (!frame) frame = requestAnimationFrame(update);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onLeave, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerout", onLeave);
    els.forEach((el) => (el.style.translate = ""));
  };
}
