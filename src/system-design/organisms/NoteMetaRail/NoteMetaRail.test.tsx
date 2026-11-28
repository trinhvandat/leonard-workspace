import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getNoteBySlug } from "@/content";
import { extractToc } from "@/content/toc";
import type { ConnectedNote } from "@/system-design/molecules/BacklinkList";
import { NoteMetaRail } from "./NoteMetaRail";

/** Render tests for the `NoteMetaRail` organism (REGISTRY: organisms/NoteMetaRail). */
describe("NoteMetaRail", () => {
  const note = getNoteBySlug("monolith-to-microservices");
  if (note === undefined) {
    throw new Error("fixture note 'monolith-to-microservices' not found — check content/notes/");
  }
  const target = getNoteBySlug("feature-flags-that-scale");
  if (target === undefined) {
    throw new Error("fixture note 'feature-flags-that-scale' not found — check content/notes/");
  }
  const headings = extractToc(note.raw);

  it("renders the field-notes MetaRow, the TOC, and the rail connected-notes list", () => {
    const connected: ConnectedNote[] = [{ direction: "linksTo", note: target }];
    render(<NoteMetaRail note={note} headings={headings} connected={connected} />);

    expect(screen.getByText("Field notes")).toBeInTheDocument();
    expect(screen.getByText("planted")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: headings[0].text })).toHaveAttribute(
      "href",
      `#${headings[0].id}`,
    );

    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(target.title) })).toHaveAttribute(
      "href",
      `/notes/${target.slug}`,
    );
  });

  it("omits the Connected sideblock when there are no connected notes", () => {
    render(<NoteMetaRail note={note} headings={headings} connected={[]} />);
    expect(screen.queryByText("Connected")).not.toBeInTheDocument();
  });
});
