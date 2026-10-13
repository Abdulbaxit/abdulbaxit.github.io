export const site = {
  url: "https://abdulbaxit.github.io",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  title: "Abdul Basit · Software Engineer",
  description:
    "Abdul Basit is a Software Engineer in Lahore, Pakistan. I build AI systems, LLM pipelines and full-stack applications with FastAPI, Next.js and PostgreSQL.",
  shortDescription:
    "I build AI systems, LLM pipelines and full-stack applications. FastAPI, Next.js, PostgreSQL.",
  locale: "en_US",
} as const;

export const integrations: {
  googleSiteVerification: string | null;
  goatCounter: string | null;
} = {
  googleSiteVerification: null,
  goatCounter: null,
};

export function asset(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.basePath}${clean}`;
}

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${clean}`;
}
