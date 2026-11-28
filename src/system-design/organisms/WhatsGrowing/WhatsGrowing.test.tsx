import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeNote } from "@/content/fixtures";
import { WhatsGrowing } from "./WhatsGrowing";

/** Render test for `WhatsGrowing` (REGISTRY: organisms/WhatsGrowing). */
describe("WhatsGrowing", () => {
  it("renders the section count, a card per note, and a browse-all link", () => {
    const notes = [
      makeNote({ slug: "a", title: "Note A", raw: "First." }),
      makeNote({ slug: "b", title: "Note B", raw: "Second." }),
    ];
    render(<WhatsGrowing notes={notes} total={9} />);

    expect(screen.getByText("9 notes")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Note A" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Note B" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse all notes/i })).toHaveAttribute(
      "href",
      "/notes",
    );
  });
});
