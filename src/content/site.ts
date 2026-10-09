/**
 * Deployment-level facts. `basePath` mirrors next.config.ts, which reads
 * NEXT_PUBLIC_BASE_PATH from the deploy workflow ("/portfolio" on Pages,
 * empty in local dev).
 */
export const site = {
  /**
   * Public address, used for canonical URLs, OG tags and the sitemap.
   * Includes /portfolio itself, so it is right whatever basePath a given
   * build ran with.
   */
  url: "https://abdulbaxit.github.io/portfolio",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  title: "Abdul Basit · Software Engineer",
  description:
    "Abdul Basit is a Software Engineer in Lahore, Pakistan. I build AI systems, LLM pipelines and full-stack applications with FastAPI, Next.js and PostgreSQL.",
  shortDescription:
    "I build AI systems, LLM pipelines and full-stack applications. FastAPI, Next.js, PostgreSQL.",
  locale: "en_US",
} as const;

/** Prefixes a /public path with the basePath so it resolves on Pages. */
export function asset(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.basePath}${clean}`;
}

/** Absolute URL for canonical + OG metadata. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${clean}`;
}
