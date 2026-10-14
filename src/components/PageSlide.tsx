import { ViewTransition } from "react";

const DIRECTIONS = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

export function PageSlide({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={DIRECTIONS} exit={DIRECTIONS} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

export function Morph({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

export function NoteTitle({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return <Morph name={`note-title-${slug}`}>{children}</Morph>;
}
