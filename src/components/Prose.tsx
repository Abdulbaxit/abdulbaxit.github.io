import { Fragment } from "react";
import { parseProse, parseInline } from "@/lib/prose";

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((part, i) =>
        part.code ? (
          <code key={i} className="prose__code-inline">
            {part.text}
          </code>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}

/** Renders a note body written in the small Markdown subset of lib/prose. */
export function Prose({ source }: { source: string }) {
  return (
    <div className="prose">
      {parseProse(source).map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i}>
                <Inline text={block.text} />
              </h2>
            );
          case "list":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <pre key={i} className="prose__code">
                <code>{block.code}</code>
              </pre>
            );
          default:
            return (
              <p key={i}>
                <Inline text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
