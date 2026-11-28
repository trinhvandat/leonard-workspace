import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getNoteBySlug } from "@/content";
import { MetaRow } from "./MetaRow";

/** Render tests for the `MetaRow` molecule (REGISTRY: molecules/MetaRow). */
describe("MetaRow", () => {
  const note = getNoteBySlug("monolith-to-microservices");
  if (note === undefined) {
    throw new Error("fixture note 'monolith-to-microservices' not found — check content/notes/");
  }

  it("layout='card' renders planted/tended/maturity/confidence rows and topic pills", () => {
    render(<MetaRow note={note} layout="card" />);

    expect(screen.getByText("planted")).toBeInTheDocument();
    expect(screen.getByText("tended")).toBeInTheDocument();
    expect(screen.getByText("maturity")).toBeInTheDocument();
    expect(screen.getByText("confidence")).toBeInTheDocument();
    expect(screen.getByText(note.confidence)).toBeInTheDocument();

    const topicLink = screen.getByRole("link", { name: `#${note.topics[0]}` });
    expect(topicLink).toHaveAttribute("href", `/topics/${note.topics[0]}`);
  });

  it("layout='bar' renders the compact inline planted · tended · confidence strip", () => {
    render(<MetaRow note={note} layout="bar" />);

    expect(screen.getByText("planted")).toBeInTheDocument();
    expect(screen.getByText("tended")).toBeInTheDocument();
    expect(screen.getByText(note.confidence)).toBeInTheDocument();
    // "bar" layout has no maturity row or topic pills.
    expect(screen.queryByText("maturity")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
