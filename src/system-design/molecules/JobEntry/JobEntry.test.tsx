import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JobEntry } from "./JobEntry";

/** Render tests for `JobEntry` (REGISTRY: molecules/JobEntry). */
describe("JobEntry", () => {
  it("renders role and detail always", () => {
    render(<JobEntry role="Backend Engineer" detail="Builds resilient services." />);
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Builds resilient services.")).toBeInTheDocument();
  });

  it("renders company and period only when provided", () => {
    const { rerender } = render(
      <JobEntry role="Backend Engineer" detail="Builds resilient services." />,
    );
    expect(screen.queryByText("Acme Co")).not.toBeInTheDocument();
    expect(screen.queryByText("2022—now")).not.toBeInTheDocument();

    rerender(
      <JobEntry
        role="Backend Engineer"
        company="Acme Co"
        period="2022—now"
        detail="Builds resilient services."
      />,
    );
    expect(screen.getByText("Acme Co")).toBeInTheDocument();
    expect(screen.getByText("2022—now")).toBeInTheDocument();
  });
});
