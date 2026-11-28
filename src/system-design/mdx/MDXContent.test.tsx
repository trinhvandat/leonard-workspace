import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getNoteBySlug } from "@/content";
import { MDXContent } from "./MDXContent";

/**
 * Proves the Velite → React bridge actually renders: a real compiled note
 * body, a resolved wiki-link, a highlighted code block, and a heading id
 * matching `rehype-slug`'s output (REGISTRY: mdx/MDXContent).
 */
describe("MDXContent", () => {
  const note = getNoteBySlug("monolith-to-microservices");
  if (note === undefined) {
    throw new Error("fixture note 'monolith-to-microservices' not found — check content/notes/");
  }

  it("resolves a [[wiki-link]] to the target note's title and href", () => {
    render(<MDXContent code={note.body} />);

    const target = getNoteBySlug("feature-flags-that-scale");
    expect(target).toBeDefined();
    const link = screen.getByRole("link", { name: target!.title });
    expect(link).toHaveAttribute("href", "/notes/feature-flags-that-scale");
  });

  it("renders a Shiki-highlighted code block", () => {
    const { container } = render(<MDXContent code={note.body} />);

    expect(container.querySelector("pre.shiki")).not.toBeNull();
  });

  it("gives the heading a rehype-slug id for TOC/anchor landings", () => {
    render(<MDXContent code={note.body} />);

    expect(document.getElementById("route-dont-rewrite")).not.toBeNull();
  });
});
