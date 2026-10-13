"use client";

import { useEffect, useId, useState } from "react";
import type { Diagram, DiagramNode } from "@/content/diagrams";

const STEP_MS = 1800;
const LAST_STEP_HOLD = 1.6;
const TITLE_SIZE = 15;
const KICKER_SIZE = 13;
const LINE_SIZE = 12;
const LINE_SPACING = 6;
const TITLE_GAP = 8;
const BASELINE_RATIO = 0.82;
const RING_GAP = 5;

function layout(n: DiagramNode) {
  const titleSize = n.kicker ? KICKER_SIZE : (n.titleSize ?? TITLE_SIZE);
  const lineSize = n.lineSize ?? LINE_SIZE;
  const lineGap = lineSize + LINE_SPACING;
  const lines = n.lines ?? [];
  const hasTitle = n.title !== "";
  const linesHeight = lines.length
    ? (lines.length - 1) * lineGap + lineSize
    : 0;
  const block =
    (hasTitle ? titleSize : 0) +
    (hasTitle && lines.length ? TITLE_GAP : 0) +
    linesHeight;
  const top = n.y + (n.h - block) / 2;
  return {
    titleSize,
    lineSize,
    titleY: top + titleSize * BASELINE_RATIO,
    lineY: (i: number) =>
      top +
      (hasTitle ? titleSize + TITLE_GAP : 0) +
      i * lineGap +
      lineSize * BASELINE_RATIO,
  };
}

export function InteractiveDiagram({ diagram }: { diagram: Diagram }) {
  const uid = useId().replace(/[^\w-]/g, "");
  const [hover, setHover] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const playing = step >= 0;
  const { flow } = diagram;

  useEffect(() => {
    if (!playing) return;
    const last = step === flow.length - 1;
    const t = window.setTimeout(
      () => setStep(last ? -1 : step + 1),
      last ? STEP_MS * LAST_STEP_HOLD : STEP_MS,
    );
    return () => window.clearTimeout(t);
  }, [playing, step, flow.length]);

  const visited = playing ? flow.slice(0, step + 1) : [];
  const current = playing ? flow[step] : null;
  const doneNodes = new Set(visited.map((s) => s.node));
  const doneEdges = new Set(visited.flatMap((s) => s.edges ?? []));
  const onEdges = new Set(current?.edges ?? []);
  const activeNode = current?.node ?? hover;
  const focused = activeNode !== null;
  const hovered =
    !playing && hover ? diagram.nodes.find((n) => n.id === hover) : null;

  function nodeClass(n: DiagramNode) {
    return [
      "dg-node",
      n.tone && `dg-node--${n.tone}`,
      n.id === activeNode && "is-on",
      doneNodes.has(n.id) && "is-done",
    ]
      .filter(Boolean)
      .join(" ");
  }

  function edgeClass(id: string, tone?: string, dashed?: boolean) {
    return [
      "dg-edge",
      tone && `dg-edge--${tone}`,
      dashed && "dg-edge--dashed",
      onEdges.has(id) ? "is-on" : doneEdges.has(id) && "is-done",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <div className={`dg${focused ? "is-focused" : ""}`}>
      <div className="proj__media proj__media--diagram">
        <svg
          className="dg__svg"
          viewBox="0 0 800 500"
          role="group"
          aria-label={diagram.alt}
        >
          <defs>
            {(["muted", "prime"] as const).map((c) => (
              <marker
                key={c}
                id={`${uid}-${c}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path
                  d="M0 0 10 5 0 10z"
                  className={`dg-arrow dg-arrow--${c}`}
                />
              </marker>
            ))}
          </defs>

          <rect width="800" height="500" rx="10" className="dg-bg" />

          {diagram.labels?.map((l) => (
            <text
              key={l.text}
              x={l.x}
              y={l.y}
              className={`dg-label dg-label--${l.kind}`}
              textAnchor={l.kind === "caption" ? "middle" : "start"}
            >
              {l.text}
            </text>
          ))}

          {diagram.edges.map((e) => {
            const lit =
              onEdges.has(e.id) || doneEdges.has(e.id) || e.tone === "accent";
            return (
              <path
                key={e.id}
                d={e.d}
                className={edgeClass(e.id, e.tone, e.dashed)}
                markerEnd={
                  e.arrow === false
                    ? undefined
                    : `url(#${uid}-${lit ? "prime" : "muted"})`
                }
              />
            );
          })}

          {diagram.nodes.map((n) => {
            const t = layout(n);
            const name = n.title || "Note";
            return (
              <g
                key={n.id}
                className={nodeClass(n)}
                tabIndex={0}
                role="button"
                aria-label={`${name}: ${n.detail}`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover((h) => (h === n.id ? null : h))}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover((h) => (h === n.id ? null : h))}
                onClick={() => {
                  setStep(-1);
                  setHover(n.id);
                }}
              >
                <rect
                  className="dg-ring"
                  x={n.x - RING_GAP}
                  y={n.y - RING_GAP}
                  width={n.w + RING_GAP * 2}
                  height={n.h + RING_GAP * 2}
                  rx="14"
                />
                <rect
                  className="dg-box"
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx="10"
                />
                {n.title && (
                  <text
                    x={n.x + n.w / 2}
                    y={t.titleY}
                    textAnchor="middle"
                    className={n.kicker ? "dg-kicker" : "dg-title"}
                    fontSize={t.titleSize}
                  >
                    {n.title}
                  </text>
                )}
                {n.lines?.map((line, i) => (
                  <text
                    key={line}
                    x={n.x + n.w / 2}
                    y={t.lineY(i)}
                    textAnchor="middle"
                    className="dg-line"
                    fontSize={t.lineSize}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="dg-info">
        <button
          type="button"
          className="dg-play"
          aria-pressed={playing}
          onClick={() => {
            setHover(null);
            setStep(playing ? -1 : 0);
          }}
        >
          <span aria-hidden="true">{playing ? "■" : "▶"}</span>
          {playing ? "Stop" : diagram.playLabel}
        </button>
        <p className="dg-caption" aria-live="polite">
          {current ? (
            <>
              <span className="dg-caption__step">
                {step + 1}/{flow.length}
              </span>
              {current.caption}
            </>
          ) : hovered ? (
            <>
              <strong>{hovered.title || "Note"}</strong> — {hovered.detail}
            </>
          ) : (
            "Hover or tap a box to see what it does, or press play."
          )}
        </p>
      </div>
    </div>
  );
}
