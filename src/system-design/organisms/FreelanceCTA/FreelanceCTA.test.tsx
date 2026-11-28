import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FreelanceCTA } from "./FreelanceCTA";

/** Render test for `FreelanceCTA` (REGISTRY: organisms/FreelanceCTA). */
describe("FreelanceCTA", () => {
  it("renders the heading and a call-to-action link to /about", () => {
    render(<FreelanceCTA />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Like how I think?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /say hello/i })).toHaveAttribute("href", "/about");
  });
});
