"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Sprite";
import { BookButton } from "./BookButton";
import { useDockMagnify } from "@/lib/useDockMagnify";
import { profile } from "@/content/profile";
import { asset } from "@/content/site";

/**
 * A floating dock, fixed to the bottom of the viewport, replacing the
 * top nav bar.
 *
 * It highlights the section you are in: the last dock section whose top
 * has scrolled past a line 30% down the viewport. Working from positions
 * rather than intersection events means it is right on any load, even
 * one that lands mid-page on a section the dock doesn't list (Notes,
 * GitHub), where Works is still the one you've reached.
 *
 * Home tracks the hero, not <main>: main contains every section.
 */
interface DockItem {
  id: string;
  label: string;
  icon: string;
  href: Route;
}

const ITEMS: DockItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/#home" },
  { id: "skills", label: "Skills", icon: "layers", href: "/#skills" },
  { id: "experience", label: "Experience", icon: "briefcase", href: "/#experience" },
  { id: "works", label: "Works", icon: "file", href: "/#works" },
  { id: "contact", label: "Contact", icon: "envelope", href: "/#contact" },
];

export function Dock() {
  const [active, setActive] = useState<string>("home");
  const listRef = useRef<HTMLUListElement>(null);

  useDockMagnify(listRef);

  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = sections[0].id;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      // The last section is short and the page runs out of scroll before
      // its top reaches the line; near the bottom, it is what you see.
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;
      setActive(nearBottom ? sections[sections.length - 1].id : current);
    };
    // One measurement per frame, however many scroll events arrive.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav className="dock" aria-label="Sections">
      <ul className="dock__list" ref={listRef}>
        {ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="dock__item"
              data-magnify=""
              aria-label={item.label}
              aria-current={active === item.id ? "true" : undefined}
              data-active={active === item.id ? "" : undefined}
            >
              <Icon id={item.icon} className="dock__icon" />
              <span className="dock__tip" aria-hidden="true">
                {item.label}
              </span>
            </Link>
          </li>
        ))}

        {profile.resumeHref && (
          <li>
            <a
              className="dock__item"
              data-magnify=""
              href={asset(profile.resumeHref)}
              download
              aria-label="Download resume"
            >
              <Icon id="user-tie" className="dock__icon" />
              <span className="dock__tip" aria-hidden="true">
                Resume
              </span>
            </a>
          </li>
        )}

        {profile.calLink && (
          <>
            <li className="dock__sep" aria-hidden="true" />
            <li>
              <BookButton />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
