import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { site } from "@/content/site";

const legacyRedirect = `(function(){var m=location.pathname.match(/^\\/portfolio(\\/.*)?$/i);if(m){location.replace((m[1]||"/")+location.search+location.hash)}})();`;

export default function NotFound() {
  return (
    <section className="mt-20 mb-32 max-w-lg">
      {site.basePath === "" && (
        <script dangerouslySetInnerHTML={{ __html: legacyRedirect }} />
      )}
      <p className="text-prime text-6xl font-black">404</p>
      <h1 className="text-strong mt-2 text-3xl font-bold">
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
