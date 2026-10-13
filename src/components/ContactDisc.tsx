"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

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

  useEffect(() => {
    if (!open) return;
    const disc = discRef.current;

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
          aria-label="Email me"
        >
          <span className="talk__text" aria-hidden="true">
            <span>Email</span>
            <span className="talk__l2">me</span>
          </span>
        </button>
        <div className="talk-pulse" aria-hidden="true" />
      </div>

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
