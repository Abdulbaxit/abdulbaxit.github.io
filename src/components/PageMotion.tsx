"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Characters shown while a heading decodes. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>";
const DECODE_MS = 650;

/** Extra reach, in px, beyond an element's own radius for the magnet. */
const MAGNET_REACH = 60;

/**
 * Scroll and pointer motion shared across the page. Renders nothing.
 *
 * - Section underlines (.kj-border) draw in from the left when they
 *   scroll into view. `motion-ok` on <html> is what hides them first, so
 *   without JavaScript or under reduced motion they are simply there.
 * - Headings marked data-decode scramble through random characters and
 *   settle on their text, once, as they come into view.
 * - Elements marked data-magnetic="<strength>" lean toward a nearby mouse
 *   pointer, using the `translate` property so it composes with whatever
 *   `transform` they already have (the dock's magnification, hover scale).
 *
 * Re-scans on every route change, since client navigation brings in new
 * elements without remounting this.
 */
export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("motion-ok");

    // Underlines and headings: act once, as each enters the viewport.
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

/** Scrambles a heading's single text node, resolving left to right. */
function decode(el: HTMLElement) {
  el.setAttribute("data-decoded", "");
  const node = el.firstChild;
  if (el.childNodes.length !== 1 || !node || node.nodeType !== Node.TEXT_NODE) return;
  const text = node.nodeValue ?? "";
  // Screen readers keep the real heading while the characters churn.
  el.setAttribute("aria-label", text);

  const start = performance.now();
  let lastSwap = 0;
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / DECODE_MS);
    // New random characters every ~45ms reads as decoding, not flicker.
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

/** Starts the magnetic pull; returns a function that stops it. */
function magnets(): () => void {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
  if (!els.length) return () => {};

  // Current pull per element, so its resting centre can be recovered
  // from a bounding box that already includes the pull.
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
      // Strongest midway, fading to nothing at the edge of the reach, so
      // nothing jumps as the pointer crosses into range.
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
