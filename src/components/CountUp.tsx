"use client";

import { useEffect, useRef } from "react";
import { easeOutCubic, prefersReducedMotion } from "@/lib/motion";

const DURATION_MS = 1400;

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild;
    const target = Number(value);
    if (
      !el ||
      !node ||
      node.nodeType !== Node.TEXT_NODE ||
      !Number.isFinite(target)
    )
      return;
    if (prefersReducedMotion()) return;

    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    node.nodeValue = "0";
    let frame = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          const eased = easeOutCubic(t);
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
