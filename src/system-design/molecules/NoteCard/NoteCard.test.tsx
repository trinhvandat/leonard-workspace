import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeNote } from "@/content/fixtures";
import { NoteCard } from "./NoteCard";

/**
 * Render test for the `NoteCard` molecule (docs/plans/home-screen.md §6 gate 1 /
 * PRD §7). Fixtures are built inline via the content layer's `makeNote` test
 * helper so this test never depends on real seed `.mdx` content.
 */
describe("NoteCard", () => {
  it("renders the title, dek, maturity label, and links to /notes/[slug]", () => {
    const note = makeNote({
      slug: "monolith-to-microservices",
      title: "Monolith → microservices: the patterns that held up",
      maturity: "evergreen",
      raw: "This is the derived dek, the note's opening paragraph.\n\nA second paragraph that is not the dek.",
    });

    render(<NoteCard note={note} />);

    // 1. title
    expect(screen.getByRole("heading", { name: note.title })).toBeInTheDocument();

    // 2. dek — derived from the first paragraph of `raw`
    expect(
      screen.getByText("This is the derived dek, the note's opening paragraph."),
    ).toBeInTheDocument();

    // 3. maturity label — mono text rendered by MaturityBadge
    expect(screen.getByText("Evergreen")).toBeInTheDocument();

    // 4. the whole card links to /notes/[slug]
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/notes/monolith-to-microservices");
  });

  it("renders no draft badge or affordance for a draft note on the public surface", () => {
    const note = makeNote({
      slug: "still-in-the-compost-heap",
      title: "A note still in the compost heap",
      maturity: "seedling",
      draft: true,
      raw: "This note's opening paragraph, unrelated to its publication status.",
    });

    const { container } = render(<NoteCard note={note} />);

    // No "Draft" badge/label anywhere in the card...
    expect(screen.queryByText(/^draft$/i)).not.toBeInTheDocument();
    // ...and no draft-specific class/attribute hook either.
    expect(container.querySelector('[class*="draft" i]')).toBeNull();
    expect(container.querySelector("[data-draft]")).toBeNull();
  });
});
