import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getNoteBySlug } from "@/content";
import type { ConnectedNote } from "@/system-design/molecules/BacklinkList";
import { NoteReadingColumn } from "./NoteReadingColumn";

/** Render tests for the `NoteReadingColumn` organism (REGISTRY: organisms/NoteReadingColumn). */
describe("NoteReadingColumn", () => {
  const note = getNoteBySlug("monolith-to-microservices");
  if (note === undefined) {
    throw new Error("fixture note 'monolith-to-microservices' not found — check content/notes/");
  }
  const target = getNoteBySlug("feature-flags-that-scale");
  if (target === undefined) {
    throw new Error("fixture note 'feature-flags-that-scale' not found — check content/notes/");
  }
  const connected: ConnectedNote[] = [{ direction: "linksTo", note: target }];

  it("renders the inline meta bar, compiled MDX body, citations, and connected notes", () => {
    render(<NoteReadingColumn note={note} connected={connected} />);

    // Narrow-only inline MetaRow bar.
    expect(screen.getByText("planted")).toBeInTheDocument();

    // Compiled MDX body — a resolved wiki-link to the connected note.
    expect(screen.getByRole("link", { name: target.title })).toHaveAttribute(
      "href",
      `/notes/${target.slug}`,
    );

    // Citations, numbered from the note's frontmatter.
    expect(screen.getByText("[1]")).toBeInTheDocument();

    // In-column connected notes.
    expect(screen.getByText("Connected notes")).toBeInTheDocument();

    // Foot nav.
    expect(screen.getByRole("link", { name: "← all notes" })).toHaveAttribute("href", "/notes");
    expect(screen.getByRole("link", { name: "Work with me →" })).toHaveAttribute("href", "/about");
  });
});
