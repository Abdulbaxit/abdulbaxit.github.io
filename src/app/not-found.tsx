import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { Terminal } from "@/components/Terminal";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";
import { asset, site } from "@/content/site";

const terminalData = {
  name: profile.name,
  role: profile.role,
  email: profile.email,
  cv: profile.resumeHref ? asset(profile.resumeHref) : null,
  projects: projects.map((p) => ({ slug: p.slug, name: p.name })),
  notes: notes.map((n) => ({ slug: n.slug, title: n.title })),
};

const legacyRedirect = `(function(){var m=location.pathname.match(/^\\/portfolio(\\/.*)?$/i);if(m){location.replace((m[1]||"/")+location.search+location.hash)}})();`;

export default function NotFound() {
  return (
    <section className="mt-20 mb-32 max-w-2xl">
      {site.basePath === "" && (
        <script dangerouslySetInnerHTML={{ __html: legacyRedirect }} />
      )}
      <p className="text-6xl font-black text-prime">404</p>
      <h1 className="mt-2 text-3xl font-bold text-strong">
        This page doesn&rsquo;t exist
      </h1>
      <div className="section-rule" />
      <p className="mt-6">
        The link may be out of date, or the page may have moved.
      </p>
      <Terminal data={terminalData} />
      <p className="mt-8">
        <Link href="/" className="f-link font-bold">
          <Icon id="arrow-left" className="mr-1" />
          Back home
        </Link>
      </p>
    </section>
  );
}
