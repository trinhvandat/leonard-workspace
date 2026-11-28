import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getNoteBySlug } from "@/content";
import { NotePageHead } from "./NotePageHead";

/** Render tests for the `NotePageHead` organism (REGISTRY: organisms/NotePageHead). */
describe("NotePageHead", () => {
  const note = getNoteBySlug("monolith-to-microservices");
  if (note === undefined) {
    throw new Error("fixture note 'monolith-to-microservices' not found — check content/notes/");
  }

  it("renders the garden/notes/[slug] crumb, maturity badge, and h1 title", () => {
    render(<NotePageHead note={note} />);

    expect(screen.getByRole("link", { name: "garden" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "notes" })).toHaveAttribute("href", "/notes");
    expect(screen.getByText(note.slug)).toBeInTheDocument();

    expect(screen.getByText(note.maturity)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: note.title })).toBeInTheDocument();
  });
});
