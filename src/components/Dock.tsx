"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Sprite";
import { BookButton } from "./BookButton";
import { useDockMagnify } from "@/lib/useDockMagnify";
import { frameThrottle } from "@/lib/motion";
import { profile } from "@/content/profile";
import { asset } from "@/content/site";

interface DockItem {
  id: string;
  label: string;
  icon: string;
  href: Route;
}

const ACTIVE_LINE = 0.3;
const BOTTOM_SLACK_PX = 120;

const ITEMS: DockItem[] = [
  { id: "home", label: "Home", icon: "home", href: "/#home" },
  { id: "skills", label: "Skills", icon: "layers", href: "/#skills" },
  {
    id: "experience",
    label: "Experience",
    icon: "briefcase",
    href: "/#experience",
  },
  { id: "works", label: "Works", icon: "file", href: "/#works" },
  { id: "contact", label: "Contact", icon: "envelope", href: "/#contact" },
];

export function Dock() {
  const [active, setActive] = useState<string>("home");
  const listRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const current =
    pathname === "/" ? active : pathname.startsWith("/work/") ? "works" : null;

  useDockMagnify(listRef);

  useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    const update = () => {
      const line = window.innerHeight * ACTIVE_LINE;
      let current = sections[0].id;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - BOTTOM_SLACK_PX;
      setActive(nearBottom ? sections[sections.length - 1].id : current);
    };
    const { schedule, cancel } = frameThrottle(update);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();

    return () => {
      cancel();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <nav className="dock" aria-label="Sections">
      <ul className="dock__list" ref={listRef}>
        {ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="dock__item"
              data-magnify=""
              data-magnetic="0.2"
              aria-label={item.label}
              aria-current={current === item.id ? "true" : undefined}
              data-active={current === item.id ? "" : undefined}
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
              data-magnetic="0.2"
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

        <li>
          <button
            type="button"
            className="dock__item"
            data-magnify=""
            data-magnetic="0.2"
            aria-label="Open command menu"
            aria-haspopup="dialog"
            onClick={() =>
              document.dispatchEvent(new Event("command-menu:open"))
            }
          >
            <Icon id="search" className="dock__icon" />
            <span className="dock__tip" aria-hidden="true">
              Search
            </span>
          </button>
        </li>

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
