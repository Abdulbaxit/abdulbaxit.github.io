"use client";

import { useEffect, useRef } from "react";

const FOLLOW_SECONDS = 0.11;
const MAX_STRETCH = 0.18;

const INTERACTIVE =
  'a, button, [role="button"], summary, label, input, select, textarea';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!fine.matches || still.matches || !dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;
    let last = 0;
    let shown = false;

    const follow = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-dt / FOLLOW_SECONDS);
      const dx = (x - rx) * k;
      const dy = (y - ry) * k;
      rx += dx;
      ry += dy;

      const speed = dt > 0 ? Math.hypot(dx, dy) / dt : 0;
      const stretch = 1 + Math.min(speed / 3000, MAX_STRETCH);
      ring.style.translate = `${rx}px ${ry}px`;
      ring.style.transform =
        stretch > 1.005
          ? `rotate(${Math.atan2(dy, dx)}rad) scale(${stretch}, ${1 / stretch})`
          : "";

      const moving = Math.abs(x - rx) + Math.abs(y - ry) > 0.1;
      frame = moving ? requestAnimationFrame(follow) : 0;
      if (!moving) ring.style.transform = "";
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(follow);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      dot.style.translate = `${x}px ${y}px`;
      if (!shown) {
        rx = x;
        ry = y;
        shown = true;
        root.classList.add("cursor-visible");
      }
      start();
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      root.classList.toggle("cursor-link", Boolean(target?.closest(INTERACTIVE)));
    };

    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      shown = false;
      root.classList.remove("cursor-visible", "cursor-link");
    };

    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.classList.remove("has-cursor", "cursor-visible", "cursor-link", "cursor-down");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
