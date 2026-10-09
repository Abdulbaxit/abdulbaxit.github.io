"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1400;

/**
 * A number that counts up from 0 when it scrolls into view.
 *
 * The server renders the real value, so without JavaScript (or under
 * reduced motion) the figure is simply correct. On the client it is reset
 * to 0 only if it starts below the fold; a figure already on screen at
 * load is left alone rather than flicking to 0 and back. Non-numeric
 * values are rendered as they are.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild;
    const target = Number(value);
    if (!el || !node || node.nodeType !== Node.TEXT_NODE || !Number.isFinite(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    // Write the text node in place, so React's node stays the one on screen.
    node.nodeValue = "0";
    let frame = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = 1 - Math.pow(1 - t, 3);
          node.nodeValue = String(Math.round(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      node.nodeValue = value;
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
