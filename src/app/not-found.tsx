import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { site } from "@/content/site";

/**
 * The site used to live at /portfolio/ before it became the user site at
 * the root. GitHub Pages answers any unknown path with this page, so links
 * shared under the old prefix land here and are sent on to the same page
 * without it (hash and query kept). Only when serving from the root: under
 * a /portfolio basePath, stripping the prefix would leave the site.
 */
const legacyRedirect = `(function(){var m=location.pathname.match(/^\\/portfolio(\\/.*)?$/i);if(m){location.replace((m[1]||"/")+location.search+location.hash)}})();`;

export default function NotFound() {
  return (
    <section className="mt-20 mb-32 max-w-lg">
      {site.basePath === "" && (
        <script dangerouslySetInnerHTML={{ __html: legacyRedirect }} />
      )}
      <p
        className="text-6xl font-black"
        style={{ color: "var(--color-prime)" }}
      >
        404
      </p>
      <h1
        className="mt-2 text-3xl font-bold"
        style={{ color: "var(--text-strong)" }}
      >
        This page doesn&rsquo;t exist
      </h1>
      <div className="kj-border" />
      <p className="mt-6">
        The link may be out of date, or the page may have moved.
      </p>
      <p className="mt-8">
        <Link href="/" className="f-link font-bold">
          <Icon id="arrow-left" className="mr-1" />
          Back home
        </Link>
      </p>
    </section>
  );
}
