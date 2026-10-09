import Link from "next/link";
import { Icon } from "@/components/Sprite";

export default function NotFound() {
  return (
    <section className="mt-20 mb-32 max-w-lg">
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
