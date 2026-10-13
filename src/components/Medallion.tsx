"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { asset } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

export function Medallion() {
  const { portrait, initials, name } = profile;
  const stageRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function setPointer(px: number, py: number) {
    const stage = stageRef.current;
    if (!stage) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      stage.style.setProperty("--px", px.toFixed(3));
      stage.style.setProperty("--py", py.toFixed(3));
    });
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    if (prefersReducedMotion()) return;
    const box = e.currentTarget.getBoundingClientRect();
    setPointer(
      ((e.clientX - box.left) / box.width) * 2 - 1,
      ((e.clientY - box.top) / box.height) * 2 - 1,
    );
  }

  return (
    <div
      ref={stageRef}
      className="medallion-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointer(0, 0)}
    >
      <div className="medallion-tilt">
        <div className="medallion">
          {portrait ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimizer */}
              <img
                className="medallion__img"
                src={asset(portrait)}
                alt={`Portrait of ${name}`}
                width={760}
                height={760}
                fetchPriority="high"
                decoding="async"
              />
              <span className="medallion__shine" aria-hidden="true" />
            </>
          ) : (
            <span className="medallion__initials" aria-hidden="true">
              {initials.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
