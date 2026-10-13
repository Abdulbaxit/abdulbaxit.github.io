"use client";

import { useEffect, useRef } from "react";
import { SvgButton } from "./SvgButton";
import { SectionHeading } from "./SectionHeading";
import { asset } from "@/content/site";
import { skills } from "@/content/profile";
import { clamp, frameThrottle, prefersReducedMotion } from "@/lib/motion";

const LAYERS = [
  { n: 1, file: "person" },
  { n: 2, file: "desk" },
  { n: 3, file: "monitor" },
  { n: 4, file: "window-chart" },
  { n: 5, file: "window-form" },
  { n: 6, file: "window-layout" },
  { n: 7, file: "window-card" },
] as const;

interface Frame {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

interface Step {
  els: HTMLElement[];
  from: Frame;
  to: Frame;
  a: number;
  b: number;
}

function mix(from: Frame, to: Frame, t: number): Frame {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    scale: from.scale + (to.scale - from.scale) * t,
    opacity: from.opacity + (to.opacity - from.opacity) * t,
  };
}

function paint(el: HTMLElement, st: Frame) {
  el.style.transform = `translate3d(${st.x.toFixed(1)}px,${st.y.toFixed(1)}px,0) scale(${st.scale.toFixed(3)})`;
  el.style.opacity = String(st.opacity);
}

export function Skills() {
  const pinRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!pin || !section || !scene) return;

    const root = document.documentElement;
    const reduced = prefersReducedMotion();
    const wide = window.matchMedia("(min-width: 1024px)");
    let steps: Step[] = [];
    let reveal: IntersectionObserver | null = null;

    const collect = () => {
      const q = (sel: string) =>
        Array.from(section.querySelectorAll<HTMLElement>(sel));
      const vis: Frame = { scale: 1, opacity: 1, x: 0, y: 0 };
      steps = [
        {
          els: q(".illustration__img--1"),
          from: { scale: 0.5, opacity: 1, x: 0, y: 0 },
          to: vis,
          a: 0,
          b: 0.12,
        },
        {
          els: q(".illustration__img--2"),
          from: { scale: 1, opacity: 0, x: 0, y: -50 },
          to: vis,
          a: 0.05,
          b: 0.16,
        },
        {
          els: q(".illustration__img--3"),
          from: { scale: 1, opacity: 0, x: 0, y: -50 },
          to: vis,
          a: 0.11,
          b: 0.22,
        },
        {
          els: q(".data-1"),
          from: { scale: 1, opacity: 0, x: 0, y: 0 },
          to: vis,
          a: 0.16,
          b: 0.36,
        },
        {
          els: q(".illustration__img--5"),
          from: { scale: 1, opacity: 0, x: 100, y: 0 },
          to: vis,
          a: 0.31,
          b: 0.42,
        },
        {
          els: q(".illustration__img--6"),
          from: { scale: 1, opacity: 0, x: -100, y: 0 },
          to: vis,
          a: 0.38,
          b: 0.49,
        },
        {
          els: q(".data-2"),
          from: { scale: 1, opacity: 0, x: 0, y: 0 },
          to: vis,
          a: 0.42,
          b: 0.62,
        },
        {
          els: q(".illustration__img--4"),
          from: { scale: 1, opacity: 0, x: -100, y: 0 },
          to: vis,
          a: 0.58,
          b: 0.69,
        },
        {
          els: q(".illustration__img--7"),
          from: { scale: 1, opacity: 0, x: 100, y: 0 },
          to: vis,
          a: 0.64,
          b: 0.76,
        },
        {
          els: q(".see-project-btn"),
          from: { scale: 1, opacity: 0, x: 0, y: 0 },
          to: vis,
          a: 0.78,
          b: 1,
        },
      ];
    };

    const tick = () => {
      if (!root.classList.contains("js-skills-pin")) return;
      const total = pin.offsetHeight - window.innerHeight;
      const p =
        total <= 0 ? 1 : clamp(-pin.getBoundingClientRect().top / total, 0, 1);
      steps.forEach((s) => {
        const t = s.b === s.a ? 1 : clamp((p - s.a) / (s.b - s.a), 0, 1);
        s.els.forEach((el) => paint(el, mix(s.from, s.to, t)));
      });
    };

    const { schedule: onScroll, cancel } = frameThrottle(tick);

    const reset = () => {
      root.classList.remove("js-skills-pin");
      section
        .querySelectorAll<HTMLElement>(
          ".illustration__img, .data-1, .data-2, .see-project-btn",
        )
        .forEach((el) => {
          el.style.transform = "";
          el.style.opacity = "";
        });
    };

    const startReveal = () => {
      if (reduced || reveal || scene.classList.contains("is-visible")) return;
      scene.classList.add("will-reveal");
      reveal = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          scene.classList.add("is-visible");
          stopReveal();
        },
        { threshold: 0.25 },
      );
      reveal.observe(scene);
    };

    const stopReveal = () => {
      reveal?.disconnect();
      reveal = null;
    };

    const sync = () => {
      if (reduced || !wide.matches) {
        reset();
        startReveal();
        return;
      }
      stopReveal();
      collect();
      root.classList.add("js-skills-pin");
      tick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    sync();

    return () => {
      cancel();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      stopReveal();
      scene.classList.remove("will-reveal", "is-visible");
      reset();
    };
  }, []);

  return (
    <div id="skills" className="skills-pin" ref={pinRef}>
      <section ref={sectionRef} className="skills-sticky mt-12 md:mt-32">
        <SectionHeading title="My top skills" subtitle="What I do" />

        <div className="skills-panel mt-10 grid grid-cols-1 rounded-lg border-2 border-raised bg-raised lg:grid-cols-2">
          <div className="p-5 text-center md:mx-8">
            {skills.map((block, i) => {
              const beat = `data-${Math.min(i + 1, 2)}`;
              return (
                <div key={block.title}>
                  <h3
                    className={`mb-3 text-lg font-black text-strong uppercase ${beat}`}
                  >
                    {block.title}
                  </h3>
                  <p className={`mb-5 ${beat}`}>{block.body}</p>
                </div>
              );
            })}

            <div className="see-project-btn mt-8 flex justify-center">
              <SvgButton
                href="/#works"
                label="SEE MY WORKS"
                ariaLabel="See my works"
              />
            </div>
          </div>

          <div ref={sceneRef} className="illustration" aria-hidden="true">
            {LAYERS.map(({ n, file }) => (
              // eslint-disable-next-line @next/next/no-img-element -- static export, no optimizer
              <img
                key={n}
                className={`illustration__img illustration__img--${n}`}
                src={asset(`/assets/images/illustrations/${file}.svg`)}
                alt=""
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
