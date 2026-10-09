"use client";

import { Fragment, useEffect, useRef } from "react";

/** Weight far from the pointer, and right under it. Roboto is variable. */
const MIN_WEIGHT = 400;
const MAX_WEIGHT = 900;
/** How far, in px, the swell reaches from the pointer. */
const RADIUS = 150;

/**
 * The hero name, typed out letter by letter on load. On a mouse it also
 * reacts to the pointer: letters near it stay black-weight and the rest
 * thin out, so a heavy patch follows the cursor across the name. At rest,
 * and whenever the pointer is away from the letters, the name is solid
 * black as designed. Weights go straight to each letter's --w; nothing
 * re-renders while the pointer moves.
 */
export function HeroName({ name, lines }: { name: string; lines: string[] }) {
  const ref = useRef<HTMLHeadingElement>(null);

  // Each letter's entrance delay continues from the last line's, so the
  // name types out as one run across both lines.
  const letterLines = lines.map((line, li) => {
    const before = lines.slice(0, li).reduce((sum, l) => sum + l.length, 0);
    return Array.from(line).map((char, ci) => ({
      char,
      delay: 0.3 + (before + ci) * 0.04,
    }));
  });

  useEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    const letters = Array.from(h1.querySelectorAll<HTMLElement>(".letter"));
    let frame = 0;
    let px = 0;
    let py = 0;

    const reset = () => letters.forEach((el) => el.style.removeProperty("--w"));

    const paint = () => {
      frame = 0;
      // Measured per frame: letters change width as their weight changes.
      const dists = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
      });
      // Only react once the pointer is actually near the letters, not just
      // anywhere over the heading's full-width box.
      if (Math.min(...dists) > RADIUS) {
        reset();
        return;
      }
      letters.forEach((el, i) => {
        const t = Math.max(0, 1 - dists[i] / RADIUS);
        const eased = t * t * (3 - 2 * t);
        el.style.setProperty(
          "--w",
          String(Math.round(MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * eased)),
        );
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      reset();
    };

    h1.addEventListener("pointermove", onMove);
    h1.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      h1.removeEventListener("pointermove", onMove);
      h1.removeEventListener("pointerleave", onLeave);
      reset();
    };
  }, []);

  return (
    <h1
      ref={ref}
      className="hero__name"
      aria-label={name}
      style={{ color: "var(--text-strong)" }}
    >
      {/*
        The space between lines is invisible (the lines are blocks) but
        keeps the heading's text "Abdul Basit" for search engines, rather
        than "AbdulBasit".
      */}
      {letterLines.map((letters, li) => (
        <Fragment key={li}>
          {li > 0 && " "}
          <span className="block">
            {letters.map(({ char, delay }, ci) => (
              <span
                key={ci}
                className="letter"
                aria-hidden="true"
                style={{ "--d": `${delay.toFixed(2)}s` } as React.CSSProperties}
              >
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </h1>
  );
}
