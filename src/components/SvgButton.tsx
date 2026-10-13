"use client";

import Link from "next/link";
import type { Route } from "next";
import { useLayoutEffect, useRef, useState } from "react";

const DISC = 60;
const GAP = 15;
const PAD = 24;
const FALLBACK_CHAR_PX = 11.5;

export function SvgButton({
  href,
  label,
  download = false,
  ariaLabel,
}: {
  href: string;
  label: string;
  download?: boolean;
  ariaLabel?: string;
}) {
  const textRef = useRef<SVGTextElement>(null);
  const [textW, setTextW] = useState(() => label.length * FALLBACK_CHAR_PX);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.getComputedTextLength();
      if (w > 0) setTextW(w);
    };

    measure();

    if (document.fonts?.status === "loaded") return;
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
  }, [label]);

  const textX = DISC + GAP;
  const viewW = Math.ceil(textX + textW + PAD);
  const pill = Math.ceil(textX + textW + PAD / 2);

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={viewW}
      height={DISC}
      viewBox={`0 0 ${viewW} ${DISC}`}
      role="presentation"
    >
      <rect
        x="0"
        y="0"
        width={DISC}
        height={DISC}
        rx={DISC / 2}
        ry={DISC / 2}
        fill="var(--color-prime)"
        opacity="0.4"
      />
      <text ref={textRef} x={textX} y="38" textAnchor="start">
        {label}
      </text>
    </svg>
  );

  const style = { "--pill": `${pill}px` } as React.CSSProperties;

  if (download) {
    return (
      <a
        className="svg-btn"
        href={href}
        download
        aria-label={ariaLabel ?? label}
        style={style}
      >
        {svg}
      </a>
    );
  }

  return (
    <Link
      className="svg-btn"
      href={href as Route}
      aria-label={ariaLabel ?? label}
      style={style}
    >
      {svg}
    </Link>
  );
}
