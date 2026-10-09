import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Skills } from "@/components/Skills";
import { Readme } from "@/components/Readme";
import { Experience } from "@/components/Experience";
import { Works } from "@/components/Works";
import { Recommendations } from "@/components/Recommendations";
import { Notes } from "@/components/Notes";
import { GitHubActivity } from "@/components/GitHubActivity";
import { Contact } from "@/components/Contact";
import { profile, experience, isCurrentRole } from "@/content/profile";
import { site, absoluteUrl } from "@/content/site";

/**
 * Structured data for search engines. The page is declared a ProfilePage
 * whose main entity is the Person, which is the shape Google documents
 * for a personal profile and what lets a search for the name resolve to
 * this site.
 */
export default function Home() {
  const personId = absoluteUrl("/#person");
  const websiteId = absoluteUrl("/#website");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": absoluteUrl("/#profile"),
        url: absoluteUrl("/"),
        name: site.title,
        description: site.description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        givenName: "Abdul",
        familyName: "Basit",
        // The handle used on GitHub and in this site's old URL.
        alternateName: "Abdulbaxit",
        jobTitle: profile.role,
        description: site.description,
        url: absoluteUrl("/"),
        ...(profile.portrait && { image: absoluteUrl(profile.portrait) }),
        email: `mailto:${profile.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressCountry: "PK",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Lahore Garrison University",
        },
        // Every role still running in the Experience timeline.
        worksFor: experience
          .filter((job) => job.roles.some(isCurrentRole))
          .map((job) => ({
            "@type": "Organization",
            name: job.company,
            ...(job.href && { url: job.href }),
          })),
        knowsAbout: [
          "FastAPI",
          "Python",
          "Next.js",
          "React",
          "TypeScript",
          "PostgreSQL",
          "Celery",
          "Docker",
          "LLM pipelines",
          "Retrieval-augmented generation",
          "n8n automation",
        ],
        sameAs: profile.socials
          .filter((s) => s.kind !== "email")
          .map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: profile.name,
        url: absoluteUrl("/"),
        inLanguage: "en",
        description: site.description,
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Marquee />
      <Skills />
      <Readme />
      <Experience />
      <Works />
      <Recommendations />
      <Notes />
      <GitHubActivity />
      <Contact />
    </>
  );
}
