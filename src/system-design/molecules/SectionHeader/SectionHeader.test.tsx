import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./SectionHeader";

/** Render tests for `SectionHeader` (REGISTRY: molecules/SectionHeader). */
describe("SectionHeader", () => {
  it("renders the title as a level-2 heading", () => {
    render(<SectionHeader title="What's growing" />);
    expect(screen.getByRole("heading", { level: 2, name: "What's growing" })).toBeInTheDocument();
  });

  it("shows the count label when provided and omits it otherwise", () => {
    const { rerender } = render(<SectionHeader title="Notes" count="9 notes" />);
    expect(screen.getByText("9 notes")).toBeInTheDocument();

    rerender(<SectionHeader title="Notes" />);
    expect(screen.queryByText("9 notes")).not.toBeInTheDocument();
  });
});
