"use client";

import { useEffect, useRef } from "react";
import { SvgButton } from "./SvgButton";
import { asset } from "@/content/site";
import { skills } from "@/content/profile";

/**
 * The desk scene's layers. `n` keys the position in globals.css
 * (.illustration__img--n) and the scroll timing below; each SVG is
 * cropped to its own artwork.
 */
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
  /** Start and end of this step, as a fraction of the pinned scroll. */
  a: number;
  b: number;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
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

/**
 * On wide screens the section pins and the desk layers assemble as you
 * scroll, same beats as kenjimmy.xyz. On narrower screens the scene sits
 * under the text and assembles once as it scrolls into view. With reduced
 * motion it simply renders finished.
 */
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1024px)");
    let queued = false;
    let frame = 0;
    let steps: Step[] = [];
    let reveal: IntersectionObserver | null = null;

    const collect = () => {
      const q = (sel: string) =>
        Array.from(section.querySelectorAll<HTMLElement>(sel));
      const vis: Frame = { scale: 1, opacity: 1, x: 0, y: 0 };
      steps = [
        { els: q(".illustration__img--1"), from: { scale: 0.5, opacity: 1, x: 0, y: 0 }, to: vis, a: 0, b: 0.12 },
        { els: q(".illustration__img--2"), from: { scale: 1, opacity: 0, x: 0, y: -50 }, to: vis, a: 0.05, b: 0.16 },
        { els: q(".illustration__img--3"), from: { scale: 1, opacity: 0, x: 0, y: -50 }, to: vis, a: 0.11, b: 0.22 },
        { els: q(".data-1"), from: { scale: 1, opacity: 0, x: 0, y: 0 }, to: vis, a: 0.16, b: 0.36 },
        { els: q(".illustration__img--5"), from: { scale: 1, opacity: 0, x: 100, y: 0 }, to: vis, a: 0.31, b: 0.42 },
        { els: q(".illustration__img--6"), from: { scale: 1, opacity: 0, x: -100, y: 0 }, to: vis, a: 0.38, b: 0.49 },
        { els: q(".data-2"), from: { scale: 1, opacity: 0, x: 0, y: 0 }, to: vis, a: 0.42, b: 0.62 },
        { els: q(".illustration__img--4"), from: { scale: 1, opacity: 0, x: -100, y: 0 }, to: vis, a: 0.58, b: 0.69 },
        { els: q(".illustration__img--7"), from: { scale: 1, opacity: 0, x: 100, y: 0 }, to: vis, a: 0.64, b: 0.76 },
        { els: q(".see-project-btn"), from: { scale: 1, opacity: 0, x: 0, y: 0 }, to: vis, a: 0.78, b: 1 },
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

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(() => {
        queued = false;
        tick();
      });
    };

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

    // Unpinned: hide the layers, then let CSS assemble them on entry.
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
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      stopReveal();
      scene.classList.remove("will-reveal", "is-visible");
      reset();
    };
  }, []);

  /*
    The id sits on the pin, not the sticky section. Jumping to a sticky
    element lands wherever it is currently stuck, so from below the page
    landed at the end of the scene, fully assembled. The pin's top is
    always the start, so every jump lands where the scene begins.
  */
  return (
    <div id="skills" className="skills-pin" ref={pinRef}>
      <section ref={sectionRef} className="skills-sticky mt-12 md:mt-32">
        <h2
          className="text-3xl leading-none font-bold md:text-4xl"
          style={{ color: "var(--text-strong)" }}
        >
          My top skills
        </h2>
        <p className="mt-2 text-lg">What I do</p>
        <div className="kj-border" />

        <div
          className="skills-panel mt-10 grid grid-cols-1 rounded-lg border-2 lg:grid-cols-2"
          style={{
            background: "var(--surface-raised)",
            borderColor: "var(--surface-raised)",
          }}
        >
          <div className="p-5 text-center md:mx-8">
            {skills.map((block, i) => {
              // The scene has two text beats; any further blocks share the
              // second rather than never appearing.
              const beat = `data-${Math.min(i + 1, 2)}`;
              return (
                <div key={block.title}>
                  <h3
                    className={`mb-3 text-lg font-black uppercase ${beat}`}
                    style={{ color: "var(--text-strong)" }}
                  >
                    {block.title}
                  </h3>
                  <p className={`mb-5 ${beat}`}>{block.body}</p>
                </div>
              );
            })}

            <div className="see-project-btn mt-8 flex justify-center">
              <SvgButton href="/#works" label="SEE MY WORKS" ariaLabel="See my works" />
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
