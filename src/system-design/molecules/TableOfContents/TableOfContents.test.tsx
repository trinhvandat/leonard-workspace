import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "./TableOfContents";

/** Render tests for the `TableOfContents` molecule (REGISTRY: molecules/TableOfContents). */
describe("TableOfContents", () => {
  it("renders nothing for fewer than two headings", () => {
    const { container } = render(<TableOfContents headings={[{ id: "a", text: "A", depth: 2 }]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an anchor per heading, in order", () => {
    render(
      <TableOfContents
        headings={[
          { id: "intro", text: "Intro", depth: 2 },
          { id: "details", text: "Details", depth: 3 },
        ]}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["Intro", "Details"]);
    expect(links[0]).toHaveAttribute("href", "#intro");
    expect(links[1]).toHaveAttribute("href", "#details");
  });
});
