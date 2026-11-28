import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Stats } from "@/content";
import { StatsStrip } from "./StatsStrip";

/** Render test for `StatsStrip` (REGISTRY: organisms/StatsStrip). */
describe("StatsStrip", () => {
  it("renders a tile with the value + label for each stat", () => {
    const stats: Stats = { notes: 9, topics: 7, pctCited: 100, deadLinks: 0 };
    render(<StatsStrip stats={stats} />);

    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("cited")).toBeInTheDocument();
    expect(screen.getByText("dead links")).toBeInTheDocument();
  });
});
