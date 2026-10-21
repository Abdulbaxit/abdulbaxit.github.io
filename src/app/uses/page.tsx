import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { PageSlide } from "@/components/PageSlide";
import { uses } from "@/content/uses";
import { absoluteUrl } from "@/content/site";

const description =
  "The hardware, software and stack Abdul Basit works with every day.";

export const metadata: Metadata = {
  title: "What I use",
  description,
  alternates: { canonical: absoluteUrl("/uses/") },
};

export default function UsesPage() {
  return (
    <PageSlide>
      <article className="note mt-10 max-w-3xl">
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="f-link text-sm"
        >
          <Icon id="arrow-left" className="mr-1" />
          Home
        </Link>

        <header className="mt-8">
          <p className="note__meta">Uses</p>
          <h1 className="note__title">What I use</h1>
          <div className="section-rule" />
          <p className="note__lede">
            The hardware, software and stack I work with every day.
          </p>
        </header>

        <div className="uses">
          {uses.map((group) => (
            <section key={group.title} className="uses__group">
              <h2 className="uses__title">{group.title}</h2>
              <dl className="uses__list">
                {group.items.map((item) => (
                  <div key={item.name} className="uses__item">
                    <dt>{item.name}</dt>
                    <dd>{item.note}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </article>
    </PageSlide>
  );
}
