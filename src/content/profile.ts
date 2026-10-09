import type {
  Profile,
  Job,
  Role,
  Recommendation,
  SkillBlock,
  ImpactStat,
  StatusLine,
} from "./types";

export const profile: Profile = {
  name: "Abdul Basit",
  nameLines: ["Abdul", "Basit"],
  initials: "ab",
  role: "Software Engineer",
  tagline:
    "I build production backends and AI-powered systems, and I deploy and maintain what I ship.",
  location: "Lahore, Pakistan",
  email: "abasita33@gmail.com",
  heroStack: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Celery"],
  contactReasons: [
    {
      label: "Hiring",
      subject: "Role at [company]",
      body:
        "Hi Abdul,\n\n" +
        "We're hiring and your work looked like a fit.\n\n" +
        "Role: \n" +
        "Stack: \n" +
        "Location / remote: \n\n" +
        "Happy to share more.\n\n" +
        "— ",
    },
    {
      label: "Freelance",
      subject: "Project I'd like your help with",
      body:
        "Hi Abdul,\n\n" +
        "I have a project I think you'd be right for.\n\n" +
        "What it is: \n" +
        "Rough timeline: \n" +
        "Budget range: \n\n" +
        "— ",
    },
    {
      label: "Just saying hi",
      subject: "Hello from your portfolio",
      body:
        "Hi Abdul,\n\n" +
        "Came across your portfolio and wanted to say hello.\n\n" +
        "— ",
    },
  ],
  /*
    Cal.com event behind the dock's "Book a call" pill, as
    "username/event-slug". The 15-minute event is
    "abdul-basit-jcbhuk/15min". Null hides the pill.
  */
  calLink: "abdul-basit-jcbhuk/30min",
  calNamespace: "30min",
  resumeHref: "/Abdul%20Basit%20CV.pdf",
  portrait: "/assets/images/portrait.webp",
  socials: [
    {
      kind: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/abdul-basit-761062199/",
    },
    {
      kind: "github",
      label: "GitHub",
      href: "https://github.com/Abdulbaxit",
    },
    { kind: "email", label: "Email", href: "mailto:abasita33@gmail.com" },
  ],
  // Public: anyone who visits sees this, current employers included.
  availability: "Open to new opportunities",
  timeZone: "Asia/Karachi",
  replyNote: "I usually reply within a day",
  github: "Abdulbaxit",
  // From the CV's skills. Order is the order they scroll past.
  toolbelt: [
    "Python", "FastAPI", "TypeScript", "Next.js", "React", "PostgreSQL",
    "SQLAlchemy", "Celery", "RabbitMQ", "Redis", "Docker", "GitHub Actions",
    "AWS", "Gemini", "LangChain", "RAG", "n8n", "Supabase", "Drizzle", "Tailwind",
  ],
};

/**
 * Quotes from colleagues or clients. Empty hides the section. Only add
 * quotes you have the person's permission to publish, e.g.:
 *
 *   {
 *     quote: "Abdul owned the backend end to end ...",
 *     name: "Jane Doe",
 *     role: "Engineering Lead, Techanzy",
 *     href: "https://www.linkedin.com/in/...",
 *   },
 */
export const recommendations: Recommendation[] = [
  {
    quote:
      "Basit was a valuable contributor to our work on Happy Fish, Yat Guan, and Overmugged at Voltade. He demonstrated strong problem-solving skills, a collaborative mindset, and a commitment to delivering quality work. His ability to adapt to project requirements and contribute to the team made him a great asset to our projects.",
    name: "Leonard Loo",
    role: "CEO, Voltade",
  },
  {
    quote:
      "During his time at Devsarch, he contributed to a range of projects spanning software development, AI evaluation, and workflow automation. His work on Legiflow, the LLM Evaluator project for Turing, and n8n onboarding automation reflected his ability to adapt to different technical challenges and deliver practical solutions. He consistently showed curiosity, initiative, and a strong willingness to learn.",
    name: "Aswad Ali",
    role: "CTO, Devsarch",
  },
];

/** Employment, current roles first. Dates and details follow the CV. */
export const experience: Job[] = [
  {
    company: "Techanzy",
    href: "https://www.techanzy.com/",
    roles: [
      {
        title: "Software Engineer",
        period: "Apr 2026 — present",
        summary:
          "I build and maintain the backend for Implement AI: Python FastAPI with async SQLAlchemy, PostgreSQL and Alembic migrations, JWT auth and RBAC.",
        highlights: [
          "REST APIs across organisations, Stripe billing webhooks, documents, CRM/teams and scheduling",
          "Background processing on Celery with RabbitMQ and Redis, shipped via Docker and GitHub Actions",
        ],
      },
    ],
  },
  {
    company: "Voltade",
    href: "https://voltade.com/",
    terms: "Remote · Part-time",
    roles: [
      {
        title: "Full Stack Engineer",
        period: "Oct 2025 — present",
        summary:
          "Client platforms across React, Vite and Mantine frontends, Hono/Node.js APIs and PostgreSQL with Drizzle ORM.",
        highlights: [
          "Shipped features for Happy Fish, Yat Guan and the Overmugged portal",
        ],
      },
    ],
  },
  {
    company: "Devsarch",
    href: "https://devsarch.com/",
    roles: [
      {
        title: "Associate Software Engineer",
        period: "Mar 2025 — Apr 2026",
        summary:
          "AI products for clients, owned end to end: requirements, client communication, deployment and maintenance.",
        highlights: [
          "Legiflow: entity extraction, structured storage and a chatbot restricted to the case file itself, cutting manual document processing by around 90%",
          "LLM Evaluator (client: Turing): evaluation pipelines that validate database state before and after each tool-calling run",
          "n8n onboarding workflows integrating internal tools and notifications, automating 100+ employee onboardings",
        ],
      },
    ],
  },
];

/** A role still running: its period ends in "present". */
export function isCurrentRole(role: Role): boolean {
  return /present$/i.test(role.period);
}

export const skills: SkillBlock[] = [
  {
    title: "backend",
    body: "I build scalable, maintainable backends with FastAPI, async SQLAlchemy and PostgreSQL, plus Celery, RabbitMQ and Redis for the work that shouldn't happen in a request cycle.",
  },
  {
    title: "frontend",
    body: "Client-side applications with Next.js, React, TypeScript and Tailwind — keeping semantic markup and accessible patterns rather than bolting them on afterwards.",
  },
];

export const impact: ImpactStat[] = [
  {
    value: "90",
    suffix: "%",
    label: "Cut from manual legal document processing on Legiflow",
  },
  {
    value: "100",
    suffix: "+",
    label: "Employee onboardings automated with n8n and Node.js",
  },
  {
    value: "4",
    label: "Companies shipped to production for, since 2023",
  },
];

export const statusLines: StatusLine[] = [
  {
    icon: "microscope",
    verb: "Building",
    text: "implementai.io",
    href: "https://implementai.io/",
  },
  {
    icon: "users",
    verb: "Shipped",
    text: "happyfish.voltade.com",
    href: "https://happyfish.voltade.com",
  },
  {
    icon: "seedling",
    verb: "Shipped",
    text: "yatguan.voltade.com",
    href: "https://yatguan.voltade.com",
  },
  {
    icon: "bolt",
    text: "AI pipelines and LLM evaluation",
  },
];

export const funFact =
  "For seven months I was shipping at two companies at once — Devsarch by day, Voltade on the side. Both went to production 🚀";

/** Paragraphs of the bio. `[text](url)` renders as a link. */
export const readme: string[] = [
  "I'm a Software Engineer who likes the unglamorous half of the job: the queue that has to drain, the migration that has to be reversible, the endpoint that has to behave the same at 3am. Most of what I've shipped lives in that layer.",
  "At Techanzy I build the backend for [Implement AI](https://implementai.io/) — a production FastAPI platform with async SQLAlchemy, PostgreSQL and Alembic, JWT auth, and Celery/RabbitMQ/Redis background jobs. Before that, at Devsarch, I worked on Legiflow — entity extraction and a chatbot restricted to the case file itself.",
  "The through-line is that I'd rather own a system than hand it off at the boundary. Nearly everything I've worked on, I also deployed — and was still the one maintaining it months later.",
];
