import { Hero } from "@/components/Hero";
import { PageSlide } from "@/components/PageSlide";
import { Marquee } from "@/components/Marquee";
import { Skills } from "@/components/Skills";
import { Readme } from "@/components/Readme";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { TimelineProgress } from "@/components/TimelineProgress";
import { Works } from "@/components/Works";
import { Recommendations } from "@/components/Recommendations";
import { Notes } from "@/components/Notes";
import { GitHubActivity } from "@/components/GitHubActivity";
import { Contact } from "@/components/Contact";
import {
  profile,
  experience,
  education,
  isCurrentRole,
} from "@/content/profile";
import { site, absoluteUrl } from "@/content/site";

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
        alumniOf: education.map((entry) => ({
          "@type": "CollegeOrUniversity",
          name: entry.school,
          ...(entry.href && { url: entry.href }),
        })),
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
    <PageSlide>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Marquee />
      <Skills />
      <Readme />
      <Experience />
      <Education />
      <TimelineProgress />
      <Works />
      <Recommendations />
      <Notes />
      <GitHubActivity />
      <Contact />
    </PageSlide>
  );
}
