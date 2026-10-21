export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  titleSize?: number;
  lines?: string[];
  lineSize?: number;
  tone?: "accent" | "note";
  kicker?: boolean;
  detail: string;
}

export interface DiagramEdge {
  id: string;
  d: string;
  tone?: "accent" | "faint";
  dashed?: boolean;
  arrow?: boolean;
}

export interface DiagramLabel {
  x: number;
  y: number;
  text: string;
  kind: "kicker" | "caption";
}

export interface DiagramStep {
  node: string;
  edges?: string[];
  caption: string;
}

export interface Diagram {
  id: string;
  alt: string;
  playLabel: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  labels?: DiagramLabel[];
  flow: DiagramStep[];
}

export const diagrams = {
  implementai: {
    id: "implementai",
    alt: "Implement AI architecture: a Next.js client calls FastAPI, which reads PostgreSQL with Alembic migrations, pushes jobs onto RabbitMQ for Celery workers backed by Redis, and receives Stripe billing webhooks.",
    playLabel: "Follow a request",
    nodes: [
      {
        id: "client",
        x: 34,
        y: 212,
        w: 126,
        h: 72,
        title: "Client",
        titleSize: 17,
        lines: ["Next.js"],
        detail: "The Next.js frontend. Every request to the API carries a JWT.",
      },
      {
        id: "api",
        x: 216,
        y: 196,
        w: 164,
        h: 104,
        title: "FastAPI",
        titleSize: 19,
        lines: ["async SQLAlchemy", "JWT · RBAC"],
        tone: "accent",
        detail:
          "The core of the platform: async FastAPI on async SQLAlchemy, with JWT auth and role-based access on every route.",
      },
      {
        id: "pg",
        x: 446,
        y: 58,
        w: 176,
        h: 72,
        title: "PostgreSQL",
        titleSize: 16,
        lines: ["Alembic migrations"],
        detail:
          "The system of record. Every schema change is an Alembic migration.",
      },
      {
        id: "mq",
        x: 446,
        y: 212,
        w: 152,
        h: 72,
        title: "RabbitMQ",
        titleSize: 16,
        lines: ["job queue"],
        detail:
          "The job queue. Work that shouldn't happen inside a request waits here instead of making the user wait.",
      },
      {
        id: "celery",
        x: 640,
        y: 212,
        w: 126,
        h: 72,
        title: "Celery",
        titleSize: 16,
        lines: ["workers"],
        detail: "Background workers that take jobs off the queue and run them.",
      },
      {
        id: "redis",
        x: 640,
        y: 318,
        w: 126,
        h: 66,
        title: "Redis",
        titleSize: 16,
        lines: ["results"],
        detail: "Where the workers store task results.",
      },
      {
        id: "stripe",
        x: 446,
        y: 366,
        w: 152,
        h: 72,
        title: "Stripe",
        titleSize: 16,
        lines: ["billing webhooks"],
        detail:
          "Billing. Stripe's webhooks report payment events back to the API.",
      },
      {
        id: "ship",
        x: 34,
        y: 366,
        w: 330,
        h: 72,
        title: "Shipped via",
        kicker: true,
        lines: ["Docker · GitHub Actions"],
        lineSize: 14,
        tone: "note",
        detail: "Built into Docker images and deployed through GitHub Actions.",
      },
    ],
    edges: [
      { id: "client-api", d: "M160 248 H206", tone: "accent" },
      { id: "api-pg", d: "M380 226 H412 V94 H436" },
      { id: "api-mq", d: "M380 248 H436" },
      { id: "api-stripe", d: "M380 270 H412 V402 H436" },
      { id: "mq-celery", d: "M598 248 H630" },
      { id: "celery-redis", d: "M703 284 V308" },
    ],
    flow: [
      {
        node: "client",
        caption: "A request leaves the Next.js client, carrying a JWT.",
      },
      {
        node: "api",
        edges: ["client-api"],
        caption:
          "FastAPI checks the token and the caller's role before doing anything.",
      },
      {
        node: "pg",
        edges: ["api-pg"],
        caption: "Reads and writes go to PostgreSQL.",
      },
      {
        node: "mq",
        edges: ["api-mq"],
        caption:
          "Work that shouldn't block the response is queued on RabbitMQ.",
      },
      {
        node: "celery",
        edges: ["mq-celery"],
        caption: "A Celery worker picks the job up in the background…",
      },
      {
        node: "redis",
        edges: ["celery-redis"],
        caption: "…and stores its result in Redis.",
      },
      {
        node: "stripe",
        edges: ["api-stripe"],
        caption: "Billing runs through Stripe, reported back by its webhooks.",
      },
      {
        node: "ship",
        caption: "All of it ships as Docker images through GitHub Actions.",
      },
    ],
  },

  legiflow: {
    id: "legiflow",
    alt: "Legiflow architecture: case files from Wasabi or S3 are extracted, chunked, embedded and stored in PostgreSQL; a lawyer's question goes through retrieval scoped to a single case file before Gemini answers with a citation.",
    playLabel: "Follow a question",
    labels: [
      { x: 40, y: 56, text: "Ingest", kind: "kicker" },
      { x: 40, y: 236, text: "Ask", kind: "kicker" },
    ],
    nodes: [
      {
        id: "files",
        x: 34,
        y: 74,
        w: 146,
        h: 70,
        title: "Case files",
        lines: ["Wasabi / S3"],
        detail: "Where the case documents live: Wasabi or S3 object storage.",
      },
      {
        id: "extract",
        x: 222,
        y: 74,
        w: 146,
        h: 70,
        title: "Extract",
        lines: ["entities · structure"],
        detail:
          "Pulls entities and structure out of each document into structured storage.",
      },
      {
        id: "chunk",
        x: 410,
        y: 74,
        w: 146,
        h: 70,
        title: "Chunk",
        lines: ["+ embed"],
        detail: "Splits documents into passages and embeds them for retrieval.",
      },
      {
        id: "store",
        x: 598,
        y: 74,
        w: 168,
        h: 70,
        title: "PostgreSQL",
        lines: ["chunks + metadata"],
        detail:
          "Holds the chunks and their metadata, including which case file each one belongs to.",
      },
      {
        id: "question",
        x: 34,
        y: 254,
        w: 146,
        h: 70,
        title: "Question",
        lines: ["from the lawyer"],
        detail: "A lawyer's question, asked about one case.",
      },
      {
        id: "retrieval",
        x: 222,
        y: 238,
        w: 200,
        h: 102,
        title: "Scoped retrieval",
        titleSize: 16,
        lines: ["restricted to one case file", "no cross-case leakage"],
        tone: "accent",
        detail:
          "Searches only the case file in scope, so no passage from another case can be retrieved.",
      },
      {
        id: "gemini",
        x: 464,
        y: 254,
        w: 146,
        h: 70,
        title: "Gemini",
        lines: ["answer + citation"],
        detail:
          "Writes the answer from the retrieved passages and cites where it came from.",
      },
      {
        id: "ui",
        x: 652,
        y: 254,
        w: 114,
        h: 70,
        title: "Next.js",
        lines: ["UI"],
        detail: "The app where lawyers ask questions and check the citations.",
      },
      {
        id: "rule",
        x: 34,
        y: 392,
        w: 732,
        h: 62,
        title: "",
        lines: [
          "Answers can only come from the case file in scope — the constraint is the product.",
        ],
        lineSize: 14,
        tone: "note",
        detail: "The whole design follows from this one rule.",
      },
    ],
    edges: [
      { id: "files-extract", d: "M180 109 H212" },
      { id: "extract-chunk", d: "M368 109 H400" },
      { id: "chunk-store", d: "M556 109 H588" },
      { id: "question-retrieval", d: "M180 289 H212", tone: "accent" },
      { id: "retrieval-gemini", d: "M422 289 H454", tone: "accent" },
      { id: "gemini-ui", d: "M610 289 H642" },
      { id: "store-retrieval", d: "M682 144 V208 H322 V228", dashed: true },
    ],
    flow: [
      { node: "files", caption: "Case files arrive from Wasabi or S3." },
      {
        node: "extract",
        edges: ["files-extract"],
        caption: "Entities and structure are extracted from each document.",
      },
      {
        node: "chunk",
        edges: ["extract-chunk"],
        caption: "The text is split into chunks and embedded.",
      },
      {
        node: "store",
        edges: ["chunk-store"],
        caption:
          "Chunks are stored in PostgreSQL, each tagged with its case file.",
      },
      { node: "question", caption: "A lawyer asks a question about one case." },
      {
        node: "retrieval",
        edges: ["question-retrieval", "store-retrieval"],
        caption: "Retrieval searches only that case file's chunks.",
      },
      {
        node: "gemini",
        edges: ["retrieval-gemini"],
        caption: "Gemini answers from those chunks alone, with a citation.",
      },
      {
        node: "ui",
        edges: ["gemini-ui"],
        caption: "The answer and its citation appear in the app.",
      },
      {
        node: "rule",
        caption: "Nothing outside the case file can reach the answer.",
      },
    ],
  },

  "llm-evaluator": {
    id: "llm-evaluator",
    alt: "LLM Evaluator architecture: database state is snapshotted before and after a run of the model with its tool calls, then diffed and asserted against, acting as a regression gate.",
    playLabel: "Run an evaluation",
    labels: [
      {
        x: 400,
        y: 86,
        text: "Model output is judged against database state, not against a transcript.",
        kind: "caption",
      },
    ],
    nodes: [
      {
        id: "before",
        x: 34,
        y: 196,
        w: 156,
        h: 96,
        title: "Snapshot",
        lines: ["DB state", "before the run"],
        detail: "The database as it was before the model ran.",
      },
      {
        id: "run",
        x: 242,
        y: 180,
        w: 180,
        h: 128,
        title: "Run",
        titleSize: 17,
        lines: ["model + tool calls", "exercising the", "full code path"],
        tone: "accent",
        detail:
          "The model runs and calls its tools through the real code path.",
      },
      {
        id: "after",
        x: 474,
        y: 196,
        w: 156,
        h: 96,
        title: "Snapshot",
        lines: ["DB state", "after the run"],
        detail: "The database after the run, ready to compare.",
      },
      {
        id: "diff",
        x: 474,
        y: 344,
        w: 292,
        h: 88,
        title: "Diff & assert",
        lines: [
          "did the run change what it should have,",
          "and nothing it should not?",
        ],
        detail:
          "Compares the two snapshots: the expected changes must be there, and nothing else may have changed.",
      },
      {
        id: "gate",
        x: 34,
        y: 344,
        w: 292,
        h: 88,
        title: "Regression gate",
        kicker: true,
        lines: ["a model change ships only if", "every assertion still holds"],
        tone: "note",
        detail: "The suite works as a gate on every model or prompt change.",
      },
    ],
    edges: [
      { id: "before-run", d: "M190 244 H232", tone: "accent" },
      { id: "run-after", d: "M422 244 H464", tone: "accent" },
      { id: "after-diff", d: "M552 292 V334" },
      { id: "diff-gate", d: "M474 388 H336" },
      {
        id: "before-diff",
        d: "M112 292 V320 H620 V334",
        tone: "faint",
        dashed: true,
        arrow: false,
      },
    ],
    flow: [
      { node: "before", caption: "Snapshot the database before the run." },
      {
        node: "run",
        edges: ["before-run"],
        caption:
          "Run the model with its tool calls, through the real code path.",
      },
      {
        node: "after",
        edges: ["run-after"],
        caption: "Snapshot the database again.",
      },
      {
        node: "diff",
        edges: ["after-diff", "before-diff"],
        caption:
          "Diff the two: did it change what it should, and nothing else?",
      },
      {
        node: "gate",
        edges: ["diff-gate"],
        caption: "A model change ships only if every assertion still holds.",
      },
    ],
  },
  doorman: {
    id: "doorman",
    alt: "The Doorman Game architecture: a player's message goes to a FastAPI backend, which keeps conversation memory, asks a hidden judge model to score the message and move an influence meter, and asks the doorman model to reply in character.",
    playLabel: "Play a turn",
    labels: [
      {
        x: 400,
        y: 86,
        text: "Talk your way in: a hidden judge decides whether it worked.",
        kind: "caption",
      },
    ],
    nodes: [
      {
        id: "player",
        x: 34,
        y: 184,
        w: 140,
        h: 84,
        title: "Player",
        lines: ["React · Vite"],
        detail: "You, trying to talk your way past the doorman.",
      },
      {
        id: "api",
        x: 226,
        y: 170,
        w: 170,
        h: 112,
        title: "FastAPI",
        titleSize: 19,
        lines: ["sessions", "via OpenRouter"],
        tone: "accent",
        detail:
          "The backend: it keeps each game session and calls both models through OpenRouter.",
      },
      {
        id: "doorman",
        x: 452,
        y: 184,
        w: 170,
        h: 84,
        title: "Arthur",
        lines: ["Llama 3.1 8B", "the doorman"],
        detail:
          "The doorman, played in character. He never reveals the rules and ignores attempts to override them.",
      },
      {
        id: "memory",
        x: 226,
        y: 340,
        w: 170,
        h: 96,
        title: "Memory",
        lines: ["last 16 messages", "+ a running summary"],
        detail:
          "Recent messages are kept in full and older ones are summarised, so long conversations stay consistent.",
      },
      {
        id: "judge",
        x: 452,
        y: 340,
        w: 170,
        h: 96,
        title: "Judge",
        lines: ["Llama 3.3 70B", "scores −6 to +6"],
        detail:
          "A hidden model that scores each message against Arthur's secret profile and returns strict JSON.",
      },
      {
        id: "meter",
        x: 660,
        y: 340,
        w: 118,
        h: 96,
        title: "Meter",
        lines: ["+30 wins", "−30 loses"],
        detail:
          "Each score moves the influence meter until you get in or get turned away.",
      },
    ],
    edges: [
      { id: "player-api", d: "M174 226 H216", tone: "accent" },
      { id: "api-doorman", d: "M396 226 H442", tone: "accent" },
      { id: "api-memory", d: "M311 282 V330" },
      { id: "api-judge", d: "M396 262 H424 V388 H442" },
      { id: "judge-meter", d: "M622 388 H650" },
      {
        id: "doorman-player",
        d: "M537 184 V140 H104 V174",
        tone: "faint",
        dashed: true,
      },
    ],
    flow: [
      {
        node: "player",
        caption: "You try to talk your way past Arthur, the doorman.",
      },
      {
        node: "api",
        edges: ["player-api"],
        caption: "FastAPI takes your message and the game so far.",
      },
      {
        node: "memory",
        edges: ["api-memory"],
        caption: "Older turns are summarised, so long chats stay consistent.",
      },
      {
        node: "judge",
        edges: ["api-judge"],
        caption: "A hidden judge scores your message from −6 to +6.",
      },
      {
        node: "meter",
        edges: ["judge-meter"],
        caption:
          "The score moves the meter: +30 gets you in, −30 gets you turned away.",
      },
      {
        node: "doorman",
        edges: ["api-doorman"],
        caption: "Arthur replies in character, without revealing the rules.",
      },
      {
        node: "player",
        edges: ["doorman-player"],
        caption: "His reply comes back, and it's your move again.",
      },
    ],
  },
} satisfies Record<string, Diagram>;

export type DiagramId = keyof typeof diagrams;
