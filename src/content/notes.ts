import type { Note } from "./types";

/**
 * Short technical notes, newest first. Each becomes /notes/<slug>/ and an
 * entry in the Notes section, the sitemap and llms.txt. Bodies use the
 * Markdown subset described on the Note type.
 */
export const notes: Note[] = [
  {
    slug: "testing-llm-tool-calls-against-the-database",
    title: "Testing LLM tool calls against the database, not the transcript",
    description:
      "For a model that changes data, the transcript is the wrong thing to grade. Snapshot the database before and after the run, and assert on the difference.",
    date: "2026-10-09",
    tags: ["LLM evaluation", "Testing", "PostgreSQL"],
    body: `On the LLM Evaluator project at Devsarch (client: Turing) I maintained evaluation pipelines for models that call tools. The core idea fits in one sentence: model output is judged against database state, not against a transcript.

## Why not grade the transcript

When a model can call tools that write to a database, what it says and what it does can drift apart. A response can read perfectly while the tool call underneath wrote the wrong row, or wrote two. Grading the text rewards the description of the work, not the work.

## The shape of the harness

- Snapshot the relevant database state before the run.
- Run the model with its tool calls, exercising the full code path.
- Snapshot the state again after the run.
- Diff the two snapshots and assert on the difference.

It is built with FastAPI, PostgreSQL and Pytest, so every evaluation is an ordinary test.

## Assert both directions

The diff answers two questions, and both matter:

- Did the run change what it should have?
- Did it change anything it should not have?

The second is easy to skip, and it is where the expensive bugs hide: an extra update, a record touched outside the scope of the request. A diff makes unintended writes visible by default instead of something you have to remember to check.

## A regression gate

Put together, the suite becomes a gate: a model change ships only if every assertion still holds. Model and prompt changes then go through the same check as any other change to the code.`,
  },
  {
    slug: "keeping-a-rag-chatbot-inside-one-case-file",
    title: "Keeping a RAG chatbot inside one case file",
    description:
      "On Legiflow, a lawyer's question could only be answered from the case file in scope. Why that constraint was the product, and why it lives in retrieval rather than the prompt.",
    date: "2026-10-09",
    tags: ["RAG", "LLMs", "Legiflow"],
    body: `Legiflow is an AI tool for legal documents that I worked on at Devsarch. Case files come in, entities and structure are extracted, and a lawyer can ask questions about a case. The chatbot had one rule above everything else: answers can only come from the case file in scope.

## Why the constraint is the product

A general-purpose assistant that is mostly right is a liability in legal work. If an answer about one case quietly draws on a paragraph from another, the lawyer has no way to tell, and the mistake reads exactly as confidently as a correct answer. The useful property is not how much the model knows. It is what it is not allowed to see.

## Where the boundary lives

The pipeline has two halves:

- Ingest: case files from Wasabi or S3 are extracted, chunked, embedded and stored in PostgreSQL, with metadata recording which case file each chunk belongs to.
- Ask: a question goes through retrieval scoped to a single case file, and only then to Gemini, which answers with a citation.

The scoping happens in retrieval, before the model is involved. Telling a model "only use documents from this case" in the prompt is a request. Filtering the chunks it receives is a guarantee: a chunk from another case that never reaches the context cannot leak into the answer.

## Citations close the loop

Every answer comes back with a citation into the case file, so a lawyer can check the source instead of trusting the model. That turns the chatbot from something you have to believe into something you can verify.

## What it changed

Together with extraction and structured storage, it cut manual document processing by around 90%.`,
  },
];

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}
