import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, socialIcon } from "./Sprite";
import { Dock } from "./Dock";
import { ThemeToggle } from "./ThemeToggle";
import { profile } from "@/content/profile";

/**
 * The signature frame: a white card floating on warm paper, with a narrow
 * left rail carrying the wordmark and vertical socials. The footer sits on
 * the paper below the card; navigation lives in the floating dock.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="page-bg md:pt-16">
        <div
          className="mx-auto max-w-shell p-2 sm:rounded-lg md:p-8 md:shadow-2xl"
          style={{ background: "var(--surface-card)" }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="flex shrink-0 items-start justify-between md:w-32 md:block">
              <Link href="/" className="mark" aria-label={profile.name}>
                {profile.initials}
                <span>.</span>
              </Link>
              <ThemeToggle className="md:hidden" />
              <div className="mt-64 hidden md:block">
                {profile.socials.map((s) => (
                  <a
                    key={s.kind}
                    href={s.href}
                    aria-label={s.label}
                    target={s.kind === "email" ? undefined : "_blank"}
                    rel={s.kind === "email" ? undefined : "noopener noreferrer"}
                    className="mb-5 block w-6 transition-colors hover:text-prime"
                  >
                    <Icon id={socialIcon(s.kind)} className="text-2xl" />
                  </a>
                ))}
                <ThemeToggle className="mt-2 block" />
              </div>
            </div>

            <div className="min-w-0 md:flex-1">
              <main id="main">{children}</main>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>

      <Dock />
    </>
  );
}

function SiteFooter() {
  return (
    <div
      className="dock-offset mx-auto max-w-shell p-2 md:p-8"
      style={{ color: "var(--text-body)" }}
    >
      <footer className="mt-10 md:flex">
        <div className="mb-3 text-center text-xs uppercase md:mb-0 md:w-1/4 md:text-left">
          <Link href="/" className="mark" aria-label={profile.name}>
            {profile.initials}
            <span>.</span>
          </Link>
        </div>
        {/*
          The dock already carries works, resume and contact, so
          repeating them here was pure duplication. The socials are not
          in the dock, so this is where they earn their place.
        */}
        <div className="mb-3 flex justify-center gap-5 md:mb-0 md:w-2/4">
          {profile.socials.map((social) => (
            <a
              key={social.kind}
              href={social.href}
              aria-label={social.label}
              target={social.kind === "email" ? undefined : "_blank"}
              rel={social.kind === "email" ? undefined : "noopener noreferrer"}
              className="transition-colors hover:text-prime"
            >
              <Icon id={socialIcon(social.kind)} className="text-lg" />
            </a>
          ))}
        </div>
        <div className="text-center text-xs uppercase md:w-1/4">
          <p className="px-2 py-1">
            © {new Date().getFullYear()} {profile.name}. All rights reserved
          </p>
        </div>
      </footer>

      <div className="color-bar">
        <div style={{ background: "var(--color-prime)" }} />
        <div style={{ background: "var(--color-gold)" }} />
        <div style={{ background: "var(--color-prime-light)" }} />
        <div style={{ background: "var(--color-secondary)" }} />
      </div>
    </div>
  );
}
