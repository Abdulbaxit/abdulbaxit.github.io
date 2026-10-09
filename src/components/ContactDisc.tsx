"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

/**
 * The "email me" disc, with the blank compose window removed.
 *
 * A bare `mailto:` asks the visitor to write an email from nothing, and
 * silently does nothing at all for anyone using webmail without a
 * registered handler. Here the disc opens a small panel of reasons; each
 * one hands the mail client a subject and a starter body, so the sender
 * only fills in blanks. Copying the address is offered alongside, which
 * is the fallback when `mailto:` goes nowhere.
 */
export function ContactDisc() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function mailto(subject: string, body: string) {
    const q = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return `mailto:${profile.email}?${q}`;
  }

  /**
   * Gmail's web compose, prefilled the same way as the mailto:.
   *
   * mailto: only does anything when the operating system has a mail
   * client registered for it. Someone reading webmail in a browser tab
   * clicks and nothing happens at all, with no error to explain it, so
   * the reasons led nowhere for most visitors. This opens in a tab
   * instead, and the mailto: stays available below for anyone who
   * prefers their own client.
   */
  function gmail(subject: string, body: string) {
    const q = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: profile.email,
      su: subject,
      body,
    });
    return `https://mail.google.com/mail/?${q.toString()}`;
  }

  // Close on outside click or Escape, and hand focus back to the disc.
  useEffect(() => {
    if (!open) return;
    const disc = discRef.current;

    // The panel is still `inert` on this tick; focus lands once React has
    // painted the open state.
    const focusFrame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });

    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        disc?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard blocked (insecure context, denied permission). Fall
      // back to a selection the visitor can copy by hand.
      const range = document.createRange();
      const node = panelRef.current?.querySelector(".contact__address");
      if (node) {
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      return;
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="contact" ref={wrapRef}>
      <div className="talk-wrapper" data-magnetic="0.45">
        <button
          ref={discRef}
          type="button"
          className="talk"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="contact-panel"
          /* The label is split across two lines for the circle, which
             would otherwise be announced as one run-together word. */
          aria-label="Email me"
        >
          <span className="talk__text" aria-hidden="true">
            <span>Email</span>
            <span className="talk__l2">me</span>
          </span>
        </button>
        <div className="talk-pulse" aria-hidden="true" />
      </div>

      {/*
        Kept in the DOM so it can animate out; `inert` takes a closed
        panel out of the tab order and hides it from assistive tech,
        which `hidden` used to do before the exit transition needed it
        to stay rendered.
      */}
      <div
        id="contact-panel"
        ref={panelRef}
        className={`contact__panel${open ? " is-open" : ""}`}
        inert={!open}
      >
        <p className="contact__prompt">What&rsquo;s this about?</p>

        <ul className="contact__reasons">
          {profile.contactReasons.map((reason) => (
            <li key={reason.label}>
              <a
                className="contact__reason"
                href={gmail(reason.subject, reason.body)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                {reason.label}
                <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="contact__alt">
          <a
            className="contact__alt-link"
            href={mailto(
              profile.contactReasons[0]?.subject ?? "Hello",
              profile.contactReasons[0]?.body ?? "",
            )}
            onClick={() => setOpen(false)}
          >
            use my own mail app
          </a>

          <button type="button" className="contact__copy" onClick={copyEmail}>
            <span className="contact__address">{profile.email}</span>
            <span className="contact__copy-state">
              {copied ? "copied ✓" : "copy"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
