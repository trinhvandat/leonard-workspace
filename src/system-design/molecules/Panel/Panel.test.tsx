import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "./Panel";

/** Render tests for `Panel` (REGISTRY: molecules/Panel). */
describe("Panel", () => {
  it("renders the title and children", () => {
    render(
      <Panel title="What I do well">
        <p>Backend systems, resilient under load.</p>
      </Panel>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "What I do well" })).toBeInTheDocument();
    expect(screen.getByText("Backend systems, resilient under load.")).toBeInTheDocument();
  });

  it("renders the label at the given heading level", () => {
    render(
      <Panel title="Experience" as="h3">
        <p>Role detail.</p>
      </Panel>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Experience" })).toBeInTheDocument();
  });
});
