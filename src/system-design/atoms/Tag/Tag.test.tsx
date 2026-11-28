import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "./Tag";

/** Render tests for the `Tag` topic chip (REGISTRY: atoms/Tag). */
describe("Tag", () => {
  it("links to its href and shows the label", () => {
    render(<Tag href="/topics/java" label="java" />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/topics/java");
    expect(screen.getByText("java")).toBeInTheDocument();
  });

  it("shows the count when provided and omits it otherwise", () => {
    const { rerender } = render(<Tag href="/topics/java" label="java" count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();

    rerender(<Tag href="/topics/java" label="java" />);
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });
});
